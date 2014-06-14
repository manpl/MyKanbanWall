'use strict';

/* Controllers */

var mod = angular.module('myApp.controllers', []);

mod.controller('LoginCtrl', ['$scope', '$location', function($scope, $location) {

    $scope.login = function()
    { 
        $scope.isAuthenticated = true; 
        $scope.user.username =''; 
        $scope.user.password = '';
        $scope.loginform.$setPristine();
    };

    $scope.logout = function(){ $scope.isAuthenticated = false;  };
    $scope.user = {username:'', password: ''};

    $scope.isAuthenticated = false;

}]);

mod.controller('MasterCtrl', ['$scope', '$location', function($scope, $location) {
    
    
    $scope.getClass = function(path) {
    if ($location.path().substr(0, path.length) == path) {
          return "active"
        } else {
          return ""
        }
    }

  }])
  .controller('ProjectCtrl', ['$scope', function($scope) {

  	$scope.Items = [
  		{
  			Caption: 'Item #1',
  			Owner: 'nawrockim@op.pl',
  			Content: 'Learn angularjs and write an application. i.e Kanban board',
  			State: 'Proposed'
  		},
  		{
  			Caption: 'Item #2',
  			Owner: 'nawrockim@op.pl',
  			Content: 'asdbsadadsadas',
  			State: 'Completed'
  		}
  	];

  }])
  .controller('AllProjectsCtrl', ['$scope','ngTableParams', '$http', function($scope, ngTableParams, $http) {


   

    $scope.projectsTableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            name: 'asc'     // initial sorting
        }
    }, {
      total: 100,
        getData: function($defer, params) {
            $http.get('/api/projects/').success(function(data){
                params.total(data.length);
                data = data.slice((params.page() - 1) * params.count(), params.page() * params.count());
                console.log(data);
                $defer.resolve(data);
            }).error(
              function(){
                alert('error')
              }
            );

        }
    });

  }]);;


  
