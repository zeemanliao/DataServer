"use strict";
const CONNECT_PUT = 'put';
const CONNECT_GET = 'get';
const CONNECT_GETNEWID = 'get new id';
const CONNECT_SHUTDOWN = 'shutdown';
const CONNECT_CLIENT = 'connect';
const CONNECT_CLIENT_DISCONNECT = 'disconnect';
module.exports = function(serverConnect, gameStorage) {

	serverConnect.on(CONNECT_CLIENT, function(client) {
		gameStorage.log('client %s connect',client.name);
	});

	serverConnect.on(CONNECT_GET, function(client, req) {
		if (!req)
			return serverConnect.send(client.name, 'err', {opt:'get',message:'req {table,idx} undefined!'});
		let _table = req.table;
		let _idx = req.idx;
		if (_table) {
			gameStorage.get(_table, _idx, function(err, data) {
				if (err)
					return gameStorage.log(err);

				serverConnect.send(client.name, 'get', data);
			});
		} else {
			serverConnect.send(client.name, 'err', {opt:'get',message:'undefine get table name'});
		}
	});

	serverConnect.on(CONNECT_PUT, function(client, req) {
		let _table = req.table;
		let _data = req.data;

		gameStorage.put(_table, _data, function(err, _data) {
			if (err)
				return gameStorage(err);

			serverConnect.send(client.name, 'put', {ok:true});
		});

	});

	serverConnect.on(CONNECT_GETNEWID, function(client, req) {
		serverConnect.send(client.name, 'newID', gameStorage.getNewID(req));
	});

	serverConnect.on(CONNECT_SHUTDOWN, function(client, req) {
		if (req.pwd == '1234') {
			closeServer();
		} else {
			serverConnect.send(client.name, 'server message', {message:'Shutdown Password Error!'});
		}
	});

};