var util = require('util');
var app = require('../');
var should = require('should');
var mockBase = process.cwd() + '/test';

var dataStruct = {};
dataStruct.user = require('../dataStruct/user.json');

var dataServer = null;
describe('data', function() {
    describe('#createDataServer', function() {
        it('should create Data Server And Server Statue is stop', function(done) {

            dataServer = app;
            should.exist(dataServer);
            //dataServer.statue.should.equal("stop");
            done();
        });
    });
    /*
    describe('#Event', function() {
        it('should Start and run attribute is true', function(done) {
            game.start();
            game.run.should.equal(true);
            done();
        });
        it('should Stop and run attribute is false', function(done) {
            game.stop();
            game.run.should.equal(false);
            done();
        });
        it('should Join', function(done) {
            var id = 1;
            game.start();
            game.join(id);
            //game.run.should.equal(false);
            done();
        });
        it('should Leave', function(done) {
            var id = 1;
            game.leave(id);
            //game.run.should.equal(false);
            done();
        });
    });
    */
});