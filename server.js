const express = require("express");
const cors = require("cors");
const axios = require("axios");
const config = require("./config");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const {
  createUser,
  getClasses,
  friendsInClass,
  commonClasses,
  addClass,
  removeClass,
  updatePhone,
  updateUsername,
  updateYear,
  sendRequest,
  acceptRequest,
  declineRequest,
  removeFriend,
  hasSentRequest,
  hasReceivedRequest,
  areFriends,
  getUserById,
  getAllUsers,
} = require("./utils");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
app.post("/createuser", (req, res) => {
  try {
  createUser(req.body);
  res.json({ message: "OK", data: req.body });
  } catch (e) {
    res.json({ message: "error", data: e });
  }

});

//get user classes
app.get("/classes", async (req, res) => {
  try {
  await getClasses(req.query.id).then((classes) => {
    res.json({ message: "OK", data: classes });
  });
}


  catch (e) {
    res.json({ message: "error", data: e });
  }
});

//get friends in class
app.get("/friends_classes", async (req, res) => {
  try {
  await friendsInClass(req.query.id, req.query.classId).then((friends) => {
    res.json({ message: "OK", data: friends });
  });
} catch (e) {
  res.json({ message: "error", data: e });
}
});

//get common classes
app.get("/common_classes", async (req, res) => {
  try {
  await commonClasses(req.query.id, req.query.friendId).then((classes) => {
    res.json({ message: "OK", data: classes });
  });
} catch (e) {
  res.json({ message: "error", data: e });
}
});

//add class
app.post("/add_class", async (req, res) => {
  try {
  await addClass(req.query.id, req.query.classId).then((classes) => {
    res.json({ message: "OK", data: classes });
  });
} catch (e) {
  res.json({ message: "error", data: e });
}
});

//remove class
app.post("/remove_class", async (req, res) => {
  try {
  await removeClass(req.query.id, req.query.classId).then((classes) => {
    res.json({ message: "OK", data: classes });
  });
} catch (e) {
  res.json({ message: "error", data: e });
}
});

//update user
app.put("/update_user", async (req, res) => {
  try {
  await updateUsername(req.body.id, req.body.username);
  await updatePhone(req.body.id, req.body.phone);
  await updateYear(req.body.id, req.body.year);
  res.json({ message: "OK", data: req.body });
} catch (e) {
  res.json({ message: "error", data: e });
}
});

//send friend request
app.post("/send_friend_request", async (req, res) => {
  try {
  await sendRequest(req.query.id, req.query.friendId);
  res.json({ message: "OK", data: req.query });
  } catch (e) {
    res.json({ message: "error", data: e });
  }

});

//accept friend request
app.post("/accept_friend_request", async (req, res) => {
  try {
  await acceptRequest(req.query.id, req.query.friendId);
  res.json({ message: "OK", data: req.query });
  } catch (e) {
    res.json({ message: "error", data: e });
  }
});

//decline friend request
app.post("/decline_friend_request", async (req, res) => {
  try {
  await declineRequest(req.query.id, req.query.friendId);
  res.json({ message: "OK", data: req.query });
  } catch (e) {
    res.json({ message: "error", data: e });
  }
});

//remove friend
app.post("/remove_friend", async (req, res) => {
  try {
  await removeFriend(req.query.id, req.query.friendId);
  res.json({ message: "OK", data: req.query });
  } catch (e) {
    res.json({ message: "error", data: e });
  }

});

//check if has sent request
app.get("/has_sent_request", async (req, res) => {
  try {
  await hasSentRequest(req.query.id, req.query.friendId).then((data) => {
    res.json({ message: "OK", data: data });
  });
} catch (e) {
  res.json({ message: "error", data: e });
}
});


app.get("/user", async (req, res) => {
  try {
  var user = await getUserById(req.query.id);
  res.json({ message: "OK", data: user });
} catch (e) {
  res.json({ message: "error", data: e });
}
  });



  //get all users
  app.get("/users", async (req, res) => {
    try {
    var users = await getAllUsers();
    res.json({ message: "OK", data: users });
    } catch (e) {
      res.json({ message: "error", data: e });
    }
    });



//check if recieved request
app.get("/has_received_request", async (req, res) => {
  try {
  await hasRecievedRequest(req.query.id, req.query.friendId).then((data) => {
    res.json({ message: "OK", data: data });
  });
} catch (e) {
  res.json({ message: "error", data: e });
}
});

//check if two users are friends
app.get("/check_friends", async (req, res) => {
  try {
  await areFriends(req.query.id, req.query.friendId).then((friends) => {
    res.json({ message: "OK", data: friends });
  });
} catch (e) {
  res.json({ message: "error", data: e });
}
});

//API Call

app.get("/course", (req, res) => {
  try {
  const { year, semester, subject, code, crn } = req.query;

  if (crn) {
    axios
      .get(
        `https://courses.illinois.edu/cisapp/explorer/schedule/${year}/${semester}/${subject}/${code}/${crn}.xml`,
        { "Content-Type": "application/xml; charset=utf-8" }
      )
      .then((response) => {
        res.send({ message: "OK", data: response.data });
      });
  } else if (code) {

    axios
      .get(
        `https://courses.illinois.edu/cisapp/explorer/schedule/${year}/${semester}/${subject}/${code}.xml`,
        { "Content-Type": "application/xml; charset=utf-8" }
      )
      .then((response) => {
        res.send({ message: "OK", data: response.data });
      });
    } else {
      axios
        .get(
          `https://courses.illinois.edu/cisapp/explorer/schedule/${year}/${semester}/${subject}.xml`,
          { "Content-Type": "application/xml; charset=utf-8" }
        )
        .then((response) => {
          res.send({ message: "OK", data: response.data });
        });
    }
  } catch (e) {
    res.send({ message: "error", data: e });
  }

});

app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});
