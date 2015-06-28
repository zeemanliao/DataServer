'use strict';

let Storage = require('./lib/GameStorage');

let gameDB = new Storage({database:'gamedb'});

gameDB.load();