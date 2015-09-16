if (Meteor.isClient) {
  angular.module('tictactoe',['angular-meteor']);

  angular.module('tictactoe').controller('tictactoeCtrl', ['$scope',
    function ($scope) {

      $scope.winnerIs = false;
      $scope.fields = [];
      $scope.currentPlayer = "X";

      $scope.init = function(){
        for(var i = 0; i < 9; i++){
          $scope.fields[i] = {"player":"none"};
        }
        $scope.winnerIs = false;
      };

      $scope.init();

      $scope.occupieField = function(field){
       field.player = $scope.currentPlayer;

        _checkIfWinnerExist();
        $scope.currentPlayer = ("X" == $scope.currentPlayer) ? "O" : "X";
      };

      var _printWinner = function(){
        $scope.winnerIs = $scope.currentPlayer;
      };

      var _checkIfWinnerExist = function _checkIfWinnerExist(){
        for (var i =0; i <3; i++){
          if( $scope.fields[0+i*3].player == $scope.fields[1+i*3].player && $scope.fields[1+i*3].player ==  $scope.fields[2+i*3].player && $scope.fields[0+i*3].player != "none" ) _printWinner();
          if( $scope.fields[0+i].player == $scope.fields[1+i].player && $scope.fields[1+i].player ==  $scope.fields[2+i].player && $scope.fields[0+i].player!= "none") _printWinner();
        }

        if($scope.fields[0].player == $scope.fields[4].player && $scope.fields[4].player  ==  $scope.fields[8].player && $scope.fields[4].player!= "none") _printWinner();
        if($scope.fields[2].player == $scope.fields[4].player && $scope.fields[4].player  ==  $scope.fields[6].player && $scope.fields[4].player!= "none") _printWinner();
        };

    }]);
}