angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})
.factory('fbAuth', function(){
    var _self = this;
    
    FB.Event.subscribe('auth.authResponseChange', function(response){
        if(response.status === 'connected'){
            _self.getUserInfo();
        }
        else{
            
        }
    });
    
    var getUserInfo = function(){
        var _self = this;
        FB.api('/me', function(response){
            $rootScope.$apply(function(){
                $rootScope.user = _self.user = response;
            });
        });
    };
    
    var logout = function(){
        var _self = this;
        FB.logout(function(response){
            $rootScope.$apply(function(){
                $rootScope.user = _self.user = {};
            });
        });
    };
});
