const express = require("express");
const cors = require("cors");
const config = require("./config");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { createUser, getClasses, friendsInClass } = require("./utils");
const app = express();
const PORT = 4000;
const routes = express.Router();
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

//create user
routes.post("/createuser", (req, res) => {
  createUser(req.body);
  res.json({ message: "OK" , data : req.body});
});


//get user classes
routes.get("/classes", (req, res) => {
    getClasses(req.body.id).then(classes => {
        res.json({message : "OK", data : classes});
    });
});

//get friends in class
routes.get("/friends_classes", (req, res) => {
    friendsInClass(req.body.id, req.body.classId).then(friends => {
        res.json({message : "OK", data : friends});
    }
    );
});


//get common classes
routes.get("/common_classes", (req, res) => {
    commonClasses(req.body.id, req.body.friendId).then(classes => {
        res.json({message : "OK", data : classes});
    }
    );
});


//add class
routes.post("/add_class", (req, res) => {
    addClass(req.body.id, req.body.classId).then(classes => {
        res.json({message : "OK", data : classes});
    }
    );
});


//remove class
routes.post("/remove_class", (req, res) => {
    removeClass(req.body.id, req.body.classId).then(classes => {
        res.json({message : "OK", data : classes});
    }
    );
});

//update user
routes.post("/update_user", (req, res) => {
    updateUsername(req.body.id, req.body.username);
    updatePhone(req.body.id, req.body.phone);
    updateYear(req.body.id, req.body.year);
    res.json({ message: "OK" , data : req.body});
});

//send friend request
routes.post("/send_friend_request", (req, res) => {
    sendRequest(req.body.id, req.body.friendId);
    res.json({ message: "OK" , data : req.body});
});

//accept friend request
routes.post("/accept_friend_request", (req, res) => {
    acceptRequest(req.body.id, req.body.friendId);
    res.json({ message: "OK" , data : req.body});
});


//decline friend request
routes.post("/decline_friend_request", (req, res) => {
    declineRequest(req.body.id, req.body.friendId);
    res.json({ message: "OK" , data : req.body});
});

//remove friend
routes.post("/remove_friend", (req, res) => {
    removeFriend(req.body.id, req.body.friendId);
    res.json({ message: "OK" , data : req.body});
});










app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
