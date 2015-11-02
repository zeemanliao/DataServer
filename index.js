var path = require('path');

var gameConnect = require('zeeman-game-connect');
var Storage = require('./lib/GameStorage');
var DBStorage = require('./lib/DBStorage');
var dbStorage = new DBStorage({database:'gamedb'});
var uncaughtException = false;
var storage = new Storage({dbStorage:dbStorage, tables:['chara']});

var debug;
if (process.env.DEBUG) {
	debug = function (data) {
		console.error(data);
	};
} else {
	debug = function () {};
}

//從資料庫轉入資料
var load = function () {
	storage.load(function (err, data) {
		if (err) {
			log(err);
			setTimeout(load, 3000);
		}
	});
}

storage.on('loaded', function() {
	console.log(storage.datas);
	storage.start();
});

load();

var server = gameConnect.createServer({port:9988});

storage.on('error', function(s, err) {
	if (err) {
		debug(err);
		console.trace();
	}
});

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
			return log(err);

		server.send(client.name, 'put', {ok:true});
	});

});

server.on('getNewID', function(client, req) {
	server.send(client.name, 'newID', storage.getNewID(req));
});

server.on('shutdown', function(client, req) {
	if (req.pwd == '1234') {
		closeServer();
	} else {
		server.send(client.name, 'server message', {message:'Shutdown Password Error!'});
	}
});

process.on('SIGINT', closeServer);

process.on("uncaughtException", unknowException);

function unknowException(e) {
	if (!uncaughtException) {
		log(e.stack);
		
		uncaughtException = true;
		closeServer();
	}
}
function closeServer() {
	log('Server Shutdowning ...');
	load = function() {};
	storage.close(function(err) {
		if (err)
			log(err);
		log('Server Shutdown ...');

		process.exit(1);
	});
}

function log() {
	
	var msg = arguments['0'];
	delete arguments['0'];
	
	for (var s in arguments) {
		msg = msg.replace('%s',arguments[s]);
	}
	msg = msg;
	console.log('\033[32m[' + new Date().toJSON() + ']\033[39m ');
	console.log(msg);
}