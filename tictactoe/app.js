Games = new Mongo.Collection("games");

Games.allow({
  insert: function (userId, game) {
    return userId && game.owner === userId;
  },
  update: function (userId, game) {
    return userId && game.owner === userId;
  },
  remove: function (userId, game) {
    return userId && game.owner === userId;
  }
});

if (Meteor.isClient) {
  angular.module('tictactoe',['angular-meteor', 'ui.router']);

  angular.module("tictactoe").run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireUser promise is rejected
      // and redirect the user back to the main page
      if (error === 'AUTH_REQUIRED') {
        $state.go('main');
      }
    });
  }]);


  angular.module('tictactoe').config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function($urlRouterProvider, $stateProvider, $locationProvider){

      $locationProvider.html5Mode(true);

      $stateProvider
          .state('main', {
            url: '/main',
            templateUrl: 'index.ng.html',
            controller: 'mainCtrl'
          })
          .state('game-list', {
            url: '/game-list/',
            templateUrl: 'party-details.ng.html',
            controller: 'gameListCtrl',
            resolve: {
              "currentUser": ["$meteor", function($meteor){
                return $meteor.requireUser();
              }]
            }
          })
          .state('game', {
            url: '/game/:gameId',
            templateUrl: 'game.ng.html',
            controller: 'tictactoeCtrl',
            resolve: {
              "currentUser": ["$meteor", function($meteor){
                return $meteor.requireUser();
              }]
            }
          });

      $urlRouterProvider.otherwise("/main");
    }]);

  angular.module('tictactoe').controller('gameListCtrl', ['$scope',
    function ($scope) {

    }]);

  angular.module('tictactoe').controller('mainCtrl', ['$scope',
    function ($scope) {

    }]);

  angular.module('tictactoe').controller('tictactoeCtrl', ['$scope', '$stateParams', '$meteor', '$rootScope',
    function ($scope, $stateParams, $meteor, $rootScope) {

      $scope.games = $meteor.collection(Games);

      function Game(size, winRow){
        this.size = size;
        this.winRow = winRow;
        this.endMessage = false;
        this.fields = [];
        this.currentPlayer = "X";
        this.owner = $rootScope.currentUser._id;
      };

      Game.prototype.init = function(){
        for(var i = 0; i < this.size*this.size; i++){
          this.fields[i] = {"player":" "};
        }
      };

      $scope.init = function(){
       if($stateParams.gameId > -1){
          $scope.game = $scope.games[$stateParams.gameId];
          $scope.currentGameNumber = $stateParams.gameId;
        }else{
          $scope.game =  new Game(3,3);
          $scope.game.init();
          $scope.currentGameNumber = $scope.games.length;
          $scope.games.save($scope.game);
        }
      };

      $scope.occupieField = function(field){
        if(field.player !== ' ') return true;
        field.player = $scope.game.currentPlayer;
        _checkIfWinnerExist();

        $scope.game.currentPlayer = ("X" == $scope.game.currentPlayer) ? "O" : "X";
        if(_countEmptyPlace() === 0) $scope.game.endMessage = 'There is no winners its a draw.';
        $scope.games[$scope.currentGameNumber] = $scope.game;
      };

      var _countEmptyPlace = function (){
        return $scope.game.fields.filter(function(value){
          return value.player === ' ';
        }).length;
      };

      var _printWinner = function(){
        $scope.game.endMessage = 'Congratulations winner is player ' + $scope.game.currentPlayer + '.';
      };

      var _checkIfWinnerExist = function _checkIfWinnerExist(){
        for (var i =0; i <3; i++){
          if( $scope.game.fields[0+i*3].player == $scope.game.fields[1+i*3].player && $scope.game.fields[1+i*3].player == $scope.game.fields[2+i*3].player && $scope.game.fields[0+i*3].player != " " ) _printWinner();
          if( $scope.game.fields[0+i].player == $scope.game.fields[3+i].player && $scope.game.fields[3+i].player ==  $scope.game.fields[6+i].player && $scope.game.fields[0+i].player!= " ") _printWinner();
        }

        if($scope.game.fields[0].player == $scope.game.fields[4].player && $scope.game.fields[4].player  ==  $scope.game.fields[8].player && $scope.game.fields[4].player!= " ") _printWinner();
        if($scope.game.fields[2].player == $scope.game.fields[4].player && $scope.game.fields[4].player  ==  $scope.game.fields[6].player && $scope.game.fields[4].player!= " ") _printWinner();
        };

    }]);
}