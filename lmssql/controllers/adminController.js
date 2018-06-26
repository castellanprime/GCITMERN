var routes = require("express").Router();
let authorDao = require('../dao/authorDao');
let bookDao = require('../dao/bookDao');
let libraryBranchDao = require('../dao/libraryBranchDao');
let publisherDao = require('../dao/publisherDao');
let genreDao = require('../dao/genreDao');
let bookLoanDao = require('../dao/bookLoanDao');
let libraryBookCopiesDao = require('../dao/libraryBookCopiesDao');


var getBookById = function(bookId, books){
    for (let i in books){
        let data = books[i];
        if (data.bookId === bookId){
            return data;
        }
    }
    return null;
}

var getBorrowerById = function(cardNo, borrowers){
    for (let i in borrowers){
        let data = borrowers[i];
        if (data.cardNo === cardNo){
            return data;
        }
    }
    return null;
}

var getBranchById = function(branchId, branches){
    for (let i in branches){
        let data = branches[i];
        if (data.branchId === branchId){
            return data;
        }
    }
    return null;
}

var getPublisherById = function(publisherId, publishers){
    for (let i in publishers){
        let data = publishers[i];
        if (data.publisherId === publisherId){
            return data;
        }
    }
    return null;
}

var getBookLoanByDateOut = function(bookLoans, bookId, cardNo, dateOut){
    for (let i in bookLoans){
        let data = bookLoans[i];
        if (data.bookId === bookId && data.cardNo === cardNo && data.dateOut.getTime() === dateOut.getTime()){
            return data;
        }
    }
    return null;
}

routes.post('/authors', function(req, res){
    let author = req.body;  
    authorDao.addAuthor(author, function(err, result){
        if (err){
            res.status(400);
            res.send('Add Author Failed');
        } 
        authorDao.getAuthor(result.insertId, function(err1, result1){
            if (err1){
                res.status(500);
                res.send("Error retrieving new created author with id: ", result.insertId);
            }
            res.status(201);
            console.log("1 record inserted");
            let objUrl = "/admin/authors/" + result.insertId;
            res.location(objUrl);
            res.send(result1);
        });  
    });
});

routes.patch('/authors/:authorId', function(req, res){
    let authorName = req.body.authorName;
    authorDao.updateAuthor(authorName, req.params.authorId, function(err, result){
        if (err){
            res.status(400);
            res.send("Edit Author Failed");
        }
        authorDao.getAuthor(req.params.authorId, function(err1, result1){
            if (err1){
                res.status(500);
                res.send("Error retrieving new created author with id: ", req.params.authorId);
            }
            res.status(200);
            console.log("1 record edited");
            res.send(result1);
        });
    });
});

routes.get('/authors/:authorId', function(req, res){
    authorDao.getAuthor(req.params.authorId, function(err, result){
        if (err){
            res.status(404);
            res.send("Author Not Found");
        }
        res.status(200);
        console.log("1 record retrieved");
        res.send(result);
    });
});

routes.delete('/authors/:authorId', function(req, res){
    authorDao.deleteAuthor(req.params.authorId, function(err, result){
        if (err){
            res.status(404);
            res.send("Author Not Found");
        }
        res.status(204).send();
        console.log("1 record deleted");
    });
});

routes.delete('/authors/:authorId/books/:bookId', function(req, res){
    authorDao.removeAuthorFromABook(req.params.authorId, req.params.bookId, function(err, result){
        if (err){
            res.status(400);
            res.send("Bad Request");
        }
        res.status(204).send();
        console.log("1 record altered");
    });
});

routes.get('/authors', function(req, res){
    authorDao.getAllAuthors(function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(result);
    })
});

