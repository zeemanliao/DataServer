module.exports = function(adminConnect, dataServer) {
	adminConnect.on('connect', function(){
		adminConnect.send('info','test');
	});

};