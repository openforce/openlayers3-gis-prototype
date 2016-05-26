'use strict';

requirejs.config({
    paths: {
        'angular': '../../bower_components/angular/angular',
        'angAnimate': '../../bower_components/angular-animate/angular-animate',
        'angCookies': '../../bower_components/angular-cookies/angular-cookies',
        'angMocks': '../../bower_components/angular-mocks/angular-mocks',
        'angResource': '../../bower_components/angular-resource/angular-resource',
        'angRoute': '../../bower_components/angular-route/angular-route',
        'angSanitize': '../../bower_components/angular-sanitize/angular-sanitize',
        'angTouch': '../../bower_components/angular-touch/angular-touch',
        'bootstrap': '../../bower_components/bootstrap/dist/js/bootstrap',
        'openlayers': '../../bower_components/OpenLayers/dist/ol',
        'jquery': '../../bower_components/jquery/dist/jquery',
        'jquery-ui': '../../bower_components/jquery-ui/jquery-ui',
        'turf': '../../bower_components/turf/turf.min',
        'proj4js': '../../bower_components/proj4/dist/proj4',

        'datautils': './utils/datautils',
        'maputils': './utils/maputils',
        'rasterDataService': './services/rasterDataService',
        'mapService': './services/mapservice',
        'mapCtrl': './controllers/mapCtrl',
        'mainCtrl': './controllers/mainCtrl',
        'config': 'config',
        'app': 'app',
        'mainAngularModule': 'mainAngularModule'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'angular': {
            deps: ['jquery']
        },
        'openlayers': {
            deps: ['turf']
        },
        'jquery-ui': {
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
    }

});

require(['app'], function() {
    return angular.bootstrap(document, ['gisApp']);
});
