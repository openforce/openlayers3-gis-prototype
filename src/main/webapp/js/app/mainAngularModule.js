
define(function(require){
'use strict';

     var jqueryUi = require('jquery-ui');
     var ngAnimate = require('angAnimate');
     var ngCookies = require('angCookies');
     var ngRoute = require('angRoute');
     var ngResource = require('angResource');
     var ngSanitize  = require('angSanitize');
     var ngTouch = require('angTouch');


     var gisApp = angular.module('gisApp', [ 'ngRoute',
                                            'ngAnimate',
                                            'ngCookies',
                                            'ngSanitize',
                                            'ngResource',
                                            'ngTouch'
                                            ]);
    return gisApp;
});