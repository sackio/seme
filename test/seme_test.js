'use strict';

var Seme = new require('../lib/seme.js')()
  , Async = require('async')
  , _ = require('underscore')
  , Belt = require('jsbelt')
  , FSTK = require('fstk')
;


/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['seme'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'setup': function(test) {
    test.ok(Seme);
    test.ok(Seme.settings.google);
    test.done();
  },
  'freebase': function(test){
    var globals = {};
    return Async.waterfall([
      function(cb){
        return Seme.services.freebase.description('Pink Floyd', Belt.cs(cb, globals, 'desc', 0));
      }
    , function(cb){
        test.ok(globals.desc);
        return cb();
      }
    , function(cb){
        return Seme.services.freebase.description('Pisdafasdfsadfsadfd', Belt.cs(cb, globals, 'desc', 0));
      }
    , function(cb){
        test.ok(!globals.desc);
        return cb();
      }
    , function(cb){
        return Seme.services.freebase.description('Radar', {sentence: true}, Belt.cs(cb, globals, 'desc', 0));
      }
    , function(cb){
        test.ok(globals.desc);
        return cb();
      }
    , function(cb){
        return Seme.services.freebase.topic('/en/william_shakespeare', Belt.cs(cb, globals, 'topic', 0));
      }
    , function(cb){
        test.ok(globals.topic);
        return cb();
      }
    , function(cb){
        return Seme.services.freebase.notable_type('william shakespeare', Belt.cs(cb, globals, 'result', 0));
      }
    , function(cb){
        test.ok(globals.result.name === 'Author');
        return cb();
      }
    , function(cb){
        return Seme.services.freebase.list('operas', {'max': 50}, Belt.cs(cb, globals, 'result', 0));
      }
    , function(cb){
        //test.ok(globals.result.name === 'Author');
        console.log(globals.result);
        return cb();
      }
    ], function(err){
      if (err) console.error(err);
      test.ok(!err);
      return test.done();
    });
  }
};
