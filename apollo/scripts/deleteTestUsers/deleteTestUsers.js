// Examples usage: 
// Before the run, you should change the variable DB_NAME on the necessary database name 
// Also you should change the variable USERS_NAME 
// 
// Command: mongo <DB_URL> deleteTestUsers.js 
// 
const DB_NAME = "phoenix_qa" // Might be used phoenix_prod 
const USERS_NAME = ["artem@semasoftware.com"]

var db = db.getSiblingDB(DB_NAME)
const all_collections = db.getCollectionNames()
if (!Array.isArray(USERS_NAME)) {
    print("USERS NAME should be Array")
    quit(1)
}

const users = db.users.find({
    username: { $in: USERS_NAME },
})

const recipient = db.invitations.find({
    recipient: { $in: USERS_NAME },
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