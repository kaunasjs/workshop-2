##Second KaunasJs workshop focused on meteor and angular features and itegration (Working unfished drafts for insights only)

### Initializing app

First you need to install meteor which you can do by going  https://www.meteor.com/install.

Then you should type following commands in you command line.

```sh 
meteor create tictactoe
cd tictactoe
meteor
```
This should create simple meteor application.

=======
### Adding angular to current application

*Delete all file inside that directory* (excluding .meteor folder)

Afterwards type in  command line
```sh 
meteor add angular
```

Then create index.ng.html app.js and index.html file under tictactoe folder, their contents

```html
index.html

<body ng-app="tictactoe">
  <div ng-include="'index.ng.html'"></div>
</body>
```

<div ng-include="'client/index.ng.html'"></div>

```js
app.js

if (Meteor.isClient) {
  angular.module('tictactoe',['angular-meteor']);
}
```

```html
index.ng.html

<p>1 + 2 = {{ 1 + 2 }}</p>
```

### Tictactoe and angular basics 
(much codding happens here)
  - two-way binding
  - ng repeat
  - ng click 
  - ng show
  - private/public functions in controller

###Deploying app
on web
```ssh
meteor deploy my_app_name.meteor.com
```

on mobile
Angular needs the main document to be ready so it can bootstrap, but different devices have different events for ready.

To solve this, we need to change the way we bootstrap our Angular app. Remove the current bootstrap by removing ng-app from the <body> tag:
```js
function onReady() {
    angular.bootstrap(document, ['simple-todos']);
  }
 
  if (Meteor.isCordova)
    angular.element(document).on('deviceready', onReady);
  else
    angular.element(document).ready(onReady);
```

Android Emulator
 - meteor install-sdk android
 - meteor add-platform android
 - meteor run android

Android device
 - Enable usb debugging on android device
 - Turn off android emulator
 - meteor run android-device
 - meteor run android-device --mobile-server my_app_name.meteor.com

IOS device
  - Get apple developer account
  - meteor run ios-device
  - meteor run ios-device --mobile-server my_app_name.meteor.com
  - 
  

**(Coffee break)**
=======

Add ruoter package via meteor pm.

```sh
meteor add angularui:angular-ui-router
```

### Angular ruoting

Add base tag to index html (required by html5, and ui ruoter)

```html
<head>
  <base href="/">
</head>
```

```js
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
```

Create needed controllers and template file.
Test state params.  

### Meteor basics
  - Meteor collection
in order to add meteor collection add following lanes
```js

Games = new Mongo.Collection("games");


angular.module('tictactoe').controller('tictactoeCtrl', ['$scope', '$stateParams', '$meteor',
    function ($scope, $stateParams, $meteor) {
    
    //random place from code
    $scope.games = $meteor.collection(Games);
    
    //random place from code
    $scope.games.save($scope.game);
```
  - Connecting to mongo (just demonstration)

### Adding user and security (some native blaziness :) )   

```sh
meteor remove insecure   
meteor add accounts-password
meteor add accounts-ui
meteor add urigo:angular-blaze-template
meteor add accounts-*
```  
where * can be:  
  - Facebook
  - Github
  - Google
  - Meetup
  - Twitter
  - Weibo
  - Meteor developer account


  
### Creating simple 2 players tictactoe
  
###Custom publish subscribe
