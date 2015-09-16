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
  angular.module('socially',['angular-meteor']);
}
```

```html
index.ng.html

<p>1 + 2 = {{ 1 + 2 }}</p>
```

### Tictactoe and angular basics
  - two-way binding
  - ng repeat
  - ng click 
  - ng show
  - private/public functions in controller

### Meteor basics
  - Client, Server, Cordova file
  - Meteor collection in angular
  - Connecting to mongo (just demonstration)

### Angular advanced
  - Routing ? (only simple 3 ruotes)
  
###Deploying app
on web
on mobile  

### Adding user and security (some native blaziness :) ) 
meteor remove insecure 
meteor add accounts-password 
meteor add accounts-ui 
meteor add urigo:angular-blaze-template 
meteor add accounts-facebook
meteor add accounts-twitter

authorization on ruotes  
  
### Creating simple 2 players tictactoe
  
###Custom publish subscribe