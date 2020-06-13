var express = require("express");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));
const io = require("socket.io")(8080);
var raisedHands = 0;
var activeCount = 0;
var users = [];

const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/pollStatusDB",{useNewUrlParser:true,useUnifiedTopology:true});

mongooseId="5ee33bfb07d3bd69c43ef90e";

const status=new mongoose.Schema({
  raised:Number,
  activeUsers:Number,
  userIds:[]
});

const Poll=mongoose.model("Poll",status);

Poll.updateOne({_id:mongooseId},{raised:raisedHands,activeUsers:activeCount,userIds:users},function(err){
  if(err){
    console.log(err);
  }
});



io.on("connection", socket => {


  socket.on("new-window", id => {
    updateUserids(id);
  });

  socket.on("raise-hand", function() {
    updateRaised(1);
  });

  socket.on("hand-raised", function() {
    updateRaised(-1);
  });

});


function updateRaised(number){
  raisedHands=raisedHands+number;
  Poll.updateOne({_id:mongooseId},{raised:raisedHands},function(err){
    if(err){
      console.log(error);
    }
  });
  pollStatus();
}

function updateActiveCount(number){
  activeCount=activeCount+number;
  Poll.updateOne({_id:mongooseId},{activeUsers:activeCount},function(err){
    if(err){
      console.log(error);
    }
  });
}

function updateUserids(newId){
  Poll.findOne(function(err,polls){
    if(err){
      console.log("");
    }
    else{
      users=polls.userIds;
      if(users.indexOf(newId)==-1){
        users.push(newId);
        Poll.updateOne({_id:mongooseId},{userIds:users},function(err){
          console.log("");
        });
        updateActiveCount(1);
      }
      else{
        console.log("somebody returned");
      }
    }
  });
  pollStatus();
}

function pollStatus(){
  Poll.findOne(function(err,poll){
    if(err){
      console.log(err);
    }
    else{
      console.log("......................................");
      console.log("Active Users = "+activeCount+"   percentage of people who raised their hands = "+(raisedHands/activeCount)*100+"%");
    }
  });
}
