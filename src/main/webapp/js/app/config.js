
define(function(require){
        var gisApp = require('mainAngularModule');
        gisApp.config(function ($routeProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
               $routeProvider
                  .when('/', {
                    templateUrl: 'views/main.html',
                    controller: 'MainCtrl',
                    controllerUrl: 'app/mainCtrl'
                  })
                  .when('/about', {
                    templateUrl: 'views/about.html',
                    controller: 'AboutCtrl'
                  })
                  .otherwise({
                    redirectTo: '/'
                  });
        });
});
