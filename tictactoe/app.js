if (Meteor.isClient) {
  angular.module('tictactoe',['angular-meteor', 'ui.router']);

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
            controller: 'gameListCtrl'
          })
          .state('game', {
            url: '/game/:gameId',
            templateUrl: 'game.ng.html',
            controller: 'tictactoeCtrl'
          });

      $urlRouterProvider.otherwise("/main");
    }]);

  angular.module('tictactoe').controller('gameListCtrl', ['$scope',
    function ($scope) {

    }]);

  angular.module('tictactoe').controller('mainCtrl', ['$scope',
    function ($scope) {

    }]);

  angular.module('tictactoe').controller('tictactoeCtrl', ['$scope', '$stateParams',
    function ($scope, $stateParams) {

      $scope.gameId = $stateParams.gameId;

      $scope.endMessage = false;
      $scope.fields = [];
      $scope.currentPlayer = "X";

      $scope.init = function(){
        for(var i = 0; i < 9; i++){
          $scope.fields[i] = {"player":" "};
        }
        $scope.endMessage = false;
      };

      $scope.init();

      $scope.occupieField = function(field){
        if(field.player !== ' ') return true;
        field.player = $scope.currentPlayer;
        _checkIfWinnerExist();

        $scope.currentPlayer = ("X" == $scope.currentPlayer) ? "O" : "X";
        if(_countEmptyPlace() === 0) $scope.endMessage = 'There is no winners its a draw.';
      };

      var _countEmptyPlace = function (){
        return $scope.fields.filter(function(value){
          return value.player === ' ';
        }).length;
      };

      var _printWinner = function(){
        $scope.endMessage = 'Congratulations winner is player ' + $scope.currentPlayer + '.';
      };

      var _checkIfWinnerExist = function _checkIfWinnerExist(){
        for (var i =0; i <3; i++){
          if( $scope.fields[0+i*3].player == $scope.fields[1+i*3].player && $scope.fields[1+i*3].player == $scope.fields[2+i*3].player && $scope.fields[0+i*3].player != " " ) _printWinner();
          if( $scope.fields[0+i].player == $scope.fields[3+i].player && $scope.fields[3+i].player ==  $scope.fields[6+i].player && $scope.fields[0+i].player!= " ") _printWinner();
        }

        if($scope.fields[0].player == $scope.fields[4].player && $scope.fields[4].player  ==  $scope.fields[8].player && $scope.fields[4].player!= " ") _printWinner();
        if($scope.fields[2].player == $scope.fields[4].player && $scope.fields[4].player  ==  $scope.fields[6].player && $scope.fields[4].player!= " ") _printWinner();
        };

    }]);
}