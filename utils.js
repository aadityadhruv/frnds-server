//W*B*mu4ujunjzuNnAK#S
//connect to mongo atlas server 
//get ObjectId
//establish name password connection to mongo atlas


const mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectId;
const { Schema } = mongoose;

const userSchema = new Schema({
    _id : { type: String, required: true, default : new ObjectId().toHexString() },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone : { type: String, unique: true },
    year: { type: Number},
    friends: {type : [{ type: String}], default: []},
    classes : {type : [{ type: String }], default: []},
    pendingRequests: {type : [{ type: String }], default: []},
    requestsSent: {type : [{ type: String}], default: []}
    });


const User = mongoose.model('User', userSchema);
//function to create a new user
const createUser = (userData) => {
    var user = new User(userData);
    user.save();
}

//GET FUNCTIONS
//function to get a user by id
 const getUserById = async (id) => {
     var user = await User.findById(id);
    return user; 
}
//function to get a user by email
 const getUserByEmail = async (email) => {
     var user = await User.findOne({ email: email });
     return user;
}
//function to get the friends of a user
 const getFriends = async (id) => {
     var user = await User.findById(id).friends;
    return user; 
}
//function to get the pending requests of a user
 const getPendingRequests = async (id) => {
     var user = await User.findById(id).pendingRequests;
    return user; 
}
//function to get the requests sent of a user
 const getRequestsSent = async (id) => {
     var user = await User.findById(id).requestsSent;
    return user; 
}
//function to get the classes of a user
const getClasses = async (id) => {
    var user = await User.findById(id);
    console.log(user);
    return user.classes;
}
// async function getClasses(id) {
//     return await 
// }

//UPDATE FUNCTIONS

//function to update the phone number of a user
 const updatePhone = async (id, phone) => {
     var user = await  User.findByIdAndUpdate(id, { phone: phone });
    return user;
}
//function to update the username of a user
 const updateUsername = async (id, username) => {
     var user = await  User.findByIdAndUpdate(id, { username: username });
    return user;
}
//function to update the year of the user
 const updateYear = async (id, year) => {
     var user = await  User.findByIdAndUpdate(id, { year: year });
    return user;
}

//ARRAY MANIPULATION FUNCTIONS
//function to add a class to the user
 const addClass = async (id, className) => {
     var user = await User.findByIdAndUpdate(id, { $push: { classes: className } }); 
    return user;
}
//function to remove a class from the user
 const removeClass = async (id, className) => {
     var user = await User.findByIdAndUpdate(id, { $pull: { classes: className } });
    return user; 
}

//ACTIONS

//send a friend request to a user
 const sendRequest = async (id, friendId) => {
     var user = await User.findByIdAndUpdate(id, { $push: { requestsSent: friendId } });
     var friend = await User.findByIdAndUpdate(friendId, { $push: { pendingRequests: id } });
     return user;
    //add the friend to the sent requests array
    
    //add the user to the pending requests array

}
//accept a friend request from a user
 const acceptRequest = async (id, friendId) => {
     var user = await User.findByIdAndUpdate(id, { $push: { friends: friendId }, $pull: { pendingRequests: friendId } });
     var friend = await User.findByIdAndUpdate(friendId, { $push: { friends: id }, $pull: { requestsSent: id } });
     return user;
    //add the friend to the friends array and remove from the pending requests array
    //add the user to the friend's friends array and remove from the requests sent array
   
}
//decline a friend request from a user
 const declineRequest = async (id, friendId) => {
     var user = await User.findByIdAndUpdate(id, { $pull: { pendingRequests: friendId } });
     var friend = await User.findByIdAndUpdate(friendId, { $pull: { requestsSent: id } });
    //remove the friend from the pending requests array
    return user;

    //remove the user from the requests sent array
    
}
//function to remove a friend from the friends array
 const removeFriend = async (id, friendId) => {
     var user = await User.findByIdAndUpdate(id, { $pull: { friends: friendId } });
     var friend = await  User.findByIdAndUpdate(friendId, { $pull: { friends: id } });
    //remove the friend from the friends array
    return user;
  
    //remove the user from the friends array
   
}


//GENERAL HELPER FUNCTIONS  

//function to check if two users are friends
 const areFriends = async (id, friendId) => {
     var user = await User.findById(id);
    return user.friends.includes(friendId);
}
//function to check if a user has sent a friend request to another user
 const hasSentRequest = async (id, friendId) => {
     var user = await User.findById(id);
    return user.requestsSent.includes(friendId);
}
//function to check if a user has received a friend request from another user
 const hasReceivedRequest = async (id, friendId) => {
     var user = await User.findById(id);
    return user.pendingRequests.includes(friendId);
}
//function to return common classes between two users
 const commonClasses = async (id, friendId) => {
     var user = await User.findById(id);
     var friend = await User.findById(friendId);
    return user.classes.filter(className => {
        return friend.classes.includes(className);
    });
}
//function to get the friends in a class
 const friendsInClass = async (id, className) => {
     var user = await User.findById(id);
     var friend = await User.findById(friendId);
    return user.friends.filter(friendId => {
        return friend.classes.includes(className);
    });
}




module.exports = {
    createUser,
    getUserById,
    getUserByEmail,
    getFriends,
    getPendingRequests,
    getRequestsSent,
    getClasses,
    updatePhone,
    updateUsername,
    updateYear,
    addClass,
    removeClass,
    sendRequest,
    acceptRequest,
    declineRequest,
    removeFriend,
    areFriends,
    hasSentRequest,
    hasReceivedRequest,
    commonClasses,
    friendsInClass
}