routes.get('/authors/all', function(req, res){
    authorDao.getAllAuthorsWithBooks(function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(200);
        let st = result.length + " Records Returned";
        let resToSend = [], tempObjArr = {}, tempData = null;
        for (index in result){
            tempData = result[index];
            if (!tempObjArr[tempData.authorId]){
                tempObjArr[tempData.authorId] = {authorId: tempData.authorId, authorName: tempData.authorName};
                tempObjArr[tempData.authorId].books = [];
                let tempObj = Object.assign({}, tempData);
                delete tempData.authorId;
                delete tempData.authorName;
                tempObjArr[tempObj.authorId].books.push(tempData);
            } else {
                let tempObj1 = Object.assign({}, tempData);
                delete tempData.authorId;
                delete tempData.authorName;
                tempObjArr[tempObj1.authorId].books.push(tempData);
            }
        }
        for (var prop in tempObjArr){
            resToSend.push(tempObjArr[prop]);
        }
        console.log("Number of records to send: ", resToSend.length);
        res.send(resToSend);
    });
});

routes.post('/branches', function(req, res){
    let libraryBranch = req.body;
    libraryBranchDao.addLibraryBranch(libraryBranch, function(err, result){
        if (err){
            res.status(400);
            res.send("Add Branch Failed");
        }
        libraryBranchDao.getBranch(result.insertId, function(err1, result1){
            if (err1){
                res.status(500);
                res.send("Error retrieving branch for id: ", result.insertId);
            }
            res.status(201);
            console.log("1 record inserted");
            let objUrl = "/admin/branches/" + result.insertId;
            res.location(objUrl);
            res.send(result1);
        }); 
    });
});

routes.patch('/branches/:branchId', function(req, res){
    let libraryBranch = req.body;
    if (Reflect.has(libraryBranch, 'branchName') === true){
        libraryBranchDao.updateBranchName(libraryBranch, function(err, result){
            if (err){
                res.status(400);
                res.send("Update Branch Name Failed");
            } 
        });
    } 
    if (Reflect.has(libraryBranch, 'branchAddress') === true){
        libraryBranchDao.updateBranchAddress(libraryBranch, function(err, result){
            if (err){
                res.status(404);
                res.send("Not Found");
            }
        });
    }
    libraryBranchDao.getBranch(req.params.branchId, function(err1, result1){
        if (err1){
            res.status(400);
            res.send("Error retrieving branch for id: ", result.insertId);
        }
        res.status(200);
        console.log("1 record updated");
        res.send(result1);
    }); 
});

routes.delete('/branches/:branchId', function(req, res){
    libraryBranchDao.deleteBranch(req.params.branchId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(410);
        console.log("1 record deleted");
        res.send("Branch removed");
    });
});

routes.get('/branches', function(req, res){
    libraryBranchDao.getAllBranches(function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        for (let index in result){
            let books = [];
            let branch = result[index];
            bookDao.getAllBooks(function(err1, result1){
                if (err1){
                    res.status(404);
                    res.send("Not Found");
                }
                libraryBookCopiesDao.getAllBooksForABranch(branch.branchId, function(err2, result2){
                    if (err2){
                        res.status(500);
                        res.send("Error retrieving books for a branch: ", branch.branchId);
                    }
                    for (let i in result2){
                        let data1 = result2[i];
                        if (data1.noOfCopies > 0){
                            let book = getBookById(data1.bookId, result1);
                            books.push(book);
                        }
                    }
                    result[index].books = books;      
                });
            });
        }
        res.status(200);
        console.log("No of records returned: ", result.length);
        res.send(result);
    });
});

routes.post('/publishers', function(req, res){
    let publisher = req.body;
    publisherDao.addPublisher(publisher, function(err, result){
        if (err){
            res.status(404);
            res.send("Add Publisher Failed");
        }
        publisherDao.getPublisher(result.insertId, function(err1, result1){
            if (err1){
                res.status(500);
                res.send("Error retrieving new created publisher");
            }
            res.status(201);
            console.log("1 record inserted");
            let objUrl = "/admin/publishers/" + result.insertId;
            res.location(objUrl);
            res.send(result1);
        });
    });
});

