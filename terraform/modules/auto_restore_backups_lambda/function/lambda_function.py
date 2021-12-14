import os
import tarfile
import bson
import requests
from datetime import datetime
from bs4 import BeautifulSoup
from time import sleep


def drop_old_documents(conn):
    collection_names = conn.list_collection_names()

    for collection in collection_names:
        conn[collection].delete_many({})


def download_latest_backup(url, auth):
    """
    Download latest backup from web server
    :param url: URL of the web server with backups 
    :param auth: A tuple (username, password) for authentication in web server
    :return: Path of downloaded backup
    """
    list_of_backups = requests.get(url, auth=auth)
    html_list_of_backups = BeautifulSoup(list_of_backups.text, "html.parser")

    list_of_anonymized_backups = [{'file_name': backup['href']}
                                  for backup in html_list_of_backups.select('a[href^="anonymized"][href$=".tgz"]')]  # list of backups [{file_name:<name of backup>}]
    list_of_anonymized_backups.sort(key=lambda x: datetime.strptime(
        x['file_name'][11:25], '%Y%m%d%H%M%S'))  # sorting list of backups by date in the filename

    latest_backup_file_name = list_of_anonymized_backups[-1]["file_name"]

    download_url = f"{url}/{latest_backup_file_name}"
    latest_backup = requests.get(download_url, auth=auth)
    backup_path = f'/tmp/{latest_backup_file_name}'

    with open(backup_path, 'wb') as local_latest_backup:
        local_latest_backup.write(latest_backup.content)

    return backup_path


def extract_tar(tar_url, extract_path='.'):
    print(tar_url)
    tar = tarfile.open(tar_url, 'r')
    for item in tar:
        tar.extract(item, extract_path)
        if item.name.find(".tgz") != -1 or item.name.find(".tar") != -1:
            extract(item.name, "./" + item.name[:item.name.rfind('/')])


def db_restore(path, conn, db_name):
    """
    MongoDB Restore
    :param path: Database dumped path
    :param conn: MongoDB client connection
    :param db_name: Database name
    :return:

    >>> DB_BACKUP_DIR = '/path/backups/'
    >>> conn = MongoClient("mongodb://admin:admin@127.0.0.1:27017", authSource="admin")
    >>> db_name = 'my_db'
    >>> restore(DB_BACKUP_DIR, conn, db_name)

    """
    for coll in os.listdir(path):
        if coll.endswith('.bson') and os.stat(path+"/"+coll).st_size != 0:
            with open(os.path.join(path, coll), 'rb+') as f:
                conn[coll.split('.')[0]].insert_many(
                    bson.decode_all(f.read()), ordered=True)
                sleep(1)

    return True


def get_database(connection_string, database_name):
    """
    MongoDB Get database connection
    :param connection_string: A database connection string
    :return connection:
    """
    from pymongo import MongoClient
    import pymongo

    # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
    client = MongoClient(connection_string)

    # Create the database for our example (we will use the same database throughout the tutorial
    return client[f"{database_name}"]


def lambda_handler(event, context):
    url = 'http://10.1.3.25/mongo'
    connection_string = event["connection_string"]
    auth = (event["db_webserver_user"], event["db_webserver_password"])
    database_name = event["database_name"]
    extracted_backup_path = "/tmp/phoenix"

    try:
        db = get_database(connection_string, database_name)
        drop_old_documents(db)
        backup_path = download_latest_backup(url, auth)
        extract_tar(f'{backup_path}', "/tmp")
        db_restore(extracted_backup_path, db, database_name)
    except:
        return 1

    return 0
