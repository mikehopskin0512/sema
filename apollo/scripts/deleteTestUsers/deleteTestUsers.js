// Examples usage: 
// Before the run, you should change the variable DB_NAME on the necessary database name 
// Also you should change the variable USERS_EMAILS 
// 
// Command: mongo <DB_URL> --eval "const DB_NAME = '<DB_NAME>', USERS_EMAILS = ['<EMAIL>']" deleteTestUsers.js 
// 
// Description: 
// This script deletes all the test users from the database.
//

var db = db.getSiblingDB(DB_NAME)
const all_collections = db.getCollectionNames()

// check if DB_NAME start with phoenix_ and be a string
if (!DB_NAME.startsWith("phoenix_") || typeof DB_NAME !== "string") {
    print("DB_NAME should starts with phoenix_ and be a string")
    quit(1)
}

// check if USERS_EMAILS is not empty and will be array
if (USERS_EMAILS.length === 0 || !Array.isArray(USERS_EMAILS)) {
    print("USERS NAME should not be empty and should be Array")
    quit(1)
}

const users = db.users.find({
    username: { $in: USERS_EMAILS },
})

const recipient = db.invitations.find({
    recipient: { $in: USERS_EMAILS },
})
const users_id = recipient_id = new Array

while (users.hasNext()) {
    user = users.next()
    users_id.push(user["_id"])
    print(`User to delete: ${user["username"]} --- ${user["_id"]}`)
}

while (recipient.hasNext()) {
    recipient_id.push(recipient.next()["_id"])
}

repo_users = db.repositories.update({}, { $pull: { "repoStats.userIds": { $in: users_id } } }, { multi: true })
print(`Affected repository documents = ${repo_users["nModified"]}`)

all_collections.forEach(element => {
    const current_collection = db.getCollection(element)
    const documents_deleted = current_collection.deleteMany({
        $or: [{
                userId: { $in: users_id }
            },
            {
                "_id": { $in: users_id }
            },
            {
                "_id": { $in: recipient_id }
            }

        ]
    });
    print(`Current collection ${element} --- deleted documents = ${documents_deleted["deletedCount"]}`)
});