/*
    db.createCollection("user", { size: 10240 } )
*/
var util = require('util');
var app = require('../../lib/DBStorage');
var should = require('should');
var mockBase = process.cwd() + '/test/lib';
var testDBName = 'testdb';
var testTableName = 'testDBStorage';
var dbStorage = null;
describe('DBStorage', function() {
    describe('#testDBStorage', function() {
        it('should create DBStorage And Connect to '+testDBName+' database', function(done) {
            dbStorage = new app({database:testDBName});
            should.exist(dbStorage);
            done();
        });
        it('Create '+testTableName+' Table', function(done) {
            dbStorage.createTable(testTableName, function(err) {
                should.not.exist(err);
                done();
            });
            
        });
        it('should get a new id and add one recod', function(done) {
            var newID = dbStorage.getNewID();
            should.exist(newID);
            var data = {_id:newID, id:1, name:'test'};
            dbStorage.put(testTableName, data, function(err, data) {
                should.not.exist(err);
                should.exist(data);
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
