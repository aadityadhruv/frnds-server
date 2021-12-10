const express = require("express");
const cors = require("cors");
const config = require("./config");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { createUser, getClasses, friendsInClass } = require("./utils");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

try {
  // Connect to the MongoDB cluster
  mongoose.connect(config.database, { useNewUrlParser: true }, () =>
    console.log(" Mongoose is connected")
  );
} catch (e) {
  console.log("could not connect");
  console.log(e);
}

//basic display

console.log(PORT);

app.get("/", (req, res) => {
console.log("hello");
  res.json({ message: "Welcome to the Frnds-backend" });
});

//create user
app.put("/createuser", (req, res) => {
  createUser(req.body);
  res.json({ message: "OK", data: req.body });
});

//get user classes
app.get("/classes", (req, res) => {
  getClasses(req.body.id).then((classes) => {
    res.json({ message: "OK", data: classes });
  });
});

//get friends in class
app.get("/friends_classes", (req, res) => {
  friendsInClass(req.body.id, req.body.classId).then((friends) => {
    res.json({ message: "OK", data: friends });
  });
});

//get common classes
app.get("/common_classes", (req, res) => {
  commonClasses(req.body.id, req.body.friendId).then((classes) => {
    res.json({ message: "OK", data: classes });
  });
});

//add class
app.post("/add_class", (req, res) => {
  addClass(req.body.id, req.body.classId).then((classes) => {
    res.json({ message: "OK", data: classes });
  });
});

//remove class
app.post("/remove_class", (req, res) => {
  removeClass(req.body.id, req.body.classId).then((classes) => {
    res.json({ message: "OK", data: classes });
  });
});

//update user
app.post("/update_user", (req, res) => {
  updateUsername(req.body.id, req.body.username);
  updatePhone(req.body.id, req.body.phone);
  updateYear(req.body.id, req.body.year);
  res.json({ message: "OK", data: req.body });
});

//send friend request
app.post("/send_friend_request", (req, res) => {
  sendRequest(req.body.id, req.body.friendId);
  res.json({ message: "OK", data: req.body });
});

//accept friend request
app.post("/accept_friend_request", (req, res) => {
  acceptRequest(req.body.id, req.body.friendId);
  res.json({ message: "OK", data: req.body });
});

//decline friend request
app.post("/decline_friend_request", (req, res) => {
  declineRequest(req.body.id, req.body.friendId);
  res.json({ message: "OK", data: req.body });
});

//remove friend
app.post("/remove_friend", (req, res) => {
  removeFriend(req.body.id, req.body.friendId);
  res.json({ message: "OK", data: req.body });
});



//check if has sent request
app.post("/has_sent_request", (req, res) => {
    hasSentRequest(req.body.id, req.body.friendId).then((data) => {
        res.json({ message: "OK", data: data });
    });
});

//check if recieved request
app.post("/has_recieved_request", (req, res) => {
    hasRecievedRequest(req.body.id, req.body.friendId).then((data) => {
        res.json({ message: "OK", data: data });
    });
});


//check if two users are friends
app.get("/check_friends", (req, res) => {
    areFriends(req.body.id, req.body.friendId).then((friends) => {
        res.json({ message: "OK", data: friends });
    });
});





app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
