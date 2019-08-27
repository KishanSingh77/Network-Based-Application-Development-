/* @nanajjar */

var express = require("express");
var app = (module.exports = express());
let count = 0;

/* This controller handles general (root) request
 *  this route definition resposnds by sending a text response
 */

/*
app.get('/', function (req, res) {
  res.send('This is the Student Information home page');
});
*/

//this is the home page route (root of the application)
app.get("/", function(request, response) {
  var path = process.cwd();

  response.render("index", { count: 0 });
});

app.use((request, response, next) => {
  count = count + 1;
  module.exports = { count };
  next();
});

app.post("/", (request, response) => {
  if (count === undefined) count = 0;
  console.log("request for home page");
  console.log(count);
  response.render("index", { count: count });
});
