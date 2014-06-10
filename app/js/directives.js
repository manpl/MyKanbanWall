'use strict';

/* Directives */


angular.module('myApp.directives', []).
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
      transclude: true,
      scope:{itemstate: '@itemstate'},
      link: function(scope, element, attrs){
        
       // element.draggable();

      }
    };

 });
