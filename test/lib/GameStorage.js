/*
    db.createCollection("user", { size: 10240 } )
*/
var util = require('util');
var app = require('../../lib/GameStorage');
var should = require('should');
var mockBase = process.cwd() + '/test/lib';
var DBStorage = require('../../lib/DBStorage');

var testConfig = require('./testConfig.json');
var dbName = testConfig.database;
var testTableName = testConfig.testTable;
var testData = {id:1,name:'test1',append:'ddd'};
var dataStruct = testConfig.dataStruct;
var dbStorage = new DBStorage({database:dbName});

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
        it('should add one recod And get data from update', function(done) {
            gameStorage.put(testTableName, testData, function(err) {
                should.not.exist(err);
                gameStorage.get(testTableName, testData._id, function(err, data) {
                    should.exist(data);
                    testData.id.should.equal(data.id);
                    testData.name.should.equal(data.name);
                    //put again to task 
                    gameStorage.put(testTableName, testData, function(err) {
                        should.not.exist(err);
                        done();
                    });
                    

                    //testData._id = data._id;
                });
                
            });
        });
        it('should get data from datas', function(done) {
            var testFun = function() {
                gameStorage.get(testTableName, testData._id, function(err, data) {
                    should.not.exist(err);
                    testData.id.should.equal(data.id);
                    testData.name.should.equal(data.name);
                    done();
                });
            }
            setTimeout(testFun, 100);
        });
        it('should can\'t put data', function(done) {
            gameStorage.put('abc', {}, function(err) {
                should.exist(err);
                
                done();
            });
        });
        it('should can\'t get data', function(done) {
            gameStorage.get('abc', {}, function(err) {
                should.exist(err);
                gameStorage.get(testTableName, {_id:444}, function(err, data) {
                    should.not.exist(err);
                    should.not.exist(data);
                });
                done();
            });
        });
        it('should update data', function(done) {
            testData.name = 'lastName';
            testData.id = 999;
            gameStorage.put(testTableName, testData, function(err, data) {
                should.not.exist(err);
                should.exist(data);
                var testFun = function() {
                    gameStorage.get(testTableName, testData._id, function(err, data2) {
                        should.not.exist(err);
                        should.exist(data2);
                        data2.id.should.equal(testData.id);
                        data2.name.should.equal(testData.name);
                        done();
                    });
                }
                setTimeout(testFun, 100);
            });
        });
        it('should stop Server', function(done) {
            gameStorage.stop();
            gameStorage.statue.should.equal('stop');
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
