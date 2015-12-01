"use strict";
module.exports = function(server) {
	let gameStorage = server.gameStorage;
	let log = server.log;
	let error = server.error;	
	let debug = server.debug;
	let adminServer = server.adminServer;

	return function() {
		if (adminServer.connected) {
			adminServer.send('run', gameStorage.info);
		} else {
			
		}
	}
};