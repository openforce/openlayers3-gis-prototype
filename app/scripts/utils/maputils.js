/*creates maps components*/
define(function(require) {
    'use strict';

    var proj4js = require('proj4js');
    var ol = require('openlayers');
    var dataUtils = require('datautils');

    // TODO
    // ol.proj.setProj4(proj4js);
    // proj4js.defs("EPSG:31287", "+proj=lcc +lat_1=49 +lat_2=46 +lat_0=47.5 +lon_0=13.33333333333333 +x_0=400000 +y_0=400000 +ellps=bessel +towgs84=577.326,90.129,463.919,5.137,1.474,5.297,2.4232 +units=m +no_defs");

    // var lambertProjection = ol.proj.get('EPSG:31287');
    //  lambertProjection.setExtent([107724.11, 284970.54, 680575.40, 575953.62]);

    var projection = new ol.proj.Projection({
        code: 'EPSG:31287',
        units: 'm',
        axisOrientation: 'neu'
    });

    var MapUtils = (function() {

        function MapUtils() {}

        MapUtils.prototype.getSomeJeoGesonFeature = function() {
            var geoGesonVectorSource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(dataUtils.data),
                projection: projection
            });
            return new ol.layer.Vector({
                source: geoGesonVectorSource,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: '#ffcc33',
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 2,
                        fill: new ol.style.Fill({
                            color: '#ffcc33'
                        })
                    })
                })
            });
        };

        MapUtils.prototype.getView = function() {
            return new ol.View({
                projection: 'EPSG:3857',
                center: [1445590, 6059660],
                zoom: 7.5,
                maxZoom: 18,
                minZoom: 6.3
            });
        };

        MapUtils.prototype.getTileLayer = function(rasterData) {
            var hiDPI = ol.has.DEVICE_PIXEL_RATIO > 1;
            var layer = hiDPI ? 'bmaphidpi' : 'geolandbasemap';
            var tilePixelRatio = hiDPI ? 2 : 1;

            var result = new ol.format.WMTSCapabilities().read(rasterData);
            var options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: layer,
                matrixSet: 'google3857',
                requestEncoding: 'REST',
                style: 'normal'
            });
            options.projection = 'EPSG:3857';
            options.tilePixelRatio = tilePixelRatio;
            return new ol.layer.Tile({
                source: new ol.source.WMTS(options),
                visible: true,
                name: 'basemapat',
            });
        };

        MapUtils.prototype.getSHPFilesFromGeoServer = function() {
            // var format = 'image/png';
            return new ol.layer.Tile({
                //visible: false,
                source: new ol.source.TileWMS({
                    url: 'http://localhost:8080/geoserver/test_workspace/wms',
                    params: {
                        //'FORMAT': format, 
                        'VERSION': '1.3.0',
                        tiled: true,
                        STYLES: '',
                        LAYERS: 'test_workspace:SDE_VW_GRENZ_POL_GEM_200_polygon',
                    },
                    wrapX: false,
                })
            });
        };

        MapUtils.prototype.getEsriLayer = function() {
            var attribution = new ol.Attribution({
                html: 'Tiles &copy; <a href="http://services.arcgisonline.com/ArcGIS/' +
                    'rest/services/World_Topo_Map/MapServer">ArcGIS</a>'
            });
            return new ol.layer.Tile({
                source: new ol.source.XYZ({
                    attributions: [attribution],
                    url: 'http://server.arcgisonline.com/ArcGIS/rest/services/' +
                        'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
                }),
                visible: false,
                name: 'esri'
            });

        };


        MapUtils.prototype.getMousePositionControl = function() {
            return new ol.control.MousePosition({
                className: 'custom-mouse-position',
                target: document.getElementById('location'),
                coordinateFormat: ol.coordinate.createStringXY(5),
                undefinedHTML: '&nbsp;'
            });
        };


        return MapUtils;
    })();

    return new MapUtils();

});
