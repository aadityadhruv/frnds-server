//W*B*mu4ujunjzuNnAK#S
//connect to mongo atlas server 
//get ObjectId
//establish name password connection to mongo atlas


const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;
const { Schema } = mongoose;

const userSchema = new Schema({
    _id : ObjectId,
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone : { type: String, required: true, unique: true },
    year: { type: Number, required: true },
    friends: [{ type: ObjectId, ref: 'User' }],
    classes : [{ type: String }],
    pendingRequests: [{ type: ObjectId, ref: 'User' }],
    requestsSent: [{ type: ObjectId, ref: 'User' }]
    });


const User = mongoose.model('User', userSchema);
//function to create a new user
const createUser = (userData) => {
    var user = new User(userData);
    user.save();
}

//GET FUNCTIONS
//function to get a user by id
 const getUserById = (id) => {
    return User.findById(id);
}
//function to get a user by email
 const getUserByEmail = (email) => {
    return User.findOne({ email: email });
}
//function to get the friends of a user
 const getFriends = (id) => {
    return User.findById(id).friends;
}
//function to get the pending requests of a user
 const getPendingRequests = (id) => {
    return User.findById(id).pendingRequests;
}
//function to get the requests sent of a user
 const getRequestsSent = (id) => {
    return User.findById(id).requestsSent;
}
//function to get the classes of a user
 const getClasses = (id) => {
    return User.findById(id).classes;
}

//UPDATE FUNCTIONS

//function to update the phone number of a user
 const updatePhone = (id, phone) => {
    return User.findByIdAndUpdate(id, { phone: phone });
}
//function to update the username of a user
 const updateUsername = (id, username) => {
    return User.findByIdAndUpdate(id, { username: username });
}
//function to update the year of the user
 const updateYear = (id, year) => {
    return User.findByIdAndUpdate(id, { year: year });
}

//ARRAY MANIPULATION FUNCTIONS
//function to add a class to the user
 const addClass = (id, className) => {
    return User.findByIdAndUpdate(id, { $push: { classes: className } });
}
//function to remove a class from the user
 const removeClass = (id, className) => {
    return User.findByIdAndUpdate(id, { $pull: { classes: className } });
}

//ACTIONS

//send a friend request to a user
 const sendRequest = (id, friendId) => {
    //add the friend to the sent requests array
    User.findByIdAndUpdate(id, { $push: { requestsSent: friendId } });
    //add the user to the pending requests array
    User.findByIdAndUpdate(friendId, { $push: { pendingRequests: id } });

}
//accept a friend request from a user
 const acceptRequest = (id, friendId) => {
    //add the friend to the friends array and remove from the pending requests array
    User.findByIdAndUpdate(id, { $push: { friends: friendId }, $pull: { pendingRequests: friendId } });
    //add the user to the friend's friends array and remove from the requests sent array
    User.findByIdAndUpdate(friendId, { $push: { friends: id }, $pull: { requestsSent: id } });
}
//decline a friend request from a user
 const declineRequest = (id, friendId) => {
    //remove the friend from the pending requests array
    User.findByIdAndUpdate(id, { $pull: { pendingRequests: friendId } });
    //remove the user from the requests sent array
    User.findByIdAndUpdate(friendId, { $pull: { requestsSent: id } });
}
//function to remove a friend from the friends array
 const removeFriend = (id, friendId) => {
    //remove the friend from the friends array
    User.findByIdAndUpdate(id, { $pull: { friends: friendId } });
    //remove the user from the friends array
    User.findByIdAndUpdate(friendId, { $pull: { friends: id } });
}


//GENERAL HELPER FUNCTIONS  

//function to check if two users are friends
 const areFriends = (id, friendId) => {
    return User.findById(id).friends.includes(friendId);
}
//function to check if a user has sent a friend request to another user
 const hasSentRequest = (id, friendId) => {
    return User.findById(id).requestsSent.includes(friendId);
}
//function to check if a user has received a friend request from another user
 const hasReceivedRequest = (id, friendId) => {
    return User.findById(id).pendingRequests.includes(friendId);
}
//function to return common classes between two users
 const commonClasses = (id, friendId) => {
    return User.findById(id).classes.filter(className => {
        return User.findById(friendId).classes.includes(className);
    });
}
//function to get the friends in a class
 const friendsInClass = (id, className) => {
    return User.findById(id).friends.filter(friendId => {
        return User.findById(friendId).classes.includes(className);
    });
}







