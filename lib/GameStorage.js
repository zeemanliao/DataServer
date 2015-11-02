var EventEmmiter = require('events').EventEmitter;

function GameStorage(config) {
	var self = this;
	this.statue = 'stop';
	this.event = new EventEmmiter();
	this.datas = {};
	this.update = {};
	this.delay = config.delay || 1000;
	this.db = config.dbStorage;
	for (var i in config.tables) {
		this.datas[config.tables[i]] = {};
		this.update[config.tables[i]] = {};
	}
}

GameStorage.prototype.run = function() {
	var self = this;
	
	var updateTables = [];
	this.event.emit('loading', this);
	for (var tableName in this.update) {
		updateTables.push(tableName);
	}

	var execRun = function() {
		var tableName = updateTables.pop();
		var _updates = [];
		for (var i in self.update[tableName]) {
			var _data = self.update[tableName][i];
			_updates.push[_data];
		}

		if (_updates.length>0) {
			self.db.put(tableName, _updates, function(err) {
				if (err) {
					self.event.emit('err', self, err);
				}
				self.interval = setTimeout(execRun, self.delay);

			});
		} else {
			self.interval = setTimeout(execRun, self.delay);
		}

	};
	execRun();
};

GameStorage.prototype.start = function() {
	this.statue = 'start';
	this.event.emit('start', this);
	if (!this.interval)
		this.run();
};

GameStorage.prototype.stop = function() {
	this.statue = 'stop';
	this.event.emit('stop', this);
};

/**
 * 依照this.datas取得資料
 * 
 * @param {String} table 資料表名稱
 * @param {Json} filter 查詢條件
 * @param {function} callback 回調函數
 */
GameStorage.prototype.load = function(callback) {
	var self = this;
	var db = this.db;

	var loadTables = [];
	this.event.emit('loading', this);
	for (var tableName in this.datas) {
		loadTables.push(tableName);
	}

	var execRun = function() {
		var tableName = loadTables.pop();
		if (tableName) {
			db.get(tableName, {}, function(err, data){
				if (err)
					return callback(err);

				var _data = {};
				for (var i in data) {
					_data[data[i].id] = data[i];
				}
				self.datas[tableName] = _data;
				execRun();
			});
		}
		else
		{
			self.event.emit('loaded', self);
			callback(null, self.datas);
		}
	};
	execRun();
};

/**
 * 取得
 *
 * @prarm {String} objName 資料表名稱
 * @param {String} _id ID
 **/
GameStorage.prototype.getNewID = function(num) {
	num = num || 1;
	var ids = [];
	for (var i = 0; i < num; i++) {
		ids.push(this.db.getNewID());
	}
	return ids;
};

/**
 * 取得資料
 *
 * @prarm {String} objName 資料表名稱
 * @param {String} id ID
 **/
GameStorage.prototype.get = function(objName, id, callback) {
	if (!(objName in this.datas))
		return callback(objName+' not in datas');
	
	if (!id) {
		callback(null, this.datas[objName]);
	} else {
		callback(null, this.datas[objName][id]);
	}
	
};

/**
 * 更新資料
 *
 * @prarm {String} objName 資料表名稱
 * @param {Json} data 要儲存的資料
 * @param {function} callback 回傳函數
 **/
GameStorage.prototype.put = function(objName, data, callback) {
	if (!(objName in this.datas))
		return callback(objName+' not in datas');

	var _data = this.datas[objName][data.id];
	if (!isTheSame(_data, data)) {
		this.event.emit('put', data);
		this.data[objName][data.id] = data;
	}
	callback(null, data);
};

GameStorage.prototype.close = function(callback) {
	this.event.emit('close');
	this.stop();
	callback(null);
}

/**
 * 更新資料
 *
 * @prarm {String} objName 資料表名稱
 * @param {Json} data 要儲存的資料
 * @param {function} callback 回傳函數
 **/
GameStorage.prototype.on = function(onName, fun) {
	this.event.on(onName, fun);
}


/**
 * 碓認兩個Json資料是否一致
 *
 * @prarm {Json} data1 比對資料1
 * @param {Json} data2 比對資料2
 **/
function isTheSame(data1, data2) {
	return data1 && 
			data2 && 
			JSON.stringify(data1) === JSON.stringify(data2);
}

module.exports = GameStorage;