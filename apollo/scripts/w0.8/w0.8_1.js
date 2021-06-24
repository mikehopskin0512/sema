// *****************************************************************************
// **  TICKET: PHX-973                                                        **
// **  DESCRIPTION: Move commentId to githubMetadata.commentId                **
// **  NOTES: Execute commands in MongoDB manager                             **
// *****************************************************************************

// 1.
db.getCollection('smartComments').dropIndex('commentId_1')
// 2.
db.getCollection('smartComments').update({}, { $rename: { 'commentId': 'githubMetadata.commentId' } }, false, true)