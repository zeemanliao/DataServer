'use struct';
var gameConnect = require('zeeman-game-connect');
var storage = require('./lib/GameStorage');

var server = gameConnect.createServer({port:9988});

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
	let _idx = req.idx;
	let _data = req.data;
	storage.get(_table, _idx, function(err, _data) {
		if (_data) {}
		storage.put(_table, _idx, function(err, data) {
			if (err)
				return console.log(err);
		});
	});
});