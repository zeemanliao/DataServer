var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;

function DBStorage(info) {
    this.working = 0;
    this.poolSize = 10;
    this.host = info.host || 'localhost';
    this.port = info.port || 27017;
    this.database = info.database;
    var mongodbServer = new mongodb.Server(this.host, this.port, {
        auto_reconnect: true,
        poolSize: this.poolSize
    });
    this.db = new mongodb.Db(this.database, mongodbServer);
}

DBStorage.prototype.getNewID = function() {
    return new ObjectID();
};

DBStorage.prototype.listTable = function(callback) {
    var db = this.db;
    /* open db */
    db.open(function() {
        db.collections(function(err, data) {
            if (err)
                return console.log(err);

            var tableNames = [];
            for (var i in data) {
                var tableName = data[i].s.name;
                if (tableName.indexOf('system.') == -1)
                    tableNames.push(tableName);
            }
            callback(null, tableNames);
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
                if (data) {
                    callback(null, data);
                } else {
                    callback('Cannot found');
                }
            });
        });
    });

};

DBStorage.prototype.put = function(table, data, callback) {
    var db = this.db;
    /* open db */
    db.open(function() {
        /* Select 'contact' collection */
        db.collection(table, function(err, collection) {
            /* Update a data */
            collection.save(data, callback);
        });
    });
};

DBStorage.prototype.add = function(table, data, callback) {
    var self = this;
    var db = this.db;
    /* open db */
    db.open(function() {
        /* Select 'contact' collection */
        db.collection(table, function(err, collection) {
            /* Insert a data */
            collection.insert(data, function(err, reData) {
                if (reData) {

                    callback(null, reData);

                } else {
                    callback(err);
                }
            });
        });
    });
};

DBStorage.prototype.remove = function(table , id, callback) {
    var self = this;
    var db = this.db;
    db.open(function() {
        db.collection(table, function(err, collection) {
            collection.remove({_id:id}, function(err) {
                callback(err);
            });
        });
    });
};
/*
db.authenticate("game", "test", function(err, res) {

});
*/

module.exports = DBStorage;
