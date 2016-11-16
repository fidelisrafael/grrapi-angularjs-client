'use strict';

var appControllers = angular.module('RASBWebUsersControllers', []);

appControllers
.controller('ConfirmAccountCtrl', function($scope, $routeParams, $http, AppConfig) {
  $scope.confirmAccountToken = $routeParams.token;
  $scope.validToken = !!$scope.confirmAccountToken;

  var getResponse = AppConfig.getAccountConfirmationResponse;

  if($scope.validToken) {
    var _h = document.location.host,
        _t = $scope.confirmAccountToken,
        apiEndpointURL = AppConfig. getAPIEndpoint(_h, ('users/activate_account/' + _t));

    $http.post(apiEndpointURL).success(function(data, status, header, config) {
      $scope.responseFeedback = getResponse('success', data)
    }).error(function(data, status, header, config) {
      var _status = 'bad_request';

      if(!!data) {
        _status = (status == 400 ? 'bad_request' :
                   (!!data.yet_activated ?
                      'yet_activated' :
                      'not_found'
                   )
                 );
      }

      $scope.responseFeedback = getResponse(_status, data)
    });
  } else {
    $scope.responseFeedback = getResponse('bad_request', data)
  }
})

.controller('UpdatePasswordCtrl', function($scope, $routeParams, $http, AppConfig) {
  $scope.passwordUpdateToken = $routeParams.token;
  $scope.validToken = !!$scope.passwordUpdateToken;
  $scope.updateStatus = null;
  $scope.hidePassForm = false;

  // TODO: Implement common function for UpdatePassword & ConfirmAccountCtrl
  $scope.updatePassword = function(password, password_confirmation) {
    var getResponse = AppConfig.getUpdatePasswordResponse;

    var _h = document.location.host,
        _t = $scope.passwordUpdateToken,
        _data = jQuery.param({ password: password, password_confirmation: password_confirmation }),
        apiEndpointURL = AppConfig.getAPIEndpoint(_h, 'users/password_reset/' + _t + '?' + _data);

    $http.put(apiEndpointURL).success(function(data, status, header, config) {
      $scope.updateStatus = 'success';
      $scope.responseFeedback = getResponse('success', data);
      $scope.hidePassForm = true;

    }).error(function(data, status, header, config) {
      var s = status == 422 ? 'unprocessable_entity' : (status == 400 ? 'bad_request' : 'not_found');

      $scope.updateStatus = s;
      $scope.responseFeedback = getResponse(s, data);
      $scope.hidePassForm = s == 'not_found';
    });
  }
});
