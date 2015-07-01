var path = require('path');
var fs = require('fs');

module.exports = {
	requireFolder:function (_path, _subName) {
	var _return = {};
	var patt = new RegExp('.'+ _subName);
	fs.readdirSync(_path).forEach(function (filename) {

		if (!patt.test(filename)) {
			return;
		}

		var _name = path.basename(filename, '.'+ _subName);

		var _req = require(path.join(_path, filename));

		_return[_name] = _req;
		  
		});
		
		return _return;
	},
	getBasePath:function() {
		return path.dirname(process.mainModule.filename);
	}
};