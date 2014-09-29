var FSTK = require('fstk')
  , Async = require('async')
  , _ = require('underscore')
  , Belt = require('jsbelt')
  , Optionall = require('optionall')
  , Path = require('path')
  , Mediawiki = require('nodemw')
;

module.exports = function(O){
  var Opts = O || new Optionall({'__dirname': Path.normalize(module.filename + '/../..')});

  var M = {};
  M.settings = Belt.extend({

  }, [Opts, Opts.mediawiki]);

  M.wikisource = new Mediawiki(Belt.extend(M.settings, {
    'server': 'en.wikisource.org'
  , 'path': '/w'
  , 'debug': false
  , 'concurrency': 5
  }));

  /*M.wikisource.getArticle = function(title, options, callback){
    var a = Belt.argulint(arguments)
      , self = this;
    a.o = _.defaults(a.o, {

    });
    var params = {
      'action': 'query'
    , 'titles': title
    , 'format': 'json'
    , 'rvprop': 'content'
    , 'prop': 'revisions'
    };
    return this.api.call(params, a.cb);
  };*/

  return M;
};
