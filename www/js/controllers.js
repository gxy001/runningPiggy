angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('NewWorkoutCtrl', function($scope, $rootScope, $timeout) {
            $scope.hasStarted = false;
            $scope.buttonCaption = "Start Workout";
            $scope.timerString = "00:00:00";
            var zeroInt = 0;
            $scope.distance = zeroInt.toFixed(2);
            
            var startTime = Date.now();
            var mytimeout = null;
            
            $scope.updateButtonStatus = function (){
                if(!$scope.hasStarted){
                    startWorkOut();
                }
                else{
                    stopWorkOut();
                }
            };
            
            var stopWorkOut = function(){
            //reset timer and button
                $rootScope.tabsInvisible = false;
                $scope.buttonCaption = "Start Workout";
                $scope.hasStarted = false;
                isDrawingPath = false;
            
                $timeout.cancel(mytimeout);
            
            
            //stop drawing running path
                stopDrawRunningPath();
                $scope.mapMarkers.push(new google.maps.Marker({ map: $scope.model.runningMap, position: endLatLng }));
            };
            
            var onTimeout = function(){
                var currentTime = Date.now();
                var diffTime = currentTime - startTime;
                getTime(diffTime/1000);
                mytimeout = $timeout(onTimeout,1000);
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
            var startLatLng = null;
            var endLatLng = null;
            var isDrawingPath = false;
            var gpsErrorMsg = "Navigator encounters an error. Check GPS connection and try again.";
            
            $scope.model = { runningMap: undefined };
            $scope.mapMarkers = [];
            $scope.mapOptions = {
                center: new google.maps.LatLng(latitude, longitude),
                zoom: 17,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: false,
                streetViewControl: false
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
                endLatLng = setLatLngPosition(position);
                $scope.model.runningMap.setCenter(endLatLng);
                $scope.mapMarkers.push(new google.maps.Marker({ map: $scope.model.runningMap, position: endLatLng, animation: google.maps.Animation.DROP}));

              //  $scope.$apply();
            };
            
            var onGeolocationError = function(error){
                alert(gpsErrorMsg + '\n' + 'code: ' + error.code + '\n' + 'message:' + error.message + '\n');
                if(isDrawingPath){
                    stopWorkOut();
                }
               // $scope.$apply();
            };
            
            getGeolocation(setStartLocation, onGeolocationError);

//Draw the running path on map
            var watchLocationProcess = null;
            var routePoints = [];
            var realDistance = 0;
            
            var polyOptions = {
                strokeColor: '#f0563d',
                strokeOpacity: 1.0,
                strokeWeight: 5
            };
            var runningPath = null;
            var path = null;
            
            var startWorkOut = function(){
                getGeolocation(startRecordingRunningData, onGeolocationError);
            }
            
            var startRecordingRunningData = function(position){
                $scope.hasStarted = true;
                $rootScope.tabsInvisible = true;
                $scope.buttonCaption = "Stop Workout";
                $scope.distance = 0;
                realDistance = 0;
            
            //set timer
                $scope.timerString = "00:00:00";
                startTime = Date.now();
                mytimeout = $timeout(onTimeout, 1000);
            
            //clear all the markers on the mapp
                for(var i = 0; i < $scope.mapMarkers.length; i++){
                    $scope.mapMarkers[i].setMap(null);
                }
                $scope.mapMarkers.length = 0;
            
            //clear all the running path line on the map
                if(runningPath != null){
                    runningPath.setMap(null);
                }
            
            //start drawing running path
                runningPath = new google.maps.Polyline(polyOptions);
                path = runningPath.getPath();

                setStartLocation(position);
                startLatLng = setLatLngPosition(position);
                routePoints.push(startLatLng);
            
                $scope.model.runningMap.setCenter(startLatLng);
                path.push(startLatLng);
            
                if(watchLocationProcess == null){
                    runningPath.setMap($scope.model.runningMap);
                        watchLocationProcess = navigator.geolocation.watchPosition(drawAndComputeRunningPath, onGeolocationError);
                }
            };
            
            var drawAndComputeRunningPath = function(position){
                isDrawingPath = true;
                endLatLng = setLatLngPosition(position);
                routePoints.push(endLatLng);
            
                $scope.model.runningMap.setCenter(endLatLng);
                path.push(endLatLng);
            
                realDistance += google.maps.geometry.spherical.computeDistanceBetween(startLatLng, endLatLng)/1000;
                $scope.distance = realDistance.toFixed(2);
                startLatLng = endLatLng;
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
