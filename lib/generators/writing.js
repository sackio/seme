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
  };

  return M;
};
