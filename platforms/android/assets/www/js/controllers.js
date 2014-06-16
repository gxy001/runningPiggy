angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('NewWorkoutCtrl', function($scope) {
  
})

.controller('WorkoutDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('SettingsCtrl', function($scope) {
});
