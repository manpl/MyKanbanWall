'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/intro', {templateUrl: 'partials/intro.html', controller: 'MasterCtrl'});
  $routeProvider.when('/editUser', {templateUrl: 'partials/user.html', controller: 'UserCtrl'});
  $routeProvider.when('/registerUser', {templateUrl: 'partials/user.html', controller: 'UserCtrl'});
  $routeProvider.when('/project/:id', {
  		templateUrl: function(id){
  			return 'partials/project.html';
  		}, 
  		controller: 'ProjectCtrl'
  	});
  $routeProvider.when('/allProjects', {templateUrl: 'partials/allProjects.html', controller: 'AllProjectsCtrl'});
  $routeProvider.otherwise({redirectTo: '/intro'});
}]);
