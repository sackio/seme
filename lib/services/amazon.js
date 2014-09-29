var FSTK = require('fstk')
  , Async = require('async')
  , _ = require('underscore')
  , Belt = require('jsbelt')
  , Optionall = require('optionall')
  , Path = require('path')
  , Amazon = require('amazon-product-api')
;

module.exports = function(O){
  var Opts = O || new Optionall({'__dirname': Path.normalize(module.filename + '/../..')});

  var M = {};
  M.settings = Belt.extend({

  }, [Opts, Opts.amazon]);

  M = Amazon.createClient({
    'awsId': M.settings.key
  , 'awsSecret': M.settings.secret
  , 'awsTag': M.settings.tag
  });

  return M;
};
