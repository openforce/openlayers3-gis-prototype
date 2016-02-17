
define(function(require ){
 'use strict';

    var gisApp = require('../mainAngularModule');
    var ol = require('openlayers');
    var turf = require('turf');

    gisApp.controller('AboutCtrl', function ($scope, $http) {

      $scope.features = ['None', 'Polygon', 'LineString'];
      $scope.measureGeoTypes = ['Area', 'length'];

      var map = init($http);
      $scope.drawFeature = function(){
          $('#geoTypeCombo').removeClass('hidden');
          startDraw($scope, map);
      }

      $scope.getAllElements = function(){
        getAllFeatures(map);
      }

      $scope.enableMeasurement = function(){
       // $('#measureGeoTypeCombo').removeClass('hidden');
        myMeasure(map,$scope);
      }


      toggleChangeMapRadioButtons(map);
      zoomToCurrentLocation(map);
       // displayMapPopup(map);
      addBasemapWMTSLayer(map, $http);

    });


    var startDraw = function($scope, map){
    $scope.geometryType = $scope.features[0]; 
    var modifyIteration;
    var drawInteraction;
    var vectorSource = getVectorSource(map);

    var selectIteration = new ol.interaction.Select({
              condition: ol.events.condition.click
    });
    map.addInteraction(selectIteration);
    selectIteration.getFeatures().clear();

    $scope.drawTypeChanged = function () {
       if(typeof modifyiteration !== 'undefined'){ 
            map.removeInteraction(modifyiteration); 
       }  
       //remove the old draw interaction
       map.removeInteraction(drawInteraction); 
       drawInteraction = getNewDrawInteraction($scope, vectorSource);
       //at the begin the drawInteraction is not initialized --> undefined
       if(typeof drawInteraction !== 'undefined'){ 
           map.addInteraction(drawInteraction);
           console.log('adddddddded');
       }

    }; 

    $scope.modifyFeature = function(){ 
        $('#geoTypeCombo').addClass('hidden');
        if (selectIteration !== null) { 
           map.removeInteraction(drawInteraction); 
           modifyIteration = new ol.interaction.Modify({ 
              features: selectIteration.getFeatures() 
           }); 
           map.addInteraction(modifyIteration);  
           selectIteration.getFeatures().on('add', function(e) { 
               var feature = e.element; 
               feature.on('change', function(e) { 
                    console.log('kkkkkkkvvvvv'); 
               }); 
           }); 
        } 
    } 
}


    function getNewDrawInteraction($scope, vectorSource){
      var retVal;
      var value = $scope.geometryType;
          if (value !== 'None') {
              retVal = new ol.interaction.Draw({
              source: vectorSource,
              type: /** @type {ol.geom.GeometryType} */ (value)
            });
            retVal.on('drawend', function(e) {
            var feature = e.element;
                  //generateWkt();
                  console.log('dddkk');
            });
          }
      return retVal;
    }


    function removeDrawInteraction(map){
        map.getLayers().forEach(function(item){
        if(item instanceof ol.interaction.Draw){
            map.removeInteraction(item);
            console.log('TODO');
        }
    });

    }


    function init($http) {
        var view = new ol.View({
        //epsg: 31287 -mgi/ austria lambert
        projection: 'EPSG:3857',
        center: [1445590,6059660],
        zoom: 7
       // maxZoom 10,
       // minZoom: 2
    });

    var raster = new ol.layer.Tile({
      source: new ol.source.MapQuest({
        layer: 'osm'
      }),
     visible: true,
     name: 'mapquest'
   });

    var vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector(),
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

     var map = new ol.Map({
        layers: [raster, getEsriLayer(), vectorLayer],
        target: 'map',
        view: view
     });

     return map;
    }

    var displayMapPopup = function displayPopup(map){

      var element = $('#popup');
    	var popup = new ol.Overlay({
      		element: element,
      		stopEvent: false
    	});

    	map.addOverlay(popup);

      // TODO when selecting a feature, display the size
    	map.on('click', function(evt) {

    		var feature = map.forEachFeatureAtPixel(evt.pixel,
    			function(feature, layer) {
    				return feature;
    			});

    		if (feature) {
    			var coordinate = feature.getGeometry().getCoordinates();
    			element.show();
    		//	element.html(feature.get('text') +
    			//    ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326')));
    			element.html('halli hallooooooo');
    			popup.setPosition(coordinate);
    		} else {
    			element.hide();
    		}
    	});
    }

    var zoomToCurrentLocation = function currentGeoLocation(map){

     var view = map.getView();
     var geolocation = new ol.Geolocation({
             projection: view.getProjection(),
             tracking: true
     });

     $('#geolocation').click(function() {

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
        });
    }

    var toggleChangeMapRadioButtons = function toggleChangeMapRadios(map){

      $('#mapTypeRadioButtons').hide();
      function toogleButton() {
        $('#mapTypeRadioButtons').toggle('slide', 500 );
      };
      $('#changeMapButton').click(function() {
        toogleButton();
        showSelectedMap();
      });

      //set visible layer
      function showSelectedMap(){
        $('#layers input[type=radio]').change(function() {
            var layer = $(this).val();

            map.getLayers().getArray().forEach(function(item) {
              var name = item.get('name');
              item.setVisible(name == layer);
            });
          });
      }
    }



  var addBasemapWMTSLayer = function addWmtsLayer(map, $http){
      var capabilitiesUrl = 'http://www.basemap.at/wmts/1.0.0/WMTSCapabilities.xml';
      //var capabilitiesUrl = 'http://maps.wien.gv.at/basemap/1.0.0/WMTSCapabilities.xml';

      var hiDPI = ol.has.DEVICE_PIXEL_RATIO > 1;
      var layer = hiDPI ? 'bmaphidpi' : 'geolandbasemap';
      var tilePixelRatio = hiDPI ? 2 : 1;

       var response = $http.get(capabilitiesUrl);
       response.success(function(data, status, headers, config) {
             var result = new ol.format.WMTSCapabilities().read(data);
             var options = ol.source.WMTS.optionsFromCapabilities(result, {
                layer: layer,
                matrixSet: 'google3857',
                requestEncoding: 'REST',
                style: 'normal'
              });
              options.tilePixelRatio = tilePixelRatio;

               var tileLayer = new ol.layer.Tile({
                    source: new ol.source.WMTS(options),
                    visible: false,
                    name: 'basemapat'
                });

              map.addLayer(tileLayer);
        });
        response.error(function(data, status, headers, config) {
            alert("AJAX failed!");
        });
    }

    function getVectorSource (map){
        var source;
        map.getLayers().forEach(function(item){
            if(item instanceof ol.layer.Vector){
                source = item.getSource();
            }
        });
        return source;
    }

    function getEsriLayer(){
        var attribution = new ol.Attribution({
        html: 'Tiles &copy; <a href="http://services.arcgisonline.com/ArcGIS/' +
            'rest/services/World_Topo_Map/MapServer">ArcGIS</a>'
    });

    var esri = new ol.layer.Tile({
         source: new ol.source.XYZ({
             attributions: [attribution],
             url: 'http://server.arcgisonline.com/ArcGIS/rest/services/' +
                   'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
             }),
          visible: false,
          name: 'esri'
       });

       return esri;
    }

    function getAllFeatures(map){
        map.getLayers().forEach(function(item){
         if(item instanceof ol.layer.Vector){
            var source = item.getSource();
            var features = source.getFeatures();
            console.log('numeber of features:' + features.length);


           var abort = false;
           for(var i=0; i<features.length && !abort; i++){
              abort = checkIntersection(source, features[i]);
           }
         }
        });
    }

    function checkIntersection(source, toCheck){
         var format = new ol.format.GeoJSON();
         var features = source.getFeatures();
         var abort = false;
         for(var i=0; i<features.length && !abort; i++){
           var featureI = features[i];
            console.log('feautreId is: '+featureI.getId()); // the feature id has to be set.
            console.log('feature.getGeometry'+ JSON.stringify(format.writeGeometry(featureI.getGeometry())));
            console.log('Projection: '+JSON.stringify(format.readProjection(source)));
            // or write all features together
            // var geoGesonFeatures = format.writeFeatures(features);

             if(featureI != toCheck){
                var geoJsonFeatureI = format.writeFeatureObject(featureI);
                var geoJsonToCheck = format.writeFeatureObject(toCheck);
                var turfPoly = turf.intersect(geoJsonFeatureI, geoJsonToCheck);
                if(typeof turfPoly !== 'undefined'){
                     var intersection = format.readFeature(turfPoly);
                     if(typeof intersection !== 'undefined'){
                         alert('Polygon intersection');
                         abort=true;
                     }
                }
             }
         }
        return abort;
    }


    /**
        TODO under construction
    */
    var myMeasure = function(map,$scope){
        console.log('todo');
    }

});