routes.patch('/publishers/:publisherId', function(req, res){
    let publisher = req.body;
    if (Reflect.has(publisher, 'publisherName') === true){
        publisherDao.updatePublisherName(publisher, function(err, result){
            if (err){
                res.status(500);
                res.send("Update Publisher Name Failed");
            }
        });
    }
    if (Reflect.has(publisher, 'publisherAddress') === true){
        publisherDao.updatePublisherAddress(publisher, function(err, result){
            if (err){
                res.status(500);
                res.send("Update Publisher Address Failed");
            }
        });
    }
    if (Reflect.has(publisher, 'publisherPhone') === true){
        publisherDao.updatePublisherPhone(publisher, function(err, result){
            if (err){
                res.status(500);
                res.send("Update Publisher Phone Failed");
            }
        });
    }
    publisherDao.getPublisher(req.params.publisherId, function(err, result){
        if (err){
            res.status(400);
            res.send("Error retrieving branch for id: ", req.params.publisherId);
        }
        res.status(200);
        console.log("1 record updated");
        res.send(result);
    });
});

routes.delete('/publishers/:publisherId', function(req, res){
    publisherDao.deletePublisher(req.params.publisherId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(410);
        console.log("1 record deleted");
        res.send("Publisher removed");
    });
});

routes.get('/publishers', function(req, res){
    publisherDao.getAllPublishers(function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(result);
    })
});

routes.get('/publishers/:publisherId', function(req, res){
    publisherDao.getPublisher(req.params.publisherId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(200);
        res.send(result);
    })
});

routes.post('/books', function(req, res){
    let bookDto = req.body;
    bookDao.addBook(bookDto, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        bookDao.getBook(result.insertId, function(err1, result1){
            if (err1){
                res.status(500);
                res.send("Error retrieving newly created book");
            }
            res.status(201);
            console.log("1 record inserted");
            let objUrl = "/admin/book/" + result.insertId;
            res.location(objUrl);
            res.send(result1);
        });
    });
});

routes.delete('/books/:bookId', function(req, res){
    bookDao.deleteBook(req.params.bookId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(410);
        console.log("1 record deleted");
        res.send("Book removed");
    });
});

routes.get('/books/:bookId', function(req, res){
    bookDao.getBook(req.params.bookId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(200);
        res.send(result);
    });
});

routes.get('/books', function(req, res){
    bookDao.getAllBooks(function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        for (let index in result){
            let book = result[index];
            genreDao.getAllGenresForABook(book.bookId, function(err1, result1){
                if (err1){
                    res.status(500);
                    res.send("Error retrieving genres for a book: ", book.bookId);
                }
                book['genres'] = result1;
                authorDao.getAllAuthorsForABook(book.bookId, function(err2, result2){
                    if (err2){
                        res.status(500);
                        res.send("Error retrieving authors for a book: ", book.bookId);
                    }
                    book['authors'] = result2;
                    publisherDao.getPublisher(book.pubId, function(err3, result3){
                        if (err3){
                            res.status(500);
                            res.send("Error retrieving publisher for a book: ", book.bookId);
                        }
                        book['publisher'] = result3;
                    });
                });
            });
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(result);
    });
});

routes.patch('/books/:bookId', function(req, res){
    let bookDto = req.body;
    bookDao.getBook(req.params.bookId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        if (Reflect.has(bookDto, 'title') === true){
            bookDao.updateBookTitle(bookDto.title, req.params.bookId, function(err1, result1){
                if (err1){
                    res.status(500);
                    res.send("Error updating title for book: ", book.bookId);
                }
            });
        }
        if (Reflect.has(bookDto, 'pubId') === true){
            bookDao.updateBookPublisher(bookDto.pubId, req.params.bookId, function(err2, result2){
                if (err2){
                    res.status(500);
                    res.send("Error updating publisher for book: ", book.bookId);
                }
            });
        }
        if (Reflect.has(bookDto, 'authorId') === true){
            bookDao.addBookAuthors(req.params.bookId, bookDto.authorId, function(err3, result3){
                if (err3){
                    res.status(500);
                    res.send("Error updating author for book: ", book.bookId);
                }
            });
        }
        if (Reflect.has(bookDto, 'genreId') === true){
            bookDao.addBookGenres(req.params.bookId, bookDto.genreId, function(err3, result3){
                if (err3){
                    res.status(500);
                    res.send("Error updating genre for book: ", book.bookId);
                }
            });
        }
        bookDao.getBook(req.params.bookId, function(err4, result4){
            if (err4){
                res.status(404);
                res.send("Not Found Book");
            }
            res.status(200);
            res.send(result);
        });
    });
});

