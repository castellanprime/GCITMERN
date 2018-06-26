var db = require('./db');

var getAllBooks = function(cb){
    db.getAllObjects('select * from tbl_book', cb);
}

var getBook = function(bookId, cb){
    db.getOneObject('select * from tbl_book tba where tba.bookId = ?', [bookId], cb);
}

var getAllBooksForAnAuthor = function(authorId, cb){
    db.executeQueryStmt('select tba.bookId, tb.title, tb.pubId from tbl_book_authors tba, tbl_book tb where tba.bookId = tb.bookId and tba.authorId = ?',
        [authorId], cb);
}

var getAllBooksForAGenre = function(genreId, cb){
    db.executeQueryStmt('select tbg.bookId, tb.title, tb.pubId from tbl_book_genres tbg, tbl_book tb where tbg.bookId = tb.bookId and tbg.genre_Id = ?', 
        [genreId], cb);
}

var addBook = function(book, cb){
    db.executeQueryStmt('insert into tbl_book (title, pubId) values (?, ?)', [book.title, book.publisher.publisherId], cb);
}

var addBookAuthors = function(bookId, authorId, cb){
    db.executeQueryStmt('insert into tbl_book_authors values (?, ?)', [bookId, authorId], cb);
}

var getBooksByAuthorId = function(authorId, cb){
    db.executeQueryStmt('select * from tbl_book where bookId in (select bookId from tbl_book_authors where authorId =?)', [authorId], cb);
}

var addBookGenres = function(bookId, genreId, cb){
    db.executeQueryStmt('insert into tbl_book_genres(genre_Id, bookId) values (?, ?)', [genreId, bookId], cb);
}

var updateBookTitle = function(title, bookId, cb){
    db.executeQueryStmt('update tbl_book set title = ? where bookId = ?', [title, bookId], cb);
} 

var updateBookPublisher = function(pubId, bookId, cb){
    db.executeQueryStmt('update tbl_book set pubId = ? where bookId = ?', [pubId, bookId], cb);
}

var deleteBook = function(bookId, cb){
    db.executeQueryStmt('delete from tbl_book where bookId = ?', [bookId], cb);
}

module.exports = {
    addBook,
    addBookAuthors,
    addBookGenres,
    deleteBook,
    getBooksByAuthorId,
    getBook,
    getAllBooks,
    getAllBooksForAnAuthor,
    getAllBooksForAGenre,
    updateBookTitle,
    updateBookPublisher
};