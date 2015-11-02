var mongodb = require('mongodb');
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;

function DBStorage(info) {
    this.poolSize = 10;
    this.host = info.host || 'localhost';
    this.port = info.port || 27017;
    this.database = info.database;
    this.uri = "mongodb://" + this.host +":"+this.port+"/" + this.database + '?w=1';

    this.dbClient = new MongoClient(new mongodb.Server(this.host, this.port, {
        auto_reconnect: true,
        poolSize: this.poolSize,
        native_parser: true
    }));
 }

/**
 * 取得ObjectID
 * 
 * @param {String} [_id] 要取得的ID,如要新建就不傳此值
 */
DBStorage.prototype.getNewID = function(_id) {
    return new ObjectID(_id);
};

/**
 * 建立資料表清單
 * 
 * @param {String} tableName 要建立的資料表名稱
 * @param {function} callback 回調函數
 */
DBStorage.prototype.createTable = function(tableName, callback) {
    this.dbClient.connect(this.uri, function(err, db) {
        if (err)
            return callback(err);

        var collection = db.collection(tableName);
        callback(null, collection);
    });
};

/**
 * 取得資料表清單
 * 
 * @param {function} callback 回調函數
 */
DBStorage.prototype.listTable = function(callback) {
    this.dbClient.connect(this.uri, function(err, db) {
        if (err)
            return callback(err);
        db.collections(function(err, data) {
            if (err)
                return callback(err);
            var tableNames = [];
            for (var i in data) {
                var tableName = data[i].s.name;
                if (tableName.indexOf('system.') == -1) {
                    tableNames.push(tableName);
                }
            }
            db.close();
            callback(err, tableNames);
        });
    });
};

/**
 * 取得資料
 * 
 * @param {String} table 資料表名稱
 * @param {Json} filter 查詢條件
 * @param {function} callback 回調函數
 */
DBStorage.prototype.get = function(table, filter, callback) {
    //var db = this.db;

    /* open db */
    //db.open(function() {
    this.dbClient.connect(this.uri, function(err, db) {
        if (err)
            return callback(err);
        /* Select 'contact' collection */
        db.collection(table, function(err, collection) {
            if (err)
                return callback(err);
            /* Querying */
            collection.find(filter).toArray(function(err, data) {
                if (err)
                    return callback(err);
                /* Found this People */
                db.close();
                callback(null, data);
            });
        });
    });

};

DBStorage.prototype.put = function(table, datas, callback) {
    var db = this.db;
    /* open db */
    //db.open(function() {
    this.dbClient.connect(this.uri, function(err, db) {
        if (err)
            return callback(err);
        /* Select 'contact' collection */
        db.collection(table, function(err, collection) {
            if (err) {
                db.close();
                return callback(err);
            }
            /* Update a data */
            for (var i in datas) {
                collection.save(datas[i],{w:0});
            }
            callback(null,{});
            /*
            collection.save(data, {w:0}, function(err, result) {
                db.close();
                if (err) {
                    callback(err);
                } else {
                    callback(null, {allowed:result.ok});
                }
            });
*/
        });
    });
};

DBStorage.prototype.remove = function(table , id, callback) {
    var self = this;
    var db = this.db;
    //db.open(function() {
    this.dbClient.connect(this.uri, function(err, db) {
        db.collection(table, function(err, collection) {
            collection.remove({id:2}, {safe: true}, function(err, result) {
                db.close();
                callback(err,{allowed:result.result.n});
            });
        });
    });
};
/*
db.authenticate("game", "test", function(err, res) {

});
*/

module.exports = DBStorage;
