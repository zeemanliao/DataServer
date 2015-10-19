var DBStorage = require('./lib/DBStorage');
var db = new DBStorage({database:'gamedb'});

db.listTable(function(err, tables) {
	if (err)
		return console.log(err);

	for (var i in tables) {
		console.log(tables[i]);
	}
});