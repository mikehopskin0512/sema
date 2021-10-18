const conn = new Mongo();
const db = conn.getDB("phoenix");
const all_collections = db.getCollectionNames()

const non_sema_users = db.users.find({
    username: { $regex: /@(?!semasoftware\.com$)([^.]+\.)+.*$/ },
})

const non_sema_recipient = db.invitations.find({
    recipient: { $regex: /@(?!semasoftware\.com$)([^.]+\.)+.*$/ }
})

const non_sema_users_id = non_sema_recipient_id = new Array

while (non_sema_recipient.hasNext()) {
    user = non_sema_users.next()
    non_sema_users_id.push(user["_id"]);
    print(`User to delete: ${user["username"]}`)
}

while (non_sema_users.hasNext()) {
    non_sema_users_id.push(non_sema_users.next()["_id"]);
}

all_collections.forEach(element => {
    const current_collection = db.getCollection(element)
    const documents_deleted = current_collection.deleteMany({
        $or: [{
                userId: { $in: non_sema_users_id }
            },
            {
                "_id": { $in: non_sema_users_id }
            },
            {
                "_id": { $in: non_sema_recipient_id }
            }

        ]
    });
    print(`Current collection ${element} --- deleted documents = ${documents_deleted["deletedCount"]}`)
});