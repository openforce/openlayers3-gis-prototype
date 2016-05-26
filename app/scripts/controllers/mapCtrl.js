define(function(require) {
    'use strict';

    let gisApp = require('../mainAngularModule');
       
    gisApp.controller('MapCtrl', function($scope, $http, mapService, rasterData) {

        $scope.myRasterData = rasterData;
        $scope.features = ['None', 'Polygon', 'LineString'];
        $scope.measureGeoTypes = ['Area', 'length'];
        $('#mapTypeRadioButtons').hide();

        var map = mapService.getMap(rasterData.data);
        mapService.getMapScale(map);

        console.log('mapProjection is:: ' + map.getView().getProjection().lb);

        $scope.drawFeature = function() {
            $('#geoTypeCombo').removeClass('hidden');
            mapService.drawFeature($scope, map);
        };

        $scope.modifyFeature = function() {
            $('#geoTypeCombo').addClass('hidden');
            mapService.modifyFeature($scope, map);
        };

        $scope.saveElements = function() {
            mapService.saveFeatures(map);
        };

        $scope.currentPosition = function(){
            mapService.zoomToCurrentPosition(map);
        };
        
        $scope.changeRaster = function(){
            mapService.changeRaster(map);
        };

    });

});
