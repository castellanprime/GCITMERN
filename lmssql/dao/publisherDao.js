var db = require("./db");

var addPublisher = function(publisher, cb){
    db.executeQueryStmt('insert into tbl_publisher(publisherName, publisherAddress, publisherPhone) values(?, ?, ?)', 
        [publisher.publisherName, publisher.publisherAddress, publisher.publisherPhone], cb);
}

var updatePublisherName = function(publisher, cb){
    db.executeQueryStmt('update tbl_publisher set publisherName = ? where publisherId = ?', 
        [publisher.publisherName, publisher.publisherId], cb);
}

var updatePublisherPhone = function(publisher, cb){
    db.executeQueryStmt('update tbl_publisher set publisherPhone = ? where publisherId = ?', 
        [publisher.publisherPhone, publisher.publisherId], cb);
}

var updatePublisherAddress = function(publisher, cb){
    db.executeQueryStmt('update tbl_publisher set publisherAddress = ? where publisherId = ?', 
        [publisher.publisherAddress, publisher.publisherId], cb);
}

var deletePublisher = function(publisherId, cb){
    db.executeQueryStmt('delete from tbl_publisher where publisherId = ?', [publisherId], cb);
}

var getPublisher = function(publisherId, cb){
    db.executeQueryStmt('select * from tbl_publisher where publisherId = ?', [publisherId], cb);
}

var getAllPublishers = function(cb){
    db.getAllObjects('select * from tbl_publisher', cb);
}

module.exports = {
    addPublisher,
    getPublisher,
    getAllPublishers,
    deletePublisher,
    updatePublisherName,
    updatePublisherAddress,
    updatePublisherPhone
};