define(function(require)  {
   'use strict';
   
  require('jquery-ui');
  require('angAnimate');
  require('angCookies');
  require('angRoute');
  require('angResource');
  require('angSanitize');
  require('angTouch');
  
  require('datautils');
  require('maputils');
  require('./services/rasterDataService');
  require('./services/mapservice');
  require('./controllers/mainCtrl');
  require('./controllers/mapCtrl');
  require('config');
});
