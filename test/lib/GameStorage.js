/*
    db.createCollection("user", { size: 10240 } )
*/
var util = require('util');
var app = require('../../lib/GameStorage');
var should = require('should');
var mockBase = process.cwd() + '/test/lib';
var DBStorage = require('../../lib/DBStorage');
var testDBName = 'testdb';
var testTableName = 'testDBStorage';
var dbStorage = new DBStorage({database:testDBName});
var dataStruct = {};
dataStruct.testDBStorage = require('./testDBStorage.json');

var newID = [];
var gameStorage = null;
describe('GameStorage', function() {
    describe('#testGameStorage', function() {
        it('should create Game Storage ,load data, start Server', function(done) {
            gameStorage = new app({dbStorage:dbStorage, dataStruct:dataStruct});
            should.exist(gameStorage);
            gameStorage.dataStruct.should.equal(dataStruct);
            gameStorage.load(function(err, datas) {
                should.not.exist(err);
                gameStorage.start();
                gameStorage.statue.should.equal("start");
                done();
            });

        });
        it('should add 1 recod', function(done) {
            var idata = {id:2,name:'test2'};
            gameStorage.put(testTableName, idata, function(err, data) {
                should.not.exist(err);
                should.exist(data._id);
                data.id.should.equal(idata.id);
                data.name.should.equal(idata.name);
                done();
            });
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
