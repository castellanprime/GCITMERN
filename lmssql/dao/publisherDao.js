var db = require("./db");

var addPublisher = function(publisher, cb){
    db.executeQueryStmt('insert into tbl_publisher(publisherName, publisherAddress, publisherPhone) values(?, ?, ?)', 
        [publisher.publisherName, publisher.publisherAddress, publisher.Phone], cb);
}

var updatePublisherName = function(publisherId, publisherName, cb){
    db.executeQueryStmt('update tbl_publisher set publisherName = ? where publisherId = ?', 
        [publisherName, publisherId], cb);
}

var updatePublisherPhone = function(publisherId, publisherPhone, cb){
    db.executeQueryStmt('update tbl_publisher set publisherPhone = ? where publisherId = ?',
        [publisherPhone, publisherId], cb);
}

var updatePublisherAddress = function(publisherId, publisherAddress, cb){
    db.executeQueryStmt('update tbl_publisher set publisherAddress = ? where publisherId = ?',
        [publisherAddress, publisherId], cb);
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