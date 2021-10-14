const DB_NAME = "phoenix"
const USERS_NAME = ["semacodereviewtester1000@protonmail.com"]

const conn = new Mongo();
const db = conn.getDB(DB_NAME);
const all_collections = db.getCollectionNames()

const users = db.users.find({
    username: { $in: USERS_NAME },
})

const recipient = db.invitations.find({
    recipient: { $in: USERS_NAME },
})

const users_id = recipient_id = new Array

while (users.hasNext()) {
    users_id.push(users.next()["_id"])
    print(`User to delete: ${users.next()["username"]}`)
}

while (recipient.hasNext()) {
    recipient_id.push(recipient.next()["_id"])
}

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