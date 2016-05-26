define(function(require) {
    'use strict';

    var ol = require('openlayers');
    var turf = require('turf');
    var MapUtils = require('maputils');
    var gisApp = require('../mainAngularModule');

    var selectInteraction;
    var modifyInteraction;
    var drawInteraction;

    gisApp.factory('mapService', function($http, $q) {
        return {
            getMap: function(data) {
                return createMap($http, $q, data);
            },
            getMapScale: mapScale,
            drawFeature: drawFeatures,
            modifyFeature: modifyMyElements,
            saveFeatures: saveFeatures,
            zoomToCurrentPosition: zoomToCurrentLocation,
            changeRaster: toggleChangeMapRadioButtons
        };
    });

    function createMap(http, q, data) {
        return new ol.Map({
            controls: ol.control.defaults({ attribution: false }).extend([MapUtils.getMousePositionControl()]),
            target: 'map',
            maxResolution: 1000,
            layers: [MapUtils.getTileLayer(data), MapUtils.getEsriLayer(), MapUtils.getSHPFilesFromGeoServer(), MapUtils.getSomeJeoGesonFeature()],
            view: MapUtils.getView()
        });
    }

    function drawFeatures(scope, map) {
        scope.geometryType = scope.features[0];
        var vectorSource = getVectorSource(map);

        selectInteraction = refreshSelectInteraction(selectInteraction, map);
        if (typeof modifyInteraction !== 'undefined' && modifyInteraction !== null) {
            map.removeInteraction(modifyInteraction);
        }

        scope.drawTypeChanged = function() {
            map.removeInteraction(drawInteraction);
            drawInteraction = getNewDrawInteraction(scope, vectorSource);
            if (typeof drawInteraction !== 'undefined') {
                map.addInteraction(drawInteraction);
                console.log('adddddddded');
            }
        };
    }

    function mapScale(map) {
        map.getView().on('change:resolution', function(evt) {
            var resolution = evt.target.get('resolution');
            var units = map.getView().getProjection().getUnits();
            var dpi = 25.4 / 0.28;
            var mpu = ol.proj.METERS_PER_UNIT[units];
            var scale = resolution * mpu * 39.37 * dpi;
            if (scale >= 9500 && scale <= 950000) {
                scale = Math.round(scale / 1000) + "K";
            } else if (scale >= 950000) {
                scale = Math.round(scale / 1000000) + "M";
            } else {
                scale = Math.round(scale);
            }
            document.getElementById('scale').innerHTML = "Scale = 1 : " + scale;
        });
    }

    var getVectorSource = function(map) {
        var source;
        map.getLayers().forEach(function(item) {
            if (item instanceof ol.layer.Vector) {
                source = item.getSource();
            }
        });
        return source;
    };

    var refreshSelectInteraction = function(selectInteraction, map) {
        if (typeof selectInteraction !== 'undefined' && selectInteraction !== null) {
            map.removeInteraction(selectInteraction);
        }
        selectInteraction = new ol.interaction.Select({
            condition: ol.events.condition.click
        });
        map.addInteraction(selectInteraction);
        return selectInteraction;
    };

    var modifyMyElements = function($scope, map) {
        // $('#geoTypeCombo').addClass('hidden');
        console.log('modifyElements');
        selectInteraction = refreshSelectInteraction(selectInteraction, map);

        if (typeof drawInteraction !== 'undefined' && drawInteraction !== null) {
            map.removeInteraction(drawInteraction);
        }
        modifyInteraction = new ol.interaction.Modify({
            features: selectInteraction.getFeatures(),
             style: new ol.style.Style({
                    image: new ol.style.RegularShape({
                        fill: new ol.style.Fill({
                            color: 'blue'
                        }),
                        points: 4,
                        radius1: 15,
                        radius2: 1
                    })
                })
        });
        map.addInteraction(modifyInteraction);
        selectInteraction.getFeatures().on('add', function(e) {
            var feature = e.element;
            feature.on('change', function(e) {
                console.log('kkkkkkkvvvvv');
            });
        });
    };

    var getNewDrawInteraction = function($scope, vectorSource) {
        var retVal;
        var value = $scope.geometryType;
        if (value !== 'None') {
            retVal = new ol.interaction.Draw({
                source: vectorSource,
                type: /** @type {ol.geom.GeometryType} */ (value),
                style: new ol.style.Style({
                    image: new ol.style.RegularShape({
                        fill: new ol.style.Fill({
                            color: 'blue'
                        }),
                        points: 4,
                        radius1: 15,
                        radius2: 1
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#38C5EF',
                        width: 3
                    }),
                    fill: new ol.style.Fill({
                        color: '#F9FDF4'
                    })
                })
            });
            retVal.on('drawend', function(e) {
                var feature = e.element;
                //generateWkt();
                console.log('dddkk');
            });
        }
        return retVal;
    };

    var zoomToCurrentLocation = function(map) {
        var view = map.getView();
        var geolocation = new ol.Geolocation({
            projection: view.getProjection(),
            tracking: true
        });

        //   $('#geolocation').click(function() {
        var position = geolocation.getPosition();
        var point = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [new ol.Feature({
                    geometry: new ol.geom.Point(position)
                })]
            })
        });
        map.addLayer(point);
        view.setCenter(position);
        view.setResolution(2.388657133911758);
        return false;
        //    });
    };

    var saveFeatures = function(map) {
        map.getLayers().forEach(function(item) {
            if (item instanceof ol.layer.Vector) {
                var source = item.getSource();
                var features = source.getFeatures();
                console.log('numeber of features:' + features.length);
                var abort = false;
                for (var i = 0; i < features.length && !abort; i++) {
                    abort = checkIntersection(source, features[i]);
                }
            }
        });
    };

    var checkIntersection = function(source, toCheck) {
        var format = new ol.format.GeoJSON();
        var features = source.getFeatures();
        var abort = false;
        for (var i = 0; i < features.length && !abort; i++) {
            var featureI = features[i];
            console.log('feautreId is: ' + featureI.getId()); // the feature id has to be set.
            console.log('feature.getGeometry' + JSON.stringify(format.writeGeometry(featureI.getGeometry())));
            console.log('Projection: ' + JSON.stringify(format.readProjection(source)));
            // or write all features together
            // var geoGesonFeatures = format.writeFeatures(features);

            if (featureI !== toCheck) {
                var geoJsonFeatureI = format.writeFeatureObject(featureI);
                var geoJsonToCheck = format.writeFeatureObject(toCheck);
                var turfPoly = turf.intersect(geoJsonFeatureI, geoJsonToCheck);
                if (typeof turfPoly !== 'undefined') {
                    var intersection = format.readFeature(turfPoly);
                    if (typeof intersection !== 'undefined') {
                        alert('Polygon intersection');
                        abort = true;
                    }
                }
            }
        }

        return abort;
    };

    var toggleChangeMapRadioButtons = function(map) {
        $('#mapTypeRadioButtons').toggle('slide', 500);
        $('#layers input[type=radio]').change(function() {
            var layer = $(this).val();

            map.getLayers().getArray().forEach(function(item) {
                var name = item.get('name');
                item.setVisible(name === layer);
            });
        });

    };

   
});
