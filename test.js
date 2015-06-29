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

setTimeout(add, 1000);


function add() {
	for (let addi = 1;addi<10;addi++) {
		let _id = getNewID();
		let data = {_id:_id,name:'name'+addi};
		dataServer.send('put', {table:'user',data:data});
	}
}

function getNewID() {
	let _id = newID.shift();
	return _id;
}
//dataServer.send('put',{});