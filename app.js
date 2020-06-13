var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));
const io = require("socket.io")(8080);
let count = 0;
let activeCount = 0;
let users = [];

io.on("connection", socket => {

  socket.on("new-window", id => {
    if (users.indexOf(id) == -1) {
      users.push(id);
      activeCount = activeCount + 1;
      console.log("new user");
    } else {
      console.log("somebody returned");
    }
    console.log("Active users = "+activeCount);
  });

  socket.on("raise-hand", function() {
    count = count + 1;
    console.log("Raise Hands " + (count/activeCount)*100+"%");
  });

  socket.on("hand-raised", function() {
    count = count - 1;
    console.log("Raise Hands " + (count/activeCount)*100+"%");
  });

  
});
