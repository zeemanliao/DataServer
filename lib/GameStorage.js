var mongodb = require('mongodb');
var DBStorage = require('./DBStorage');
function GameStorage(info) {
	var self = this;
	this.statue = 'stop';
	this.datas = {};
	this.updates = {};
	this.updateQueue = {};
	this.dataStruct = info.dataStruct;
	this.delay = info.delay || 10;
	this.db = new DBStorage(info.db);
}

GameStorage.prototype.run = function() {
	var self = this;
	
	var execRun = function() {
		self.run();
	};
	var _update = null;
	var _tableName = null;
	if (this.statue == 'start') {
		for (var tableName in this.dataStruct) {
			for (var _id in self.updates[tableName]) {

				_update = self.updates[tableName][_id];

				delete self.updates[tableName][_id];
					
				if (checkData(_update, self.datas[tableName][_id])) {
					_update = null;
				} else {
					_tableName = tableName;
					self.datas[tableName][_id] = _data;
					break;
				}
			}
			if (_update)
				break;
		}
	}
	if (_update) {
		self.db.put(_tableName, data, function(err) {
			if (err)
				console.log(err);

			self.interval = setTimeout(execRun, self.delay);
		});
	} else {
		self.interval = setTimeout(execRun, self.delay);
	}
};

GameStorage.prototype.start = function() {
	this.statue = 'start';
	if (!this.interval)
		this.run();
};

GameStorage.prototype.stop = function() {
	this.statue = 'stop';
};

GameStorage.prototype.load = function() {
	var self = this;
	var db = this.db;
	var putData = function(err, data){
		if (!err) {
			self.datas[tableName] = getData(self.dataStruct[tableName], data);
		}
	};
	for (var tableName in this.dataStruct) {
		this.updates[tableName] = {};
		db.get(tableName, {}, putData);
	}
};


GameStorage.prototype.getNewID = function() {
	return this.db.getNewID();
};

GameStorage.prototype.get = function(objName, idx, callback) {
	if (!(objName in this.updates))
		return callback(objName+' no define strict');

	var data = null;
	if (idx in this.updates[objName])
	{
		data = this.updates[objName][idx];
	} else if (idx in this.datas[objName]){
		data = this.datas[objName][idx];
	} else {
		return callback(objName+' no search index:' + idx);
	}
	callback(null, data);
};

GameStorage.prototype.put = function(objName, data, callback) {
	if (!(objName in this.dataStruct))
		return callback(objName+' no define strict');

	this.updates[objName][data._id] = makeData(this.dataStruct[objName], data);
};

function makeData(dataStruct, data) {
	var _data = {};
	_data._id = data._id;
	for (var i in dataStruct) {
		_data[i] = data[i];
	}

	return _data;
}

function getData(tableStruct, datas) {
	var data = {};

	for (var i in datas) {
		var _d = {};
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

	var theSame = true;
	for (var i in data1) {
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