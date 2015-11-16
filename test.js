"use strict";
let DataServer = require('./lib/DataServer');
let uncaughtException = false;
let config = {
	name:'Data Server',
	db:{name:'gamedb'},
	tables:['chara'],
	port:9988,
	adminServer:{ip:'localhost',port:1978}
};

let dataServer1 = new DataServer(config);

process.on('SIGINT', closeServer);

process.on("uncaughtException", unknowException);

dataServer1.start();

function unknowException(e) {
	if (!uncaughtException) {
		log(e.stack);
		
		uncaughtException = true;
		closeServer();
	}
}

function closeServer() {
	log('Server Shutdowning ...');
	
	dataServer1.stop(function(err) {
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
	console.log('\u001b[32m[' + new Date().toJSON() + ']\u001b[39m ');
	console.log(msg);
}
