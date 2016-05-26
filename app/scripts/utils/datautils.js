define(function() {
    'use strict';
    
    var DataUtils = (function() {
        function DataUtils() {}
        DataUtils.prototype.data = {
            'type': 'FeatureCollection',
            'crs': {
                'type': 'name',
                'properties': {
                    'name': 'EPSG:4326'
                }
            },
            'features': [{
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                        [
                            [1435640.2652521804, 6067189.120135865],
                            [1435602.0467380378, 6068832.516243996],
                            [1435678.483766323, 6070170.164238987],
                            [1431856.6323520641, 6069329.35692785],
                            [1433041.4062904844, 6067227.338650008],
                            [1434417.2727996176, 6065354.6314570205],
                            [1435640.2652521804, 6067189.120135865]
                        ]
                    ]
                }
            }, {
                'type': 'Feature',
                'geometry': {
                    'type': 'Polygon',
                    'coordinates': [
                        [
                            [1430996.7157838559, 6064016.98346203],
                            [1433060.5155475556, 6060806.628274052],
                            [1425722.5608321787, 6059889.383934631],
                            [1425034.6275776122, 6063099.739122608],
                            [1430996.7157838559, 6064016.98346203]
                        ]
                    ]
                }
            }]
        };
        return DataUtils;
    })();
    return new DataUtils();
});