const conn = new Mongo();
const db = conn.getDB("phoenix");
const all_collections = db.getCollectionNames()


const list_of_external_users = [
    "abonyimichael@gmail.com",
    "andrew.b@semalab.com",
    "aslanlin21@gmail.com",
    "codykenny@gmail.com",
    "dprachi2607@gmail.com",
    "justin@digitalchamps.com",
    "mattvanitallie@gmail.com",
    "sema.test.code.author@gmail.com",
    "semacodereviewtester1000@protonmail.com",
    "vnkgd@mail.ru"
]

const non_sema_users = db.users.find({
    $and: [
        { username: { $not: {$regex: /.*@semasoftware.com.*/ }}},
        { username: { $nin: list_of_external_users } }
    ]
})

const non_sema_recipient = db.invitations.find({
    recipient: { $regex: /@(?!semasoftware\.com$)([^.]+\.)+.*$/ }
})

const non_sema_users_id = non_sema_recipient_id = new Array

while (non_sema_users.hasNext()) {
    user = non_sema_users.next()
    non_sema_users_id.push(user["_id"]);
    print(`User to delete: ${user["username"]}`)
}

while (non_sema_recipient.hasNext()) {
    non_sema_recipient_id.push(non_sema_recipient.next()["_id"]);
}


repo_users = db.repositories.update({}, { $pull: { "repoStats.userIds": { $in: non_sema_users_id } } }, { multi: true })
print(`Affected repository documents = ${repo_users["nModified"]}`)

all_collections.forEach(element => {
    const current_collection = db.getCollection(element)
    const documents_deleted = current_collection.deleteMany({
        $or: [{
                "userId": { $in: non_sema_users_id }
            },
            {
                "_id": { $in: non_sema_users_id }
            },
            {
                "_id": { $in: non_sema_recipient_id }
            },
            {
                "user": { $in: non_sema_users_id }
            }

        ]
    });
    print(`Current collection ${element} --- deleted documents = ${documents_deleted["deletedCount"]}`)
});
