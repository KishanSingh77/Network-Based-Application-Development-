/* @nanajjar */

var express = require("express");
var app = (module.exports = express());
const bodyParser = require("body-parser");
const session = require("express-session");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
let count = 0;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: "keyboard cat"
  })
);

app.get("/", function(request, response) {
  var studentObj = require("./../models/student");

  console.log(request.session.theStudent);
  if (request.session.theStudent) {
    console.log("session available");

    studentObj.setFirstName(request.session.theStudent.firstName);
    studentObj.setLastName(request.session.theStudent.lastName);
    studentObj.setDegree(request.session.theStudent.degree);
    studentObj.setProgram(request.session.theStudent.program);
    student = studentObj.getStudentInfo();

    console.log(count);

    response.render("main", { student: student });
  } else {
    console.log("request with query string was sent");
    var path = process.cwd();
    console.log("path from where node was started" + path);
    console.log(count);

    //response.render("main", { student: student });
  }
});

app.use((request, response, next) => {
  count = count + 1;
  module.exports = { count };
  next();
});
app.post("/", urlencodedParser, (request, response) => {
  var sentFirstName = request.body.firstName;
  var sentLastName = request.body.lastName;
  var sentDegree = request.body.degree;
  var sentProgram = request.body.program;

  var studentObj = require("./../models/student");

  studentObj.setFirstName(sentFirstName);
  studentObj.setLastName(sentLastName);
  studentObj.setDegree(sentDegree);
  studentObj.setProgram(sentProgram);
  student = studentObj.getStudentInfo();

  console.log("post in studentInfo");
  request.session.theStudent = student;
  //console.log(request.session.theStudent);

  console.log(count);

  //response.end("Session ");
  response.render("index", { count: count });
});

app.get("/:firstName/:lastName/:degree/:program", function(request, response) {
  var sentFirstName = request.params.firstName;
  var sentLastName = request.params.lastName;
  var sentDegree = request.params.degree;
  var sentProgram = request.params.program;

  //create data
  //this illustrates not defining functions for the data objects and having the model created within the controller
  //this is not recommended since it doesn't provide a clear seperation of MVC modules
  var studentObj = require("./../models/student");

  studentObj.setFirstName(sentFirstName);
  studentObj.setLastName(sentLastName);
  studentObj.setDegree(sentDegree);
  studentObj.setProgram(sentProgram);
  student = studentObj.getStudentInfo();
  console.log("student data object is ");
  console.log(studentObj);
  //ready to send response. Pass the data to the correct view
  response.render("main", { student: studentObj });
});
