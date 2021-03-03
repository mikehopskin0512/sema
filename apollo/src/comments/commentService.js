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
    async: false,
    worker: false,
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
    const searchResults = index.search(searchQuery);
    const topResult = clip(commentBank[searchResults[0]].comment.replace(/<[^>]*>?/gm, ''), 300, { maxLines: 5 });
    return topResult;
};



// exports.index = index
// exports.commentBank = commentBank;
