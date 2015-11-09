"use strict";
let path = require('path');

let gameConnect = require('zeeman-game-connect');
let Storage = require('./GameStorage');
let DBStorage = require('./DBStorage');

let AdminServerRoute = require('./route/adminServer');
let debug;


function DataServer(config) {
	this.config = getConfig(config);
	this.uncaughtException = false;
	this.dbStorage = new DBStorage(coinfig.databaseName);
	this.gameStorage = new Storage({dbStorage:dbStorage, tables:config.tables, debug:debug});
	this.connect = gameConnect.createServer(config.port);
	this.adminServer = gameConnect.createClient({name:config.name,port:config.adminServer.port,ip:config.adminServer.ip});
	AdminServerRoute(this.adminServer);

}

function getConfig(config) {

}

module.exports = DataServer;