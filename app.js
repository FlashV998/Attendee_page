var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));
const io = require("socket.io")(8080);
let count = 0;
let activeCount = 0;
let users = [];


io.on("connection", socket => {
  socket.on("raise-hand", function() {
    count = count + 1;
    console.log("Raise Hands " + (count/activeCount)*100+"%");
  });

  socket.on("hand-raised", function() {
    count = count - 1;
    console.log("Raise Hands " + (count/activeCount)*100+"%");
  });


});

var cookieParser = require('cookie-parser');
var session = require('express-session')
app.use(cookieParser());
app.use(session({
    secret: '34SDgsdgspxxxxxxxdfsG', // just a long random string
    resave: false,
    saveUninitialized: true
}));


app.get("/",function(req,res){
  res.render("home.ejs");
  const id= req.sessionID;
  if (users.indexOf(id) == -1) {
      users.push(id);
      activeCount = activeCount + 1;
      console.log("new user");
    } else {
      console.log("somebody returned");
    }
    console.log("Active users = "+activeCount);
});

app.get("/chatroom",function(req,res){
 res.render("chatroom.ejs");
});

app.listen(3000,function(){
  console.log("Server started at port 3000");
});
