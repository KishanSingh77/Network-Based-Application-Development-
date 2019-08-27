/* @nanajjar */

var express = require('express');
var app = module.exports = express();

/* This controller handles general (root) request 
 *  this route definition resposnds by sending a text response
 */

/*
app.get('/', function (req, res) {
  res.send('This is the Student Information home page');
});
*/

//this is the home page route (root of the application)
app.get('/', function (request, response) {
    var path = process.cwd();

    console.log('request for home page');
    response.sendFile(path + '/views/index.html');
});