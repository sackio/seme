/*
 * seme
 * https://github.com/sackio/seme
 *
 * Copyright (c) 2014 Ben Sack
 * Licensed under the MIT license.
 */

var FSTK = require('fstk')
  , Async = require('async')
  , _ = require('underscore')
  , Belt = require('jsbelt')
  , Path = require('path')
  , Optionall = require('optionall')
  , Generators = {}
  , Services = {}
;

Generators = FSTK._fs.readdirSync(Path.join(module.filename, '../generators'));
Generators = _.object(_.map(Generators, function(g){ return FSTK.filename(g); })
                    , _.map(Generators, function(g){ return require(Path.join(module.filename, '../generators', '/', g)); }));

Services = FSTK._fs.readdirSync(Path.join(module.filename, '../services'));
Services = _.object(_.map(Services, function(g){ return FSTK.filename(g); })
                  , _.map(Services, function(g){ return require(Path.join(module.filename, '../services', '/', g)); }));

module.exports = function(O){
  var Opts = O || new Optionall({'__dirname': Path.normalize(module.filename + '/../..')});

  var M = {};
  M.settings = Belt.extend({

  }, Opts);

  M['generators'] = Generators;
  M['services'] = Services;

  M.services.freebase = new M.services.freebase(M.settings.google);

  return M;
};
