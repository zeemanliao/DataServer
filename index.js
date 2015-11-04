var path = require('path');

var gameConnect = require('zeeman-game-connect');
var Storage = require('./lib/GameStorage');
var DBStorage = require('./lib/DBStorage');
var dbStorage = new DBStorage({database:'gamedb'});
var uncaughtException = false;
var debug;
var storage = new Storage({dbStorage:dbStorage, tables:['chara'], debug:debug});

if (process.env.DEBUG) {
	debug = function (data) {
		console.log('\033[33m[' + new Date().toJSON() + ']\033[39m ');
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
	log('Game Data Loaded ...');
	debug(storage.datas);

	storage.start();

});

storage.on('loading', () => {
	log('Game Data Loading ...');
});

storage.on('before run', () => {
	//debug('Storage run Start...');
});

storage.on('after run', updates => {
	if (updates) {
		debug(updates);
	} else {
		log('after run');
	}
});

load();

var server = gameConnect.createServer({port:9988});

storage.on('error', function(err) {
	if (err) {
		debug(err);
		console.trace();
	}
});

server.on('get', function(client, req) {
	if (!req)
		return server.send(client.name, 'err', {opt:'get',message:'undefine req {table,idx}'});
	var _table = req.table;
	var _idx = req.idx;
	if (_table) {
		storage.get(_table, _idx, function(err, data) {
			if (err)
				return console.log(err);

			server.send(client.name, 'get', data);
		});
	} else {
		server.send(client.name, 'err', {opt:'get',message:'undefine get table name'});
	}
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