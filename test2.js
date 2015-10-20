var DBStorage = require('./lib/DBStorage');
var db = new DBStorage({database:'gamedb'});
/*
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
*/
var theidID = '56265565bf7e88a01951ef9c';
var o_id = new db.getNewID(theidID);
db.remove('test', o_id, function(err, data) {
	if (err) {
		console.log(err);
	} else {
		console.log(data);
	}
});