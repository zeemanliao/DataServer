'use strict';
let mongodb = require('mongodb');
let ObjectID = require('mongodb').ObjectID;
function DBStorage(info) {
	this.host = info.host || 'localhost';
	this.port = info.port || 27017;
	this.database = info.database;
	let mongodbServer = new mongodb.Server(this.host, this.port, { auto_reconnect: true, poolSize: 10 });
	this.db = new mongodb.Db(this.database, mongodbServer);
}

DBStorage.prototype.getNewID = function() {
	return new ObjectID();
}

DBStorage.prototype.listTable = function(callback) {
	let self = this;
	let db = this.db;
	/* open db */
	db.open(function() {
		db.collections(function(err, data){
			if (err)
				return console.log(err);

			let tableNames = new Array();
			for (var i in data) {
				var tableName = data[i].s.name;
				if (tableName.indexOf('system.') == -1)
					tableNames.push(tableName);
			}
			callback(null, tableNames);
		});
	});
}

DBStorage.prototype.get = function(table, idx, callback) {
	let self = this;
	let db = this.db;
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

DBStorage.prototype.put = function(table, idx, data, callback) {
	let db = this.db;
	/* open db */
	db.open(function() {
	    /* Select 'contact' collection */
	    db.collection(table, function(err, collection) {
	        /* Update a data */
	        collection.update({_id:idx}, data);
	    });
	});
};

DBStorage.prototype.add = function(table, data, callback) {
	let self = this;
	let db = this.db.server;
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
}

/*
db.authenticate("game", "test", function(err, res) {

});
*/

module.exports = DBStorage;