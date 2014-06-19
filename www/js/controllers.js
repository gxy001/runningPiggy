angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('NewWorkoutCtrl', function($scope, $rootScope, $timeout) {
//Set timer
            $scope.hasStarted = false;
            $scope.buttonCaption = "Start Workout";
            $scope.timerString = "00:00:00";
            
            var startTime = Date.now();
            var mytimeout = null;
            
            $scope.updateButtonStatus = function (){
                $scope.hasStarted = !$scope.hasStarted;
                if($scope.hasStarted){
                    startTime = Date.now();
                    mytimeout = $timeout($scope.onTimeout, 1000);
                    $rootScope.tabsInvisible = true;
                    $scope.buttonCaption = "Stop Workout";
                }
                else{
                    //$scope.$broadcast('timer-stopped', $scope.timer);
                    $scope.timerString = "00:00:00";
                    $timeout.cancel(mytimeout);
                    $rootScope.tabsInvisible = false;
                    $scope.buttonCaption = "Start Workout";
                }
            };
            
            $scope.onTimeout = function(){
                var currentTime = Date.now();
                var diffTime = currentTime - startTime;
                getTime(diffTime/1000);
                mytimeout = $timeout($scope.onTimeout,1000);
            };
            
            var getTime = function(t){
                t = Math.floor(t);
                var hh = Math.floor(t / 60 / 60);
                var MM = Math.floor(t / 60) - hh * 60;
                var ss = t - hh * 60 * 60 - MM * 60;
                setTimeString(hh, MM, ss);
            };
            
            var setTimeString = function(hh, MM, ss){
                var hhString = hh;
                var MMString = MM;
                var ssString = ss;
                if(hh<10){
                    hhString = "0" + hh;
                }
                if(MM<10){
                    MMString = "0" + MM;
                }
                if(ss<10){
                    ssString = "0" + ss;
                }
                $scope.timerString = hhString + ":" + MMString + ":" + ssString;
            };

            
//Google map operation
            var latitude = 31;
            var longitude = 121;
            $scope.model = { runningMap: undefined };
            $scope.mapMarkers = [];
            $scope.mapOptions = {
                center: new google.maps.LatLng(latitude, longitude),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            
            var getGeolocation = function(){
                if(navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(onSuccess, onError);
                }
                else {
                    alert("Geolocation is not supported.");
                }
            };
            
            var onSuccess = function(position){
                longitude = position.coords.longitude;
                latitude = position.coords.latitude;
                var latlng = new google.maps.LatLng(latitude, longitude);
                $scope.model.runningMap.setCenter(latlng);
                $scope.mapMarkers.push(new google.maps.Marker({ map: $scope.model.runningMap, position: latlng }));

                $scope.$apply();
            };
            
            var onError = function(error){
                alert('code: ' + error.code + '\n' + 'message:' + error.message + '\n');
                $scope.$apply();
            };
            
            getGeolocation();
})

.controller('WorkoutDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('SettingsCtrl', function($scope) {
});
