var FSTK = require('fstk')
  , Async = require('async')
  , _ = require('underscore')
  , Belt = require('jsbelt')
  , Optionall = require('optionall')
  , Path = require('path')
  , Mediawiki = require('nodemw')
  , Txtwiki = require('txtwiki')
  , Request = require('request')
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

  M.parseWiki = function(text){
    var str = text.replace(/\[\[|\]\]/g, '');
    str = str.replace(/\{\{.*\}\}/g, '');
    str = str.replace(/\[.*\]/g, '');

    return Txtwiki.parseWikitext(str);
  };

  M.parseSentences = function(text){
    var str = this.parseWiki(text)
      , snt = _.filter(str.split(/[\.!\?]\W+/), function(s){
        return !s.match(/\*|\n|=|\|/) && s.length > 140;
      });

    snt = _.map(snt, function(s){
      return _.map(s.split(/\s/), function(w){
        if (w.match(/^[A-Z]/)) return Belt.sequence(_.constant('*'), w.length).join('');
        return w;
      }).join(' ');
    });

    return snt;
  };

  return M;
};
