
requirejs.config({
    paths: {
       'jquery': '../../lib/js/jquery-2.1.4.min',
       'jquery-ui': '../../lib/js/jquery-ui.min',
       'angular': '../../lib/js/angular',
       'bootstrap':'../../lib/js/bootstrap',
       'angCookies': '../../lib/js/angular-cookies.min',
       'angResource': '../../lib/js/angular-resource.min',
       'angAnimate': '../../lib/js/angular-animate.min',
       'angRoute': '../../lib/js/angular-route',
       'angSanitize': '../../lib/js/angular-sanitize.min',
       'angTouch': '../../lib/js/angular-touch.min',
       'openlayers': '../../lib/js/ol',
       'turf': '../../lib/js/turf',
       'aboutCtrl' : './controllers/aboutCtrl',
       'mainCtrl' : './controllers/mainCtrl',
       'config'  : 'config',
       'app' : 'app',
       'mainAngularModule': 'mainAngularModule'
    },
    shim:{
          'bootstrap': {
                deps: ['jquery']
          },
          'angular': {
                deps: ['jquery']
          },
          'openlayers': {
                  deps: ['turf']
          },
//          'turf': {
//                deps: ['openlayers']
//          },
           'jquery-ui':{
                 deps: ['jquery']
            },
           'angCookies': {
              deps: ['angular']
           },
           'angResource': {
                deps: ['angular']
           },
           'angAnimate': {
              deps: ['angular']
           },
           'angRoute': {
                deps: ['angular']
           },
           'angSanitize': {
                deps: ['angular']
           },
           'angTouch': {
                deps: ['angular']
           }
//           ,
//           'app': ['mainAngularModule', 'mainCtrl', 'aboutCtrl', 'config']
    },
    priority: ['angular','angularRoute', 'openlayers', 'turf']
});

// Start loading the main app file. Put all of your application logic in there.
require(['app' ], function(app){
    return angular.bootstrap(document, ['gisApp']);
});