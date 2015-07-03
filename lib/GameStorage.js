var mongodb = require('mongodb');

function GameStorage(config) {
	var self = this;
	this.statue = 'stop';
	this.datas = {};
	this.updates = {};
	this.updateQueue = {};
	this.dataStruct = config.dataStruct;
	this.delay = config.delay || 10;
	this.db = config.dbStorage;
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

GameStorage.prototype.load = function(callback) {
	var self = this;
	var db = this.db;
	var errs = null;
	var loadTables = [];
	for (var tableName in this.dataStruct) {
		this.datas[tableName] = {};
		loadTables.push(tableName);
	}
	var execRun = function() {
		var tableName = loadTables.shift();
		db.get(tableName, {}, function(err, data){
			if (err) {
				if (errs === null) {
					errs = {};
				}
				errs[talbeName] = err;
			} else {
				self.datas[tableName] = getData(self.dataStruct[tableName], data);
			}
			if (loadTables.length >0) {
				execRun();
			} else {
				callback(errs, self.datas);
			}
		});
	};
	execRun();
};
/*
GameStorage.prototype.getNewID = function(num) {
	num = num || 1;
	var ids = [];
	for (var i = 0; i < num; i++) {
		ids.push(this.db.getNewID());
	}
	return ids;
};
*/
GameStorage.prototype.get = function(objName, _id, callback) {
	if (!(objName in this.updates))
		return callback(objName+' no define strict');

	var data = null;
	if (_id in this.updates[objName])
	{
		data = this.updates[objName][_id];
	} else if (_id in this.datas[objName]){
		data = this.datas[objName][_id];
	} else {
		return callback(objName+' no search index:' + _id);
	}
	callback(null, data);
};

GameStorage.prototype.put = function(objName, data, callback) {
	if (!(objName in this.dataStruct))
		return callback(objName+' no define strict');
//checkData
	
	if (!data._id) {
		data._id = this.db.getNewID();
	}
	var _data = makeData(this.dataStruct[objName], data);
	if (!checkData(_data, this.datas[objName][data._id])) {
		this.updates[objName][data._id] = _data;
	}	
console.log(_data);
	callback(null, this.updates[objName][data._id]);
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