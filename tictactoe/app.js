Games = new Mongo.Collection("games");

Games.allow({
  insert: function (userId, game) {
    return userId && (game.owner === userId || game.concurent === userId || !game.concurent);
  },
  update: function (userId, game) {
    return userId && (game.owner === userId || game.concurent === userId || !game.concurent);
  },
  remove: function (userId, game) {
    return userId && (game.owner === userId || game.concurent === userId || !game.concurent);
  }
});

if (Meteor.isClient) {
  angular.module('tictactoe',['angular-meteor', 'ui.router']);

  angular.module("tictactoe").run(['$rootScope', '$state', function($rootScope, $state) {
    $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
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

  angular.module('tictactoe').controller('mainCtrl', ['$scope', '$meteor',
    function ($scope, $meteor) {
      $scope.gameList = $meteor.collection(Games);
    }]);

  angular.module('tictactoe').controller('tictactoeCtrl', ['$scope', '$stateParams', '$meteor', '$rootScope',
    function ($scope, $stateParams, $meteor, $rootScope) {

      $scope.games = $meteor.collection(Games);
      $scope.started = false;

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

      if($stateParams.gameId && $scope.games[$stateParams.gameId]){
        $scope.init();
      };

      $scope.restart = function(){
        $scope.started = false;
        $scope.game.endMessage = '';
        $scope.game = null;
        $scope.fields = [];
        $scope.games[$scope.currentGameNumber] = $scope.game;
      };

      $scope.init = function(size, lineSize, newGame){
        $scope.started = true;
        if($stateParams.gameId > -1 && $scope.games[$stateParams.gameId]){
          $scope.gameId = $stateParams.gameId;
          $scope.game = $scope.games[$stateParams.gameId];
          $scope.currentGameNumber = $stateParams.gameId;
          $scope.size = $scope.game.size;
          $scope.lineSize = $scope.game.winRow;
          if($rootScope.currentUser._id != $scope.game.owner && !$scope.game.concurent){
            $scope.game.concurent = $rootScope.currentUser._id;
            $scope.games[$scope.currentGameNumber] = $scope.game;
          }
        }else if(newGame){
          $scope.size = size;
          $scope.lineSize = lineSize;
          $scope.game =  new Game(size,lineSize);
          $scope.game.init();
          $scope.currentGameNumber = $scope.games.length;
          $scope.games.save($scope.game);
        }
        var cellSize = 100 / ($scope.size + 1);
        $scope.gridSize = $scope.size * $scope.size;
        $scope.gridStyle={"width": cellSize + "%", "height": cellSize + "%"};
      };

      $scope.occupieField = function(field){
        if(field.player !== ' ') return true;
        field.player = $scope.game.currentPlayer;
        _checkIfWinnerExist();

        $scope.game.currentPlayer = ("X" == $scope.game.currentPlayer) ? "O" : "X";
        if(_countEmptyPlace() === 0) $scope.game.endMessage = 'There is no winners its a draw';
        $scope.games[$scope.currentGameNumber] = $scope.game;
      };

      var _countEmptyPlace = function (){
        return $scope.game.fields.filter(function(value){
          return value.player === ' ';
        }).length;
      };

      var _printWinner = function(){
        $scope.game.endMessage = 'Congratulations winner is player ' + $scope.game.currentPlayer;
      };

      var _checkHorizontal = function _checkHorizontal(start, length){
        if(length === $scope.lineSize) {
          _printWinner();
        }
        else if((start + 1) % $scope.size === 0) return
        else if($scope.game.fields[start].player === $scope.game.fields[start+1].player
            && $scope.game.fields[start].player !== ' ') {
          _checkHorizontal(start + 1, length + 1);
        }
        else return
      };

      var _checkVertical = function _checkVertical(start, length){
        if(length === $scope.lineSize) {
          _printWinner();
        }
        else if($scope.game.fields[start].player === $scope.game.fields[start+$scope.size].player
            && $scope.game.fields[start].player !== ' ') {
          _checkVertical(start + $scope.size, length + 1);
        }
        else return
      };

      var _checkDiagonal = function _checkDiagonal(start, length){
        var diagonal = start+$scope.size+1;
        if(length === $scope.lineSize) {
          _printWinner();
        }
        else if((start + 1) % $scope.size === 0) return
        else if($scope.game.fields[start].player === $scope.game.fields[diagonal].player
            && $scope.game.fields[start].player !== ' ') {
          _checkDiagonal(diagonal, length + 1);
        }
        else return
      };

      var _checkReverseDiagonal = function _checkReverseDiagonal(start, length){
        var diagonal = start+$scope.size-1;
        if(length === $scope.lineSize) {
          _printWinner();
        }
        else if((start + 1) % $scope.size === 1) return
        else if($scope.game.fields[start].player === $scope.game.fields[diagonal].player
            && $scope.game.fields[start].player !== ' ') {
          _checkReverseDiagonal(diagonal, length + 1);
        }
        else return
      };

      var _checkIfWinnerExist = function _checkIfWinnerExist(){
        for (var i = 0; i < $scope.gridSize; i++) {
          _checkHorizontal(i, 1);
        }

        var verticalSize = ($scope.size - $scope.lineSize + 1) * $scope.size;

        for (var i = 0; i < verticalSize; i++) {
          _checkVertical(i, 1);
          _checkDiagonal(i, 1);
          _checkReverseDiagonal(i, 1);
        }
      };


    }]);
}