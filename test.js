'use strict';
let gameConnect = require('zeeman-game-connect');
let dataServer = gameConnect.createClient({name:'test',port:9988});
let newID = [];

dataServer.on('getNewID',function(data) {
		newID.push(data);
		console.log(data);
});


for (let i =0; i<100;i++) {
	dataServer.send('getNewID');
}


//dataServer.send('put',{});