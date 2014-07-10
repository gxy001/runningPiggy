angular.module('starter.services', [])

.factory('Workout', function(){
    this.workouts = [];
    this.users = [];
    
    this.setUser = function(userId, distance){
        for(var i = 0; i < this.users.length; i++){
            if(this.users[i].userId === userId){
                this.users[i].totalDistance = parseFloat(this.users[i].totalDistance) + parseFloat(distance);
                this.users[i].totalWorkout ++;
                return;
            }
        }
        
        var user = {
            userId: userId,
            totalDistance: parseFloat(distance),
            totalWorkout: 1
        };
        
        this.users.push(user);
    };
    
    this.setWorkout = function(userId, distance, time, route){
        var workout = {
            userId: userId,
            distance: parseFloat(distance),
            time: time,
            route: route
        };

        this.workouts.push(workout);
    };
    
    this.getUser = function(userId){
        for(var i = 0; i < this.users.length; i++){
            if(this.users[i].userId === userId){
                return this.users[i];
            }
        }
        return null;
    }
    
    this.getWorkouts = function(userId){
        var workoutPerUser = [];
        for(var i = 0; i < this.workouts.length; i++){
            if(this.workouts[i].userId === userId){
                workoutPerUser.push(this.workouts[i]);
            }
        }
        
        return workoutPerUser;
    }
    
    return this;
})

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

.service('fbAuth', function($location, $rootScope){

    var watchAuthStatusChange = function(){
        var _self = this;
    
        FB.Event.subscribe('auth.authStatusChange', function(response){
            if(response.status === 'connected'){
                _self.getUserInfo();
            }
            else{
                $location.url('/login');
            }
        });
    };
    
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
