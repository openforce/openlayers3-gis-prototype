define(function(require) {
    'use strict';

    var gisApp = require('mainAngularModule');
    gisApp.config(function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            controllerUrl: 'app/mainCtrl'
        }).when('/map', {
            templateUrl: 'views/map.html',
            controller: 'MapCtrl',
            resolve: {
                rasterData: function(rasterDataService) {
                    return rasterDataService.getRasterData();
                }
            }
        }).otherwise({
            redirectTo: '/'
        });
    });
});
