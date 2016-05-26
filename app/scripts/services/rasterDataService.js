define(function(require) {
    'use strict';

    var gisApp = require('../mainAngularModule');

    gisApp.factory('rasterDataService', function($http) {
        return {
            getRasterData: function() {
                var capabilitiesUrl = 'http://www.basemap.at/wmts/1.0.0/WMTSCapabilities.xml';
                var promise = $http.get(capabilitiesUrl).success(function(response) {
                    return response;
                }).error(function(response) {
                    //todo logging
                    console.error('error while getting data!!!!');
                });
                return promise;
            }
        };
    });
});
