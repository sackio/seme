var FSTK = require('fstk')
  , Async = require('async')
  , _ = require('underscore')
  , Belt = require('jsbelt')
  , Optionall = require('optionall')
  , Path = require('path')
;

module.exports = function(Seme, O){
  var Opts = O || new Optionall({'__dirname': Path.normalize(module.filename + '/../..')});

  var M = {};
  M.settings = Belt.extend({

  }, [Opts]);

  //faker lorem
  M['random'] = Seme.services.faker.Lorem;
  /*M['random'].phrase = Seme.services.faker.Company.catchPhrase;
  M['random'].adjective = Seme.services.faker.Company.bsAdjective;
  M['random'].descriptor = Seme.services.faker.Company.catchPhraseDescriptor;
  M['random'].noun = Seme.services.faker.Company.bsNoun;
  M['random'].buzz = Seme.services.faker.Company.bsBuzz;*/

  M['sources'] = {
    'Frankenstein': {
      'sections': 17
    , 'title': function(s){ return 'Frankenstein/Chapter_' + s; }
    }
  , 'Hamlet': {
      'sections': 5
    , 'title': function(s){ return 'The_Tragedy_of_Hamlet,_Prince_of_Denmark/Act_' + s; }
    }
  , 'Moby_Dick': {
      'sections': 135
    , 'title': function(s){ return 'Moby-Dick/Chapter_' + s; }
    }
  , 'Abelard': {
      'sections': 6
    , 'title': function(s){ return 'Letters_of_Abélard_and_Héloïse/Letter_' + s; }
    }
  };

  M['get_source'] = function(options, callback){
    var a = Belt.argulint(arguments)
      , self = this;
    a.o = _.defaults(a.o, {
      'source': self.sources[_.sample(_.keys(self.sources))]
    });
    a.o = _.defaults(a.o, {
      'section': Belt.random_int(1, Belt._get(a.o, 'sources.sections') + 1)
    });
    return Seme.services.wikisource.getArticle(a.o.source.title(a.o.section)
    , function(s){ return a.cb(null, s); });
  };

  M['get_article'] = function(topic, options, callback){
    var a = Belt.argulint(arguments)
      , self = this;
    a.o = _.defaults(a.o, {

    });

    return Seme.services.wikipedia.getArticle(topic
    , function(s){ return a.cb(null, s); });
  };

  M['get_quotes'] = function(speaker, options, callback){
    var a = Belt.argulint(arguments)
      , self = this;
    a.o = _.defaults(a.o, {

    });

    return Seme.services.wikiquote.getArticle(speaker
    , function(s){ return a.cb(null, s); });
  };

  return M;
};
