
var app = angular.module('acousticLevel', []);

app.config(['$compileProvider',
		 function($compileProvider) {   
		     $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob|file):/);
		 }]);
