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
            
                //clear all the markers on the mapp
                    for(var i = 0; i < $scope.mapMarkers.length; i++){
                        $scope.mapMarkers[i].setMap(null);
                    }
                    $scope.mapMarkers.length = 0;
            
                //clear all the running path line on the map
                    if(runningPath != null){
                        runningPath.setMap(null);
                    }
                    runningPath = new google.maps.Polyline(polyOptions);
                    path = runningPath.getPath();
                    startDrawRunningPath();
                }
                else{
                    //$scope.$broadcast('timer-stopped', $scope.timer);
                    $scope.timerString = "00:00:00";
                    $timeout.cancel(mytimeout);
                    $rootScope.tabsInvisible = false;
                    $scope.buttonCaption = "Start Workout";
            
                    stopDrawRunningPath();
                    $scope.mapMarkers.push(new google.maps.Marker({ map: $scope.model.runningMap, position: latLng }));
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

            
//Display Google map
            var latitude = 31;
            var longitude = 121;
            var LatLng = null;
            $scope.model = { runningMap: undefined };
            $scope.mapMarkers = [];
            $scope.mapOptions = {
                center: new google.maps.LatLng(latitude, longitude),
                zoom: 17,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            
            var getGeolocation = function(onSuccess, onError){
                if(navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(onSuccess, onError);
                }
                else {
                    alert("Geolocation is not supported.");
                }
            };
            
            var setLatLngPosition = function(position){
                var lat = position.coords.latitude;
                var lng = position.coords.longitude;
                return new google.maps.LatLng(lat, lng);
            }
            
            var setStartLocation = function(position){
                longitude = position.coords.longitude;
                latitude = position.coords.latitude;
                latLng = setLatLngPosition(position);
                $scope.model.runningMap.setCenter(latLng);
                $scope.mapMarkers.push(new google.maps.Marker({ map: $scope.model.runningMap, position: latLng, animation: google.maps.Animation.DROP}));

                $scope.$apply();
            };
            
            var onGeolocationError = function(error){
                alert('code: ' + error.code + '\n' + 'message:' + error.message + '\n');
                $scope.$apply();
            };
            
            getGeolocation(setStartLocation, onGeolocationError);

//Draw the running path on map
            var watchLocationProcess = null;
            var routePoints = [];
            
            var polyOptions = {
                strokeColor: '#f0563d',
                strokeOpacity: 1.0,
                strokeWeight: 5
            };
            var runningPath = null;
            var path = null;
            
            var startDrawRunningPath = function(){
                getGeolocation(watchRunningPath, onGeolocationError);
            }
            
            var watchRunningPath = function(position){
                setStartLocation(position);
                latLng = setLatLngPosition(position);
                routePoints.push(latLng);
            
                $scope.model.runningMap.setCenter(latLng);
                path.push(latLng);
            
                if(watchLocationProcess == null){
                    runningPath.setMap($scope.model.runningMap);
                    watchLocationProcess = navigator.geolocation.watchPosition(drawRunningPath, onGeolocationError);
                }
            };
            
            var drawRunningPath = function(position){
                latLng = setLatLngPosition(position);
                routePoints.push(latLng);
            
                $scope.model.runningMap.setCenter(latLng);
                path.push(latLng);
            };
            
            var stopDrawRunningPath = function(){
                if(watchLocationProcess != null){
                    navigator.geolocation.clearWatch(watchLocationProcess);
                    watchLocationProcess = null;
                }
            };
            
})

.controller('WorkoutDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('SettingsCtrl', function($scope) {
});
