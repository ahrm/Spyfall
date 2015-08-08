(function(){
    function randomInt(max){
        return Math.floor(Math.random() * max);
    }
    
    Array.prototype.pickRandom = function(){
        return this.valueOf()[randomInt(this.length)];
    }
    
    Array.prototype.shuffle = function(){
        var thisArray = this.valueOf().slice();
        var newArray = [];
        while(thisArray.length > 0){
            var newIndex = randomInt(thisArray.length);
            //console.log(newIndex);
            var popped = thisArray[newIndex];
            thisArray.splice(newIndex,1);
            newArray.push(popped);
        }
        return newArray;
    }

})();


angular.module('starter.controllers', ['ionic'])

.factory('PlaceFactory', function($http){
    var getUrl = '../json/places.json';
    if (ionic.Platform.isAndroid()){
        getUrl = '/android_asset/www/json/places.json';
    }
    return $http.get(getUrl).then(function(res){
        for (var i = 0; i < res.data.length; i++)
        {
            var oldName = res.data[i].name;
            var newName = oldName.split('.')[1];
            var oldRoles = res.data[i].roles;
            var newRoles = [];
            for (var j = 0; j < oldRoles.length; j++){
                var oldRoleName = oldRoles[j];
                var parts = oldRoleName.split('.');
                var newRoleName = parts[parts.length-1];
                newRoles.push({name: newRoleName});
            }
            
            res.data[i].name = newName;
            res.data[i].roles = newRoles;
        }
        
        return res.data;

    })
})

.controller('SpyfallCtrl', function($scope,$rootScope, $ionicModal , PlaceFactory){
    $ionicModal.fromTemplateUrl('view-role-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal){
        $scope.modal = modal;
    });
    
    $scope.newPlayer = {};
    $scope.enteredPassword = null;
    
    $ionicModal.fromTemplateUrl('view-places-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal){
        $scope.placesModal = modal;
    });
    
    $ionicModal.fromTemplateUrl('add-player-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal){
        $scope.addPlayerModal = modal;
    });
    
    $scope.closeViewRoleModal = function(){
        $scope.modal.hide();
    }
    
    $scope.$on('modal.hidden', function(){
        $rootScope.enteredPassword = null;
    });
    
    
    $scope.players = [];
    $scope.addPlayer = function(playerName, playerPassword){
        $scope.players.push({name: playerName, password: playerPassword});
        $scope.newPlayer.name = null;
        $scope.newPlayer.password = null;
        $scope.addPlayerModal.hide();
    }
    
    $scope.showAddPlayerModal = function(){
        $scope.addPlayerModal.show();
    }
    
    $scope.showPlayerRole = function(player){
        $scope.currentSelectedPlayer = player;
        $scope.modal.show();
    }
    
    $scope.closeModal = function(){
        $scope.modal.hide();
    }
    
    $scope.removePlayer = function(player){
        var playerIndex = $scope.players.indexOf(player);
        $scope.players.splice(playerIndex,1);
    }
    
    $scope.showPlacesModal = function(){
        $scope.placesModal.show();
    }
    
    $scope.assignPlayerRoles = function(){
        var newPlace = $scope.allPlaces.pickRandom();
        $scope.currentPlace = newPlace;
        var newSpy = $scope.players.pickRandom();
        var roles = newPlace.roles.shuffle();
        for (var i = 0;i < $scope.players.length; i++){
            var currentPlayer = $scope.players[i];
            if (currentPlayer == newSpy){
                currentPlayer.role = {name: 'spy'};
            }
            else{
                currentPlayer.role = {name: roles[i].name, place: newPlace.name};
            }
        }
    }
    
    PlaceFactory.then(function(data){
        $scope.allPlaces = data;
    });
})

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
