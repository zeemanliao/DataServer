"use strict";

const EVENT_LOADING = 'loading';
const EVENT_LOADED = 'loaded';
const EVENT_BEFORE_RUN = 'before run';
const EVENT_AFTER_RUN = 'after run';
const EVENT_ROLLBACK = 'rollback';
const EVENT_PUT = 'put';
const EVENT_START = 'start';
const EVENT_STOP = 'stop';
const EVENT_CLOSE = 'close';
const EVENT_ERROR = 'error';

const STORAGE_START = 'start';
const STORAGE_STOP = 'stop';

let EventEmmiter = require('events').EventEmitter;

function GameStorage(config) {
	init(this);
	this.statue = STORAGE_STOP;
	this.event = new EventEmmiter();
	this.datas = {};
	this.update = {};
	this.delay = config.delay || 1000;
	this.db = config.dbStorage;
	for (let i in config.tables) {
		this.datas[config.tables[i]] = {};
		this.update[config.tables[i]] = {};
	}
}

function init(context) {
	context.__defineGetter__('EVENT_LOADING',function() {return EVENT_LOADING;});
	context.__defineGetter__('EVENT_LOADED',function() {return EVENT_LOADED;});
	context.__defineGetter__('EVENT_BEFORE_RUN',function() {return EVENT_BEFORE_RUN;});
	context.__defineGetter__('EVENT_AFTER_RUN',function() {return EVENT_AFTER_RUN;});
	context.__defineGetter__('EVENT_ROLLBACK',function() {return EVENT_ROLLBACK;});
	context.__defineGetter__('EVENT_PUT',function() {return EVENT_PUT;});
	context.__defineGetter__('EVENT_START',function() {return EVENT_START;});
	context.__defineGetter__('EVENT_STOP',function() {return EVENT_STOP;});
	context.__defineGetter__('EVENT_CLOSE',function() {return EVENT_CLOSE;});
	context.__defineGetter__('EVENT_ERROR',function() {return EVENT_ERROR;});
}

GameStorage.prototype.run = function() {
	let self = this;
	let updateTables = [];

	let execRun = function() {
		
		if (updateTables.length <= 0) {
			for (let tableName in self.update) {
				updateTables.push(tableName);
			}
		}
		let tableName = updateTables.pop();
		self.event.emit(EVENT_BEFORE_RUN, tableName);
		let _updates = [];

		for (let i in self.update[tableName]) {
			let _data = self.update[tableName][i];
			delete self.update[tableName][i];
			self.datas[tableName][i] = _data;
			_updates.push(_data);
		}

		if (_updates.length>0) {

			self.db.put(tableName, _updates, function(err) {
				if (err) {
					self.rollback(tableName, _updates);
					self.event.emit(EVENT_ERROR, err);
				}
				self.interval = setTimeout(execRun, self.delay);
				self.event.emit(EVENT_AFTER_RUN, _updates);
			});
		} else {
			self.event.emit(EVENT_AFTER_RUN);
			self.interval = setTimeout(execRun, self.delay);
		}

	};
	execRun();
};

GameStorage.prototype.start = function() {
	this.statue = STORAGE_START;
	this.event.emit(EVENT_START);
	if (!this.interval)
		this.run();
};

GameStorage.prototype.stop = function() {
	this.statue = STORAGE_STOP;
	this.event.emit(EVENT_STOP, this);
};

GameStorage.prototype.rollback = function(tableName, _updates) {
	for (let i in _updates) {
		let _data = _updates[i];
		if (!self.update[tableName][_data.id]) {
			self.update[tableName][_data.id] = _data;
		}
	}
	this.event.emit(EVENT_ROLLBACK, tableName, _updates);
};

/**
 * 依照this.datas取得資料
 * 
 * @param {String} table 資料表名稱
 * @param {Json} filter 查詢條件
 */
GameStorage.prototype.load = function() {
	let self = this;
	let db = this.db;

	let loadTables = [];
	this.event.emit(EVENT_LOADING, this);
	for (let tableName in this.datas) {
		loadTables.push(tableName);
	}

	let execRun = function() {
		let tableName = loadTables.pop();
		if (tableName) {
			db.get(tableName, {}, function(err, data){
				if (err) {
					return self.event.emit(EVENT_ERROR, err);
				} else {

					let _data = {};
					for (let i in data) {
						_data[data[i].id] = data[i];
					}
					self.datas[tableName] = _data;
				}
				execRun();
			});
		}
		else
		{
			self.event.emit(EVENT_LOADED, self);
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
	let ids = [];
	for (let i = 0; i < num; i++) {
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
		return self.event.emit(objName+' not in datas');
	?????????????????????????????????
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

	let _data = this.datas[objName][data.id];

	if (!isTheSame(_data, data)) {
		this.event.emit(EVENT_PUT, data);
		this.update[objName][data.id] = data;
	}
	callback(null, data);
};

GameStorage.prototype.close = function(callback) {
	this.event.emit(EVENT_CLOSE);
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
GameStorage.prototype.on = function(eventName, fun) {
	this.event.on(eventName, fun);
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