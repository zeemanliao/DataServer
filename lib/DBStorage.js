"use strict";
let Server = require('mongodb').Server;
let ObjectID = require('mongodb').ObjectID;
let MongoClient = require('mongodb').MongoClient;

function DBStorage(config) {
    let self = this;
    this.config = getConfig(config);
    this.uri = "mongodb://" + this.config.host +":"+this.config.port+"/" + this.config.dbname + '?w=1';
/*
    this.dbClient = new MongoClient(new Server(this.config.host, this.config.port), {
        auto_reconnect: true,
        poolSize: this.config.poolSize,
        native_parser: true
    });
 */
    MongoClient.connect(this.uri, function(err, db) {
        if (err)
            throw err;

        self.db = db;
    });
 }

function getConfig(config) {
    if (!config)
        throw new Error('DBStorage config not defined!');

    if (!config.name)
        throw new Error('DBStorage config.name not defined!');

    return {
        dbname:config.name,
        port:config.port || 27017,
        host:config.host || 'localhost',
        poolSize: config.poolSize || 10
    };
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

        let collection = db.collection(tableName);
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
            let tableNames = [];
            for (let i in data) {
                let tableName = data[i].s.name;
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
DBStorage.prototype.get2 = function(table, filter, callback) {
    //let db = this.db;

    /* open db */
    //db.open(function() {
    MongoClient.connect(this.uri, function(err, db) {
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

/**
 * 取得資料
 * 
 * @param {String} table 資料表名稱
 * @param {Json} filter 查詢條件
 * @param {function} callback 回調函數
 */
DBStorage.prototype.get = function(table, filter, callback) {
    let self = this;
    if (!this.db) {
        return setTimeout(function() {self.get(table,filter,callback);},100);
    }
    this.db.collection(table, function(err, collection) {
        if (err)
            return callback(err);
        /* Querying */
        collection.find(filter).toArray(function(err, data) {
            if (err)
                return callback(err);
            /* Found this People */
            //db.close();
            callback(null, data);
        });
    });

};

DBStorage.prototype.put = function(table, datas, callback) {
    let self = this;
    if (!this.db) {
        return setTimeout(function() {self.get(table,filter,callback);},100);
    }
    this.db.collection(table, function(err, collection) {
        if (err) {
            return callback(err);
        }
        /* Update a data */
        for (let i in datas) {
            collection.save(datas[i],{w:0});
        }
        callback(null,{});
    });

};

DBStorage.prototype.remove = function(table , id, callback) {
    let self = this;
    let db = this.db;
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
