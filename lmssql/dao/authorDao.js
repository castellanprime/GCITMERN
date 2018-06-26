var db = require("./db");

var getAllAuthors = function(cb){
    db.getAllObjects('select * from tbl_author', cb);
}

var addAuthor = function(author, cb){
    db.executeQueryStmt('insert into tbl_author(authorName) values(?)', [author.authorName], cb);
}

var deleteAuthor = function(authorId, cb){
    db.executeQueryStmt('delete from tbl_author where authorId = ?', [authorId], cb);
}

var updateAuthor = function(authorName, authorId, cb){
    db.executeQueryStmt('update tbl_author set authorName = ? where authorId = ?', [authorName, authorId], cb);
}

var getAuthor = function(authorId, cb){
    db.getOneObject('select * from tbl_author ta where ta.authorId = ?', [authorId], cb);
}

var getAllAuthorsForABook = function(book, cb){
    db.executeQueryStmt('select tba.authorId, ta.authorName from tbl_book_authors tba, tbl_author ta where tba.authorId = ta.authorId and tba.bookId = ?',
        [book.bookId], cb);
}

var getAllBooksForAnAuthor = function(authorId, cb){
    db.executeQueryStmt('select tb.bookId as bookId, title from tbl_book_authors tba, tbl_book tb where tba.bookId = tb.bookId and tba.authorId = ?',
        [authorId], cb);
}

var removeAuthorFromABook = function(authorId, bookId, cb){
    db.executeQueryStmt('delete from tbl_book_authors where authorId = ? and bookId = ?', [authorId, bookId], cb);
}

module.exports = {
    getAllAuthors,
    addAuthor,
    deleteAuthor,
    updateAuthor,
    getAuthor,
    getAllAuthorsForABook,
    getAllBooksForAnAuthor,
    removeAuthorFromABook
};