/* @nanajjar */

//setup express to use for routing
var express = require("express");
var app = express();
const { check, validationResult } = require("express-validator/check");

//set view engine to EJS
app.set("view engine", "ejs");

//set the path for static resources to be accessible
app.use("/resources", express.static("resources"));
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
/************************************************************************/
/************************************************************************/

/* the following illustrates handling a general (root) request by sending an HTML file
 *  this serves as the landing/home page of the application
 *  the route definition responds by sending an HTML fille
 */
/* ** delete this comment block
app.get('/', function (req, res) {
  var path = process.cwd();
  console.log("path from where node was started" + path);
  res.sendFile(path + '/views/index.html');
});

// the following illustrates handling a request using different routes that are used to
//  to specify user action 
// this route definition serves as the controller for a sepecific request 
//  mapped to the URL pattern /studentInfo


// our goal is to apply an MVC model to seperate the application componenets into the three modules
//this design passes control completely to the view by
//passing the request object query string without any handling
//this would not be considered as a good design 
app.get('/studentInfo*', function (req, res) {
  res.render(__dirname + '/views/main', { student: req.query });
});

 ***/

/************************************************************************/
/************************************************************************/
//this design uses app.js to route incoming requests to their appropriate controllers
//these controllers will contain the funcationality logic, communicate with the model
//and get the needed data to complete a successful response. The data is packaged
//in the form the view understands and able to render/display correctly
//this design is recommended since it follows an MVC architecture
var studentInfo = require("./controls/studentInfo.js");
var index = require("./controls/index.js");
const mongoose = require("mongoose");
app.use("/", index);

mongoose.connect("mongodb://localhost:27017/Students", {
  useNewUrlParser: true
});
let connection = mongoose.connection;
connection.on("connected", () => {
  console.log("connected to Db");
});

connection.on("disconnected", () => {
  console.log("disconnected to Db");
});

connection.on("error", () => {
  console.log("******ERROR in connection**********");
});

app.use("/studentInfo", studentInfo);
app.post("/studentInfo", studentInfo);

//start local server and listen on the default HTTP port 8080
app.listen(8080, "127.0.0.1");
