"use strict";
module.exports = function(server) {
	let gameStorage = server.gameStorage;
	let log = server.log;
	let error = server.error;	
	let debug = server.debug;
	let adminServer = server.adminServer;

	gameStorage.on(gameStorage.EVENT_LOADED, () => {
		log('Game Data Loaded ...');
		debug(gameStorage.datas);

		gameStorage.start();

	});

	gameStorage.on(gameStorage.EVENT_LOADING, () => {
		log('Game Data Loading ...');
	});

	gameStorage.on(gameStorage.EVENT_BEFORE_RUN, () => {

	});

	gameStorage.on(gameStorage.EVENT_AFTER_RUN, updates => {
		if (updates) {
			debug(updates);
		} else {

		}
	});

	gameStorage.on(gameStorage.EVENT_ROLLBACK, function(tableName, _updates) {
		log('Rollback tableName:%s', tableName);
		log(_updates);
	});

	gameStorage.on(gameStorage.EVENT_ERROR, function(err) {
		if (err) {
			debug(err);
		}
	});

};