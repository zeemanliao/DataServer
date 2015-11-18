"use strict";
let test = require('./lib/output/AdminServer');

let msg1 = {log:'msg1'};
let msg2 = {log:'msg2'};

function m(msg) {
	this.log = msg.log;
	this.gameStorage = {info:msg};
	this.adminServer = {connected:true,send:function(){}};
}

function test1(msg) {
	let _server = new m(msg);
	let _autoAdmin = test(_server);
	let _runFun = function() {
		_autoAdmin();
		setTimeout(_runFun, 1000);
	}
	_runFun();
	return _server;
};

let t1 = new test1(msg1);

let t2 = new test1(msg2);


/*
var DBStorage = require('./lib/DBStorage');
var db = new DBStorage({database:'gamedb'});

db.listTable(function(err, tables) {
	if (err)
		return console.log(err);

	for (var i in tables) {
		console.log(tables[i]);
	}
});
db.createTable('test', function(err, tables) {
	if (err) {
		console.log(err);
	} else {
		console.log(tables);
	}
});

var theidID = '56265565bf7e88a01951ef9c';
var o_id = new db.getNewID(theidID);
db.remove('test', o_id, function(err, data) {
	if (err) {
		console.log(err);
	} else {
		console.log(data);
	}
});

var datas = [];
for (var i=0;i<10;i++) {
	var _d = {
		_id:new db.getNewID(),
		id:i,
		name:'name'+i,
		update:0,
		lastUpdate:0,
		gold:i,
		chara:[
			{
				name:'chara'+i,
				hp:100+i,
				mp:100+i,
				str:i,
				def:i
			},
			{
				name:'charaB'+i,
				hp:100+i,
				mp:100+i,
				str:i,
				def:i	
			}
		]
	};
	datas.push(_d);
}

db.put('chara', datas,function(err, result) {
	if (err) {
		console.log(err);
	} else {
		console.log(result);
	}
});

db.get('chara', {}, function(err, datas) {
	console.log(datas);
});

*/