'use strict';
let path = require('path');
let util = require('./lib/util');
let gameConnect = require('zeeman-game-connect');
let Storage = require('./lib/GameStorage');
let basePath = util.getBasePath();
let dataStruct = util.requireFolder(path.join(basePath, 'dataStruct'), 'json');
let storage = new Storage({db:{database:'gamedb'},dataStruct:dataStruct});

storage.load();

storage.start();


let server = gameConnect.createServer({port:9988});

server.on('get', function(client, req) {
	let _table = req.table;
	let _idx = req.idx;
	storage.get(_table, _idx, function(err, data) {
		if (err)
			return console.log(err);

		server.send(client.name, 'get', data);
	});
});

server.on('put', function(client, req) {
	let _table = req.table;
	let _data = req.data;
	storage.put(_table, _data, function(err, _data) {
		if (err)
			return console.log(err);

	});
});

server.on('getNewID', function(client) {
	let newID = storage.getNewID();
	server.send(client.name, 'getNewID', newID);
});


