'use strict';

/* Controllers */

var mod = angular.module('myApp.controllers', []);

mod.controller('LoginCtrl', ['$scope', '$location', '$http' , function($scope, $location, $http) {

    $scope.login = function()
    { 
        console.log('login');         

        $http.post('/login/', $scope.user)
        .success(function(data, status, headers){
            console.log('success')
            if(status == 200){
              $scope.isAuthenticated = true;
              $scope.loginform.$setPristine();
              $scope.user.displayName = data.displayName;
            }
        })
        .error(function(data, status, headers){
            console.log(status);
        });  
    };

    $scope.logout = function(){ $scope.isAuthenticated = false;  };
    $scope.user = {username:'', password: ''};

    $scope.isAuthenticated = false;

}]);


mod.controller('UserCtrl', ['$scope', '$location','$http', function($scope, $location, $http) {
    
    console.log('UserCtrl');

    $scope.title = "New user";    

    $scope.titles = ['Mr', 'Mrs', 'Ms', 'Miss'];

    $scope.user = {
      title:''
    };

    $scope.$watch("user.email", function(){
        
        var eml = $scope.user.email;
        
        if(eml){
            console.log(eml.trim());
            $scope.hash = md5(eml);
            console.log($scope.hash)
        }
        else{
          $scope.hash = "";
        }

    });


    $scope.save = function(user, form){
      console.log('save');
      
      if(user.password != user.password2){
        form.password.$setValidity('password does not match', false);
        form.password2.$setValidity('password does not match', false);
        return;
      }

      $http.post('/api/users/', user)
      .success(function(data, status, headers){
            alert('ok')        
      })
      .error(function(data, status, headers){
          var key;
          if(data.errors){
            for(key in data.errors)
            {
                console.log('key: ' + key)
                var message = data.errors[key].message;
                var element = form[key]; 
                element.$error.backend = message;
            }
        }
      });

//      userForm.password1.$setValidity("test", false);
    };

  }]);


mod.controller('MasterCtrl', ['$scope', '$location', function($scope, $location) {
    
    console.log('MasterCtrl');
    
    $scope.getClass = function(path) {
    if ($location.path().substr(0, path.length) == path) {
          return "active"
        } else {
          return ""
        }
    }

    $scope.getViewClass = function(){

      if($location.path().indexOf('/project') > -1){
        return 'fullScreen';
      }

      return '';
    }

  }])
  .controller('ProjectCtrl', ['$scope', function($scope) {

  	$scope.kbwItems = [{
      Caption: 'a',
      Owner: '',
      Content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore'
    },
    {
      Caption: 'b',
      Owner: '',
      Content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam'
    }];

  }])
  .controller('AllProjectsCtrl', ['$scope','ngTableParams', '$http', '$location', function($scope, ngTableParams, $http, $location) {


    $scope.projectsTableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            name: 'asc'     // initial sorting
        }
    }, {
      total: 100,
        getData: function($defer, params) {
            var page = params.page() - 1,
                size = params.count(),
                url = '/api/projects/?pageNo='+page+'&pageSize=' + size,
                filter = params.filter(),
                filterKeys = Object.keys(filter);

                if(filterKeys.length){
                  url += '&filter=' + angular.toJson(filter);     
                }

            console.log(url);

            $http.get(url).success(function(data){
                params.total(data.total);
                data = data.data;//.slice((params.page() - 1) * params.count(), params.page() * params.count());
                $defer.resolve(data);
            }).error(
              function(a,b,c){
                console.log(a,b,c)
                alert('error')
              }
            );

        }
    });

  }]);;


  
