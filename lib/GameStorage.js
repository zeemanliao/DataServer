'use strict';
let mongodb = require('mongodb');
let DBStorage = require('./DBStorage');
function GameStorage(info) {
	let self = this;
	this.maxProcess = info.maxProcess || 5;
	this.countProcess = 0;
	this.statue = 'stop';
	this.datas = {};
	this.updates = {};
	this.updateQueue = {};
	this.dataStruct = info.dataStruct;
	this.delay = info.delay || 10;
	this.db = new DBStorage(info.db);
}

GameStorage.prototype.run = function() {
	let self = this;
	if (this.statue == 'start') {
	var execRun = function() {
		self.run();
	}
		for (let tableName in this.dataStruct) {
			for (let _id in self.updates[tableName]) {
				if (self.countProcess <= self.maxProcess) {
					let data = self.updates[tableName][_id];

					delete self.updates[tableName][_id];
					
					if (!checkData(data, self.datas[tableName][_id])) {
						self.countProcess ++;
						self.datas[tableName][_id] = data;
						self.db.put(tableName, data, function(err) {
							if (err)
								console.log(err);
							selft.interval = setTimeout(execRun, self.delay);

						});
					}
				} else {
					selft.interval = setTimeout(execRun, self.delay);
					break;
				}
			}
		}
	}


	
};

GameStorage.prototype.start = function() {
	this.statue = 'start';
	if (!this.interval)
		this.run();
};

GameStorage.prototype.stop = function() {
	this.statue = 'stop';
}
GameStorage.prototype.load = function() {
	let self = this;
	let db = this.db;
	for (var tableName in this.dataStruct) {
		this.updates[tableName] = {};
		db.get(tableName, {}, function(err, data){
			if (!err) {
				self.datas[tableName] = getData(self.dataStruct[tableName], data);
			}
		});
	}
}

GameStorage.prototype.getNewID = function() {
	return this.db.getNewID();
}

GameStorage.prototype.get = function(objName, idx, callback) {
	if (!objName in this.updates)
		return callback(objName+' no define strict');

	let data = null;
	if (idx in this.updates[objName])
	{
		data = this.updates[objName][idx];
	} else if (idx in this.datas[objName]){
		data = this.datas[objName][idx];
	} else {
		return callback(objName+' no search index:' + idx);
	}
	callback(null, data);
}

GameStorage.prototype.put = function(objName, data, callback) {
	if (!objName in this.dataStruct)
		return callback(objName+' no define strict');

	this.updates[objName][data._id] = makeData(this.dataStruct[objName], data);
}

function makeData(dataStruct, data) {
	let _data = {};
	_data._id = data._id;
	for (let i in dataStruct) {
		_data[i] = data[i];
	}

	return _data;
}

function getData(tableStruct, datas) {
	let data = {};

	for (var i in datas) {
		let _d = {};
		for (var j in tableStruct) {
			_d[j] = datas[i][j];
		}
		data[datas[i]._id] = _d;
	}
	return data;
}

function checkData(data1, data2) {
	if (!data2)
		return false;

	let theSame = true;
	for (let i in data1) {
		if (data1[i] != data2[i]) {
			theSame = false;
			break;
		}
	}
	return theSame;
}
/*
db.authenticate("game", "test", function(err, res) {

});
*/

module.exports = GameStorage;