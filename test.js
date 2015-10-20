
var gameConnect = require('zeeman-game-connect');
var dataServer = gameConnect.createClient({name:'test',port:9988});
/*
var newID = [];

dataServer.on('getNewID',function(data) {
		newID.push(data);
});


for (var i =0; i<100;i++) {
	dataServer.send('getNewID');
}
*/
setTimeout(add, 1000);


function add() {
	for (var addi = 1;addi<1001;addi++) {
		//var _id = getNewID();
		var data = {info:{id:'id'+addi,name:'name'+addi}};
		dataServer.send('put', {table:'user',data:data});
	}
}
/*
function getNewID() {
	var _id = newID.shift();
	return _id;
}
*/
//dataServer.send('put',{});