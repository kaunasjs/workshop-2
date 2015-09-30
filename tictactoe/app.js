if (Meteor.isClient) {
  angular.module('tictactoe',['angular-meteor']);

  angular.module('tictactoe').controller('tictactoeCtrl', ['$scope',
    function ($scope) {

      $scope.size = 3;
      $scope.winningLine = 3;
      var cellSize = 100 / ($scope.size + 1);
      $scope.gridSize = $scope.size * $scope.size;
      $scope.gridStyle={"width": cellSize + "%", "height": cellSize + "%"};

      $scope.fields = [];
      $scope.currentPlayer = "X";

      $scope.init = function(){
        for(var i = 0; i < $scope.gridSize; i++){
          $scope.fields[i] = {"player":" "};
        }
        $scope.endMessage = false;
      };

      $scope.init();

      $scope.occupieField = function(field){
        if (field.player != ' ') return;
        field.player = $scope.currentPlayer;
        _checkIfWinnerExist();
        $scope.currentPlayer = ("X" == $scope.currentPlayer) ? "O" : "X";
        if(_countEmptyPlace() == 0 )  $scope.endMessage = 'There is no winner it is a draw ';
      };

      var _printWinner = function(){
        $scope.winnerIs = $scope.currentPlayer;
      };

      var _countEmptyPlace = function (){
        return $scope.fields.filter(function(value){
          return value.player === ' ';
        }).length;
      };

      var _printWinner = function(){
        $scope.endMessage = 'Congratulations winner is player ' + $scope.currentPlayer;
      };

      var _checkIfWinnerExist = function _checkIfWinnerExist(){
        for (var i = 0; i < $scope.gridSize; i++) {
          _checkHorizontal(i, 1);
        }

        var verticalSize = ($scope.size - $scope.winningLine + 1) * $scope.size;

        for (var i = 0; i < verticalSize; i++) {
          _checkVertical(i, 1);
          _checkDiagonal(i, 1);
          _checkReverseDiagonal(i, 1);
        }
      };

      var _checkHorizontal = function _checkHorizontal(start, length){
        if(length === $scope.winningLine) {
          _printWinner();
        }
        else if((start + 1) % $scope.size === 0) return
        else if($scope.fields[start].player === $scope.fields[start+1].player
            && $scope.fields[start].player !== ' ') {
          _checkHorizontal(start + 1, length + 1);
        }
        else return
      };

      var _checkVertical = function _checkVertical(start, length){
        if(length === $scope.winningLine) {
          _printWinner();
        }
        else if($scope.fields[start].player === $scope.fields[start+$scope.size].player
            && $scope.fields[start].player !== ' ') {
          _checkVertical(start + $scope.size, length + 1);
        }
        else return
      };

      var _checkDiagonal = function _checkDiagonal(start, length){
        var diagonal = start+$scope.size+1;
        if(length === $scope.winningLine) {
          _printWinner();
        }
        else if((start + 1) % $scope.size === 0) return
        else if($scope.fields[start].player === $scope.fields[diagonal].player
            && $scope.fields[start].player !== ' ') {
          _checkDiagonal(diagonal, length + 1);
        }
        else return
      };

      var _checkReverseDiagonal = function _checkReverseDiagonal(start, length){
        var diagonal = start+$scope.size-1;
        if(length === $scope.winningLine) {
          _printWinner();
        }
        else if((start + 1) % $scope.size === 1) return
        else if($scope.fields[start].player === $scope.fields[diagonal].player
            && $scope.fields[start].player !== ' ') {
          _checkReverseDiagonal(diagonal, length + 1);
        }
        else return
      };



    }]);
}