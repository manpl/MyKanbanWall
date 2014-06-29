'use strict';

/* Directives */


angular.module('myApp.directives', ['ngTable']).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('kanbanitem',  function(version) {
    
    return {
    	restrict: 'E',
    	scope: {item: '='},
    	templateUrl: 'partials\\kanbanitem.html',
    	link: function(scope, element, attrs){
    		
        element.draggable();

    	}
    };

 }).directive('kanbanlane',  function(version) {
    
    return {
      restrict: 'E',
      templateUrl: 'partials\\kanbanlane.html',
      replace: true,
      scope: {
        items: '=',
        itemstate: '@'
      },
      controller: function($scope) {
        debugger;
        $scope.visible = true;
        $scope.collapse = function(){
           $scope.visible = !$scope.visible;
        }
      },
      link: function(scope, element, attrs){
            debugger;
            console.log(element);
            $(element).resizable({ handles: "e" });
          
      }
    };

 });
