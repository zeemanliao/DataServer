'use strict';

let mongodb = require('mongodb');

function GameStorage(dbInfo) {
	this.datas = {};
	this.host = dbInfo.host || 'localhost';
	this.port = dbInfo.port || 27017;
	this.database = dbInfo.database;
	
	let mongodbServer = new mongodb.Server(this.host, this.port, { auto_reconnect: true, poolSize: 10 });
	this.db = new mongodb.Db(this.database, mongodbServer);
}

GameStorage.prototype.load = function() {
	let self = this;
	this.listTable(function(err, tableNames){
		console.log(tableNames);
	});
}

GameStorage.prototype.listTable = function(callback) {
	let self = this;
	/* open db */
	this.db.open(function() {
		self.db.collections(function(err, data){
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

GameStorage.prototype.get = function(table, idx, callback) {
	let self = this;
	/* open db */
	this.db.open(function() {
	    /* Select 'contact' collection */
	    self.db.collection(table, function(err, collection) {
	        /* Querying */
	        collection.find({ name: 'Fred Chien' }, function(err, data) {
	            /* Found this People */
	            if (data) {
	            	callback(null, {id:111, name:'test'});
	            } else {
	                callback('Cannot found');
	            }
	        });
	    });
	});
	
};

GameStorage.prototype.put = function(table, idx, data, callback) {
	/* open db */
	db.open(function() {
	    /* Select 'contact' collection */
	    db.collection(table, function(err, collection) {
	        /* Update a data */
	        collection.update({_id:idx}, data);
	    });
	});
};

GameStorage.prototype.add = function(table, data, callback) {
	/* open db */
	db.open(function() {
	    /* Select 'contact' collection */
	    db.collection(table, function(err, collection) {
	        /* Insert a data */
	        collection.insert(data, function(err, data) {
	            if (data) {
	                callback(null, data);
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

module.exports = GameStorage;