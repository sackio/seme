var FSTK = require('fstk')
  , Async = require('async')
  , _ = require('underscore')
  , Belt = require('jsbelt')
  , Optionall = require('optionall')
  , Path = require('path')
  , Freebase = require('freebase')
  , Rol = require('rol')
;

module.exports = function(O){
  var Opts = O || new Optionall({'__dirname': Path.normalize(module.filename + '/../..')});

  var M = {};
  M.settings = Belt.extend({

  }, Opts, Opts.google, Opts.freebase);

  M._provider = Freebase;

  M._rol = new Rol();
  M._rol.addRule(function(acObj, methObj, cb){
    var larg = methObj.args.length === 2 ? methObj.args[0] : methObj.args[1];
    if (larg) larg = _.extend({}, larg, {'key': acObj.key});
    return cb();
  });
  M._rol.wrap(M._provider);

  _.each(M._provider, function(v, k){
    if (M[k]) return;
    M[k] = function(){
      return M._provider.rol(M.settings, k, arguments);
    };
  });

  //fuzzy topic list (interpolate property values with type)
  //applicable type (based on properties)

  return M;
};
