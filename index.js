var path = require('path');

var gameConnect = require('zeeman-game-connect');
var Storage = require('./lib/GameStorage');
//var util = require('./lib/util');
//var basePath = util.getBasePath();
//var dataStruct = util.requireFolder(path.join(basePath, 'dataStruct'), 'json');
var dataStruct = {};
dataStruct.user = require('./dataStruct/user.json');
var storage = new Storage({db:{database:'gamedb'}, dataStruct:dataStruct});

storage.load();

storage.start();


var server = gameConnect.createServer({port:9988});

server.on('get', function(client, req) {
	var _table = req.table;
	var _idx = req.idx;
	storage.get(_table, _idx, function(err, data) {
		if (err)
			return console.log(err);

		server.send(client.name, 'get', data);
	});
});

server.on('put', function(client, req) {
	var _table = req.table;
	var _data = req.data;
	storage.put(_table, _data, function(err, _data) {
		if (err)
			return console.log(err);

	});
});

server.on('getNewID', function(client) {
	var newID = storage.getNewID();
	server.send(client.name, 'getNewID', newID);
});


