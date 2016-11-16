'use strict';

var appServices = angular.module('RASBWebServices', ['ngResource']);

appServices.service('AppConfig', function() {
  this._requestHosts = {
    'dev': 'localhost:8080/api',
    'staging': 'api-staging.myawesomeapi.com',
    'production': 'api.myawesomeapi.com',
  }

  this.getCurrentEnvironment = function(currentHost) {
    var isDev       = !!currentHost.match(/localhost/),
        isStaging   = !!currentHost.match(/staging/),
        isProd      = !isDev && !isStaging,
        currentEnv  = isDev ? 'dev' : (isStaging ? 'staging' : 'production');

    return currentEnv;
  }

  this.getAPIHost = function(currentHost) {
    var env = this.getCurrentEnvironment(currentHost);
    return this._requestHosts[env];
  }

  this.getAPIEndpoint = function(currentHost, path, version) {
    var scheme = 'http://'; // implement as argument?

    if(!version) { version = 'v1'; }
    var apiHost = this.getAPIHost(currentHost);

    return (scheme + apiHost + '/' + version + '/' + path);
  }

  this.getAccountConfirmationResponse = function(status, data){
    var responses = {
      yet_activated: function(data){
        return {
          title: 'Your account was already confirmated!',
          message: 'You can login any time you want'
        }
      },
      not_found: function(data){
        return {
          title: 'Invalid or not found Token!',
          message: 'This token is not valid. Try again.'
        }
      },
      bad_request: function(data){
        return {
          title: 'Bad Request',
          message: 'Sorry, something went wrong.! Please, try again in a few minutes.'
        }
      },
      success: function(data) {
        return {
          title: "Your account was successfully confirmated!",
          message: 'Awesome ' + data.user_name + '! Now you can login any time you want.'
        }
      }
    };

    return responses[status].call(this, data);
  }

  this.getUpdatePasswordResponse = function(status, data){
    var responses = {
      not_found: function(data){
        return {
          title: 'Invalid or not found Token!',
          message: 'This token is not valid. Try again.'
        }
      },
      bad_request: function(data){
        return {
          title: 'Bad Request',
          message: 'Sorry, something went wrong.! Please, try again in a few minutes.'
        }
      },
      unprocessable_entity: function(data){
        return {
          title: 'Invalid Request',
          message: data.errors[0]
        }
      },
      success: function(data) {
        return {
          title: "Your password was successfully reseted!",
          message: 'Awesome ' + data.user_name + '! Now you can login any time you want.'
        }
      }
    };

    return responses[status].call(this, data);
  }
});
