"use strict";
let path = require('path');
let util = require('util');

let gameConnect = require('zeeman-game-connect');
let Storage = require('./GameStorage');
let DBStorage = require('./DBStorage');

let AdminServerRoute = require('./route/AdminRoute');
let ServerRoute = require('./route/ServerRoute');
let StorageRoute = require('./route/StorageRoute');

let AdminOutPut = require('./output/AdminServer');

let debug = function() {};

function DataServer(config) {
	this.log = log;
	this.error = error;
	this.debug = debug;
	this.config = checkConfig(config);
	this.dbStorage = new DBStorage(this.config.db);
	this.gameStorage = new Storage(
		{
			dbStorage:this.dbStorage, 
			tables:config.tables
		}
	);
	this.connect = gameConnect.createServer({port:config.port});
	this.adminServer = gameConnect.createClient(
		{
			name:config.name,
			port:config.adminServer.port,
			ip:config.adminServer.ip
		}
	);
	AdminServerRoute(this.adminServer, this);
	ServerRoute(this.connect, this.gameStorage);
	StorageRoute(this);
}

/**
 * 開始伺服器
 * 
 */
DataServer.prototype.start = function() {
	this.gameStorage.load();
};

/**
 * 停止伺服器
 * 
 */
DataServer.prototype.stop = function(callback) {
	callback();
};

/**
 * 確認設定檔
 * 
 */
function checkConfig(config) {
	if (!config)
		throw new Error('config not defined!');

	if (!config.name)
		throw new Error('config.name not defined!');

	if (!config.db || !config.db.name)
		throw new Error('config.databaseName not defined!');

	if (!config.tables)
		throw new Error('config.tables[] not defined!');

	if (!util.isArray(config.tables))
		throw new Error('config.tables need be Array!');

	if (config.tables.length<=0)
		throw new Error('config.tables[] need put value!');

	if (!config.port)
		throw new Error('Data Server config.port not defined!');

	if (!config.adminServer)
		throw new Error('Admin Server config.adminServer{ip,port} no defined!');

	if (!config.adminServer.port)
		throw new Error('Admin Server config.adminServer.port no defined!');

	if (!config.adminServer.ip)
		throw new Error('Admin Server config.adminServer.ip no defined!');

	return config;
}

function log() {
	
	let msg = arguments['0'];
	delete arguments['0'];
	
	for (let s in arguments) {
		msg = msg.replace('%s',arguments[s]);
	}
	msg = msg;
	console.log('\u001b[32m[' + new Date().toJSON() + ']\u001b[39m ');
	console.log(msg);
}

function error(err) {
	console.log('\u001b[32m[' + new Date().toJSON() + ']\u001b[39m ');
	console.log(err);
	console.trace();
}
if (process.env.DEBUG) {
	debug = function () {
		let msg = arguments['0'];
		delete arguments['0'];
		
		for (let s in arguments) {
			msg = msg.replace('%s',arguments[s]);
		}
		msg = msg;
		console.log('\u001b[32m[' + new Date().toJSON() + ']\u001b[39m ');
		console.log(msg);
	};
}

function createServer(config) {
	let _server = new DataServer(config);
	let _autoAdmin = AdminOutPut(_server);
	let _runFun = function() {
		_autoAdmin();
		setTimeout(_runFun, 3000);
	};
	_runFun();
	return _server;
}
module.exports = createServer;