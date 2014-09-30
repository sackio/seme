var FSTK = require('fstk')
  , Async = require('async')
  , _ = require('underscore')
  , Belt = require('jsbelt')
  , Optionall = require('optionall')
  , Path = require('path')
  , Mediawiki = require('nodemw')
  , Txtwiki = require('txtwiki')
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

  M.wikipedia = new Mediawiki(Belt.extend(M.settings, {
    'server': 'en.wikipedia.org'
  , 'path': '/w'
  , 'debug': false
  , 'concurrency': 5
  }));

  M.wikiquote = new Mediawiki(Belt.extend(M.settings, {
    'server': 'en.wikiquote.org'
  , 'path': '/w'
  , 'debug': false
  , 'concurrency': 5
  }));

  M.parseWiki = Txtwiki.parseWikitext;

  return M;
};
