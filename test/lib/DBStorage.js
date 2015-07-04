/*
    db.createCollection("user", { size: 10240 } )
*/
var assert = require('assert');
var util = require('util');
var app = require('../../lib/DBStorage');
var should = require('should');
var mockBase = process.cwd() + '/test/lib';

var testConfig = require('./testConfig.json');
var dbName = testConfig.database;
var testTableName = testConfig.testTable;
var testData = testConfig.data;

var dbStorage = null;
var newID = null;
describe('DBStorage', function() {
    describe('#testDBStorage', function() {
        it('should create DBStorage And Connect to '+dbName+' database', function(done) {
            dbStorage = new app({database:dbName});
            should.exist(dbStorage);
            done();
        });
        it('Create '+testTableName+' Table', function(done) {
            dbStorage.createTable(testTableName, function(err) {
                should.not.exist(err);
                done();
            });
            
        });
        it('should get listTable '+testTableName, function(done){
            dbStorage.listTable(function(err, tables) {
                should.not.exist(err);
                should.exist(tables[0]);
                done();
            });
        });
        it('should get a new id', function(done) {
            newID = dbStorage.getNewID();
            testData._id = newID;
            should.exist(newID);
            done();
        });
        it('should add one record', function(done) {
            
            dbStorage.put(testTableName, testData, function(err, data) {
                should.not.exist(err);
                should.exist(data);
                done();
            });
        });
        it('should get one record', function(done) {
            dbStorage.get(testTableName, newID, function(err, data) {
                should.not.exist(err);
                data.length.should.equal(1);
                
                var _data = data[0];
                testData.id.should.equal(_data.id);
                testData.name.should.equal(_data.name);

                done();
            });
        });
        it('should update one record', function(done) {
            testData.id = 2;
            testData.name = 'test2';
            dbStorage.put(testTableName, testData, function(err, data) {
                should.not.exist(err);

                dbStorage.get(testTableName, {_id:newID}, function(err2, data2) {
                    should.not.exist(err2);
                    data2.length.should.equal(1);
                    
                    var _data = data2[0];
                    testData.id.should.equal(_data.id);
                    testData.name.should.equal(_data.name);

                    done();
                });
            });
        });
        it('should remove data', function(done) {
            dbStorage.remove(testTableName, newID, function(err) {
                should.not.exist(err);
                dbStorage.get(testTableName, newID, function(err2, data) {
                    should.not.exist(err2);
                    data.length.should.equal(0);
                    done();
                });
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
