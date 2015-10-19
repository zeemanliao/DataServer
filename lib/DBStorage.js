var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;

function DBStorage(info) {
    this.working = 0;
    this.poolSize = 10;
    this.host = info.host || 'localhost';
    this.port = info.port || 27017;
    this.database = info.database;
    this.uri = "mongodb://" + this.host +":"+this.port+"/" + this.database + '?w=1';
/*
    var mongodbServer = new mongodb.Server(this.host, this.port, {
        auto_reconnect: true,
        poolSize: this.poolSize
    });
    this.db = new mongodb.Db(this.database, mongodbServer);
*/
    this.dbClient = new MongoClient(new mongodb.Server(this.host, this.port, {
        auto_reconnect: true,
        poolSize: this.poolSize,
        native_parser: true
    }));
 }

DBStorage.prototype.getNewID = function() {
    return new ObjectID();
};

DBStorage.prototype.createTable = function(tableName, callback) {
    var db = this.db;
    //db.open(function(err, db) {
        var collection = db.collection(tableName);
        callback(err, collection);
    //});
};

DBStorage.prototype.listTable = function(callback) {
    /* open db */
    //db.open(function(err, db) {
    this.dbClient.connect(this.uri, function(err, db) {
        db.collections(function(err, data) {
            var tableNames = [];
            if (!err) {
                for (var i in data) {
                    var tableName = data[i].s.name;
                    if (tableName.indexOf('system.') == -1)
                        tableNames.push(tableName);
                }
            }
            db.close();
            callback(err, tableNames);
        });
    });
};

DBStorage.prototype.get = function(table, idx, callback) {
    var db = this.db;

    /* open db */
    db.open(function() {
        /* Select 'contact' collection */
        db.collection(table, function(err, collection) {
            /* Querying */
            collection.find(idx).toArray(function(err, data) {
                /* Found this People */
                callback(err, data);
            });
        });
    });

};

DBStorage.prototype.put = function(table, data, callback) {
    var db = this.db;
    /* open db */
    //db.open(function() {
        /* Select 'contact' collection */
        db.collection(table, function(err, collection) {
            /* Update a data */
           collection.save(data, callback);
        });
    //});
};

DBStorage.prototype.remove = function(table , id, callback) {
    var self = this;
    var db = this.db;
    //db.open(function() {
        db.collection(table, function(err, collection) {
            collection.remove({_id:id}, function(err) {
                callback(err);
            });
        });
    //});
};
/*
db.authenticate("game", "test", function(err, res) {

});
*/

module.exports = DBStorage;
