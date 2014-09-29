var FSTK = require('fstk')
  , Async = require('async')
  , _ = require('underscore')
  , Belt = require('jsbelt')
  , Optionall = require('optionall')
  , Path = require('path')
  , Faker = require('faker')
  , Rol = require('rol')
;

module.exports = function(O){
  var Opts = O || new Optionall({'__dirname': Path.normalize(module.filename + '/../..')})
    , M = {};

  M.settings = Belt.extend({

  }, Opts);

  M['credit_card_numbers'] = {
    'valid': {
      'visa': [,'4111111111111111', '4005519200000004', '4009348888881881'
               , '4012000033330026', '4012000077777777', '4012888888881881'
               , '4217651111111119', '4500600000000061']
    , 'mastercard': ['5555555555554444']
    , 'american_express': ['378282246310005', '371449635398431']
    , 'discover': ['6011111111111117']
    , 'jcb': ['3530111333300000']
    }
  , 'invalid': {
      'visa': ['4000111111111115']
    , 'mastercard': ['5105105105105100']
    , 'american_express': ['378734493671000']
    , 'discover': ['6011000990139424']
    }
  };

  M['cvv_codes'] = {
    'not_match': ['200']
  , 'not_verified': ['201']
  , 'no_participate': ['301']
  };

  M['credit_card_types'] = {
    'prepaid': ['4500600000000061']
  , 'commercial': ['4009040000000009']
  , 'durbin': ['4005519200000004']
  , 'healthcare': ['4012000033330026']
  , 'debit': ['4012000033330125']
  , 'payroll': ['4012000033330224']
  , 'unknown': ['4012000033330323']
  , 'negative': ['4012000033330422']
  };

  return M;
};
