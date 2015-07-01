var util = require('util');
var app = require('../../lib/GameStorage');
var should = require('should');
var mockBase = process.cwd() + '/test/lib';

var dataStruct = {};
dataStruct.user = require('../../dataStruct/user.json');

var gameStorage = null;
describe('data', function() {
    describe('#createDataServer', function() {
        it('should create Game Storage', function(done) {

            gameStorage = new app({db:{database:'gamedb'}, dataStruct:dataStruct});
            should.exist(gameStorage);
            //gameStorage.statue.should.equal("stop");
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
