var FSTK = require('fstk')
  , Async = require('async')
  , _ = require('underscore')
  , Belt = require('jsbelt')
  , Optionall = require('optionall')
  , Path = require('path')
  , Flickr = require('flickrapi')
;

module.exports = function(O, cb){
  var Opts = O || new Optionall({'__dirname': Path.normalize(module.filename + '/../..')});

  var M = {};
  M.settings = Belt.extend({

  }, Opts, Opts.flickr);

  return Flickr.tokenOnly({'api_key': M.settings.flickr.key, 'secret': M.settings.flickr.secret}
  , function(err, api){
    if (err) console.error(err);
    M = api;

    M['url'] = function(pObj){
      return _.template('https://farm<%= farm %>.staticflickr.com/<%= server %>/<%= id %>_<%= secret %>_b.jpg')
               (pObj);
    };

    return cb(err, M);
  });
};
