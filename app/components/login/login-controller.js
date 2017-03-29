'use strict';

angular.module('iMLApp.login.login-controller', [])

  .controller('LoginCtrl', ['$scope', function ($scope, $location, $state) {

    $scope.email = 'tami@pro.at';
    $scope.password = 'nerd';
    document.getElementById("menu_options").style.visibility = 'hidden';

    $scope.userLogin = function () {
      console.log("login");
      document.getElementById("menu_options").style.visibility = 'visible';
      window.location.href = "#/survey-overview";
    };

    $scope.userRegister = function () {
      console.log("register");
    };

/*      page.setPage("Login","login-layout");
      $scope.user = {};
      $scope.loginUser=function()
      {
          var username=$scope.user.name;
          var password=$scope.user.password;
          if(username=="admin" && password=="admin123")
          {
              page.setUser($scope.user);
              $location.path( "/home" );
          }
          else
          {
              $scope.message="Error";
              $scope.messagecolor="alert alert-danger";
          }
      }*/


  }]);