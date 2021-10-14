#!/bin/bash
set -eo pipefail

BASE_DIR=~/db_backups/
BACKUP_PATH=mongo/"$(date '+%Y%m%d%H%M%S')"
ANON_BACKUP_PATH=mongo/"anonymized-$(date '+%Y%m%d%H%M%S')"
DB_DUMP_DIR="${BASE_DIR}${BACKUP_PATH}"
ANON_DUMP_DIR="${BASE_DIR}${ANON_BACKUP_PATH}"
RESTORE_DB_DUMP_DIR="${DB_DUMP_DIR}/phoenix_prod"
mkdir -p "${DB_DUMP_DIR}"

mongodump --quiet --uri="mongodb+srv://phoenix_admin:DnUKm3vsf3C3zaym@sema-cluster.tpplx.mongodb.net/phoenix_prod?authSource=admin&replicaSet=atlas-bjp57o-shard-0&readPreference=primary&appname=MongoDB%20Compass&retryWrites=false&ssl=true" -o $DB_DUMP_DIR
tar -czf "${DB_DUMP_DIR}".tgz -C "${DB_DUMP_DIR}" phoenix_prod

echo "Checking mongodb container"
if ! sudo docker ps --format "table {{.Names}}" | grep -q mongo; then
    echo "It does not exist. Pulling..."
    sudo docker run --name mongo --publish 27017:27017 -d mongo:4.4.9
else
    echo "The container exists"
fi

echo "Checking prod dir"
if [[ -d ${RESTORE_DB_DUMP_DIR} ]]; then
    echo "Restoring prod backup to the mongodb container"
    mongorestore --db phoenix "${RESTORE_DB_DUMP_DIR}"

    echo "Checking js script"
    if [[ -f "./anonymization_mongodb_data.js" ]]; then
        mongo localhost:27017/phoenix anonymization_mongodb_data.js
    else
        echo "Js script does not exist" && exit
    fi
    echo "Getting dump from mongodb container without non-sema users"
    mongodump --db=phoenix -o "${ANON_DUMP_DIR}"
fi

tar -czf "${ANON_DUMP_DIR}".tgz -C "${ANON_DUMP_DIR}" phoenix

echo "Checking mongodb container"
if sudo docker ps --format "table {{.Names}}" | grep -q mongo; then
    echo "Killing mongodb container"
    sudo docker rm --force mongo
fi

set +eo pipefail

cd "${ANON_DUMP_DIR}/phoenix" || exit
#  flatten array
# https://stackoverflow.com/a/37555908/771112
for line in *.bson; do
    bsondump $line >${line%.bson}.json
    cat ${line%.bson}.json | jq '[leaf_paths as $path | {"key": $path | join("."), "value": getpath($path)}] | from_entries' | jq -s >${line%.bson}.flat.json
    /usr/local/bin/json2csv -i ${line%.bson}.flat.json -o ${line%.bson}.csv
done

# convert to sqlite
# https://stackoverflow.com/a/6977523/771112
# https://stackoverflow.com/a/49826327/771112
# https://stackoverflow.com/a/41788666/771112

# http://10.1.3.25/mongo/20210714113613/apollo/
