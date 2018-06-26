var db = require('./db');

var getAllBooks = function(cb){
    db.getAllObjects('select * from tbl_book', cb);
}

var getBook = function(bookId, cb){
    db.getOneObject('select * from tbl_book tba where tba.bookId = ?', [bookId], cb);
}

var getAllBooksForAGenre = function(genreId, cb){
    db.executeQueryStmt('select tbg.bookId, tb.title, tb.pubId from tbl_book_genres tbg, tbl_book tb where tbg.bookId = tb.bookId and tbg.genre_Id = ?', 
        [genreId], cb);
}

var addBook = function(book, cb){
    db.executeQueryStmt('insert into tbl_book (title, pubId) values (?, ?)', [book.title, book.pubId], cb);
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

var getAuthorsGenresForABook = function(bookId, cb){
    let sqlString = "select tg.genre_id, tg.genre_name, ta.authorId, ta.authorName from tbl_book_authors tba, tbl_book_genres tbg,"
        + "tbl_author ta, tbl_genre tg, tbl_book tb where tbg.genre_id = tg.genre_id and tbg.bookId = tb.bookId and "
        +" tba.authorId = ta.authorId and tba.bookId = tb.bookId and tb.bookId = ?"
    db.executeQueryStmt(sqlString,[bookId], cb);
}

module.exports = {
    addBook,
    addBookAuthors,
    addBookGenres,
    deleteBook,
    getBooksByAuthorId,
    getBook,
    getAllBooks,
    getAuthorsGenresForABook,
    getAllBooksForAGenre,
    updateBookTitle,
    updateBookPublisher
};