
var gameConnect = require('zeeman-game-connect');
var dataServer = gameConnect.createClient({name:'test',port:9988});
dataServer.on('server message',function (data) {
	console.log('Data Server Message:');
	console.log(data.message);
});

//dataServer.send('shutdown', {pwd:'1234'});
dataServer.on('disconnect', function() {
	console.log('%s Data Server Disconnect ...',new Date().toJSON());
});
dataServer.on("connect", function() {
	console.log('%s Data Server Connect ...',new Date().toJSON());
});
var chara;

dataServer.send('get', {table:'chara'});

dataServer.on('get', function(data) {
	charas = data;
	console.log('got Data');
	for (var i in charas) {
		var chara = charas[i];
		chara.name += 'test';
		dataServer.send('put', {table:'chara',data:chara});
	}

});

dataServer.on('err', function(err) {
	console.log('err opt:%s', err.opt);
	console.log('err message:%s', err.message);
});
/*
dataServer.send('get', {table:'chara'});

dataServer.on('get', function( datas) {
	changeData(datas);
});

function changeData(datas) {
	for (var i in datas) {
		var _data = datas[i];
		_data.update +=1;
	}
	dataServer.send('put', {table:'chara',data:datas});
}

dataServer.on('put', function(ok) {
	console.log(ok);
});

var newID = [];

dataServer.on('getNewID',function(data) {
		newID.push(data);
});


for (var i =0; i<100;i++) {
	dataServer.send('getNewID');
}

//setTimeout(add, 1000);

dataServer.send('getNewID',100);

function add() {
	for (var addi = 1;addi<1001;addi++) {
		//var _id = getNewID();
		var data = {info:{id:'id'+addi,name:'name'+addi}};
		dataServer.send('put', {table:'user',data:data});
	}
}

dataServer.on('newID', function(ids){
	console.log(ids);
});
/*
function getNewID() {
	var _id = newID.shift();
	return _id;
}
*/
//dataServer.send('put',{});
