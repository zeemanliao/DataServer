'use strict';
let util = require('util');
let app = require('../');
let should = require('should');
let mockBase = process.cwd() + '/test';

let dataServer = null;
describe('data', function() {
    describe('#createDataServer', function() {
        it('should create Data Server And Server Statue is stop', function(done) {

            dataServer = app.createGame({});
            should.exist(dataServer);
            dataServer.statue.should.equal("stop");
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
            let id = 1;
            game.start();
            game.join(id);
            //game.run.should.equal(false);
            done();
        });
        it('should Leave', function(done) {
            let id = 1;
            game.leave(id);
            //game.run.should.equal(false);
            done();
        });
    });
    */
});
