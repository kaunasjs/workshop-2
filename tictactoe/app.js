if (Meteor.isClient) {
  angular.module('tictactoe',['angular-meteor']);

  angular.module('tictactoe').controller('tictactoeCtrl', ['$scope',
    function ($scope) {

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