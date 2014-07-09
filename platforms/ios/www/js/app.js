// Ionic Starter App
var loginCallback = function(response, $rootScope, $location){
    if (response.status === 'connected') {
            FB.api('/me', function(response){
                $rootScope.$apply(function(){
                    $rootScope.user = response;
                });
            });
        
            FB.api('/me/picture',
            function(response){
                if(response && !response.error){
                   $rootScope.pictureUrl = response.data.url;
                }
                else{
                    $rootScope.pictureUrl = response.error;
                }
            });
        
            $rootScope.showHeader = true;
            $location.url('/tab/dash');
        }
        else {
            $location.url('/login');
        }
    };

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ui.map'])

.run(['$ionicPlatform', '$rootScope', '$window', '$location',
    function($ionicPlatform, $rootScope, $window, $location) {
        //Facebook login
    $rootScope.user = {};
    $window.fbAsyncInit = function(){
        FB.init({
            appId: '760732033979791',
            //nativeInterface: CDV.FB,
            channelUrl: 'template/channel.html',
            status: true,
            cookie: true,
            xfbml: true
        });
      
/*        FB.getLoginStatus(function(response) {
            loginCallback(response, $rootScope, $location);
        },
        {scope: 'public_profile,email'}
        );*/
      
      
                facebookConnectPlugin.getLoginStatus(function(response){
                    loginCallback(response, $rootScope, $location);
                    },
                    function (response) { alert(JSON.stringify(response)) });
    };
        
    //boileplate code to load the Facebook JavaScript SDK
    (function(d){
        var js,
        id = 'facebook-jssdk',
        ref = d.getElementsByTagName('script')[0];
         
        if (d.getElementById(id)){
            return;
        }
         
        js = d.createElement('script');
        js.id = id;
        js.async = true;
        js.src = "http://connect.facebook.net/en_US/all.js";
     
        ref.parentNode.insertBefore(js, ref);
    }(document));
    
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    $rootScope.showHeader = false;
    $rootScope.tabsInvisible = false;
  });
}])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.new-workout', {
      url: '/new-workout',
      views: {
        'tab-new-workout': {
          templateUrl: 'templates/tab-new-workout.html',
          controller: 'NewWorkoutCtrl'
        }
      }
    })
    .state('tab.workout-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-workout-detail': {
          templateUrl: 'templates/workout-detail.html',
          controller: 'WorkoutDetailCtrl'
        }
      }
    })

    .state('tab.settings', {
      url: '/settings',
      views: {
        'tab-settings': {
          templateUrl: 'templates/tab-settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })
      
     .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
     })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});

