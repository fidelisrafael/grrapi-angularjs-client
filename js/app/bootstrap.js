'use strict';

var RASWebApp = angular.module('RASBWebApp', [
  'ngRoute',
  'RASBWebUsersControllers',
  'RASBWebServices'
]);

RASWebApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
    when('/confirm-account/:token', {
      templateUrl: "/views/confirm-account.html",
      controller: 'ConfirmAccountCtrl'
    }).
    when('/reset-password/:token', {
      templateUrl: "/views/update-password.html",
      controller: 'UpdatePasswordCtrl'
    })
  }
]);

RASWebApp.config(['$locationProvider',
  function($locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    })
  }
])