routes.post('/genres', function(req, res){
    let genre = req.body;
    genreDao.addGenre(genre, function(err, result){
        if (err){
            res.status(400);
            res.send("bad Request");
        }
        genreDao.getGenre(result.insertId, function(err1, result1){
            if (err1){
                res.status(500);
                res.send("Error retrieving newly created genre");
            }
            res.status(201);
            console.log("1 record inserted");
            let objUrl = "/admin/genres/" + result.insertId;
            res.location(objUrl);
            res.send(result1);
        });
    });
});

routes.patch('/genres/:genreId', function(req, res){
    genreDao.updateGenreName(req.params.genreId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        genreDao.getGenre(req.params.genreId, function(err1, result){
            if (err){
                res.status(500);
                res.send("Error updating name for genre:", req.params.genreId);
            }
            res.status(200);
            res.send(result);
        });
    });
});

routes.delete('/genres/:genreId', function(req, res){
    genreDao.deleteGenre(req.params.genreId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(204);
        console.log("1 record deleted");
        res.send("Genre removed");
    });
});

routes.delete('/genres/:genreId/book/:bookId', function(req, res){
    genreDao.removeGenreFromBook(req.params.genreId, req.params.bookId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(204);
        console.log("1 record altered");
        res.send("Book altered");
    });
});

routes.get('/genres', function(req, res){
    genreDao.getAllGenres(function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        for (let index in result){
            let genre = result[index];
            bookDao.getAllBooksForAGenre(genre.genreId, function(err1, result1){
                if (err1){
                    res.status(500);
                    res.send("Error retrieving books:", genre.genreId);
                }
                result[index].books = result1;
            });
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(result); 
    });
});

routes.get('/loans', function(req, res){
    let bookLoanDtos = [];
    bookLoanDao.getAllBookLoans(function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        for (let index in result){
            let bookLoan = result[index];
            let bookLoanDto = {};
            bookLoanDto['dateOut'] = bookLoan['dateOut'];
            bookLoanDto['dateIn'] = bookLoan['dateIn'];
            bookLoanDto['dueDate'] = bookLoan['dueDate'];
            bookDao.getAllBooks(function(err1, result1){
                if (err1){
                    res.status(500);
                    res.send("Error getting books");
                }
                let book = getBookById(bookLoan.bookId, result1);
                bookLoanDto['bookId'] = book;
                borrowerDao.getAllBorrowers(function(err2, result2){
                    if (err2){
                        res.status(500);
                        res.send("Error getting borrowers");
                    }
                    let borrower = getBorrowerById(bookLoan.cardNo, result2);
                    bookLoanDto['cardNo'] = borrower;
                    libraryBranchDao.getAllBranches(function(err3, result3){
                        if (err2){
                            res.status(500);
                            res.send("Error getting branches");
                        }
                        let branch = getBranchById(bookLoan.branchId, result3);
                        bookLoanDto['branch'] = branch;
                        bookLoanDtos.push(bookLoanDto);
                    });
                });
            });
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(bookLoanDtos); 
    });
});


routes.patch('/loans/dueDate', function(req, res){
    let bookLoan = req.body;
    bookLoanDao.changeDueDate(bookLoan, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        bookL = getBookLoanByDateOut(result, bookLoan.bookId, bookLoan.cardNo, bookLoan.dateOut);
        res.status(200);
        res.send(bookL);
    });
});

routes.get('/loans/:branchId/current', function(req, res){
    bookLoanDao.getCurrentLoansForBranch(req.params.branchId, function(err, result){
        if (err){
            res.status(404);
            res.send("Not Found");
        }
        res.status(200);
        let st = result.length + " Records Returned";
        console.log(st);
        res.send(result);
    });
});

module.exports = routes;