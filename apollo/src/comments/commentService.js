'use strict';
const fs = require('fs');
var FlexSearch = require("flexsearch");

let rawdata = fs.readFileSync(__dirname+'/commentBank.json');
let commentBank = JSON.parse(rawdata);

var index = new FlexSearch({
    encode: "balance",
    tokenize: "full",
    threshold: 0,
    depth: 5,
    async: true,
    worker: 1,
    cache: true,
    stemmer: "en"
});

let reportEvery = Math.floor(commentBank.length / 10)

commentBank.forEach(function(comment, i) {
    index.add(i, comment.comment);
    if( i % reportEvery == 0 ){
        console.log("Building comment bank search index: "+i +" / "+commentBank.length + " done");
    }
}); 


export const searchTopComment = async (searchQuery) => {
    const searchResults = await index.search(searchQuery);
    let returnResults = [];
    if(searchResults.length>0){
        returnResults.push(commentBank[searchResults[0]]);
    }
    return returnResults;
};



// exports.index = index
// exports.commentBank = commentBank;
