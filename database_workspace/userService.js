const { sendFriendRequest, cancelBestFriendRequest } = require("./index.js");
const database_queries = require ("./index.js");
const next_button = require("../slack_workspace/src/users_src/nextButton")
const error_button = [{
    "name" : "This button has expired",
    "action" : "nothing"
}];
const friends_buttons = [{
        "name" : "Remove from Friends",
        "action" : "removeFriend"
    },
    {
        "name" : "Send Best Friend Request",
        "action" : "sendBestFriendRequest"
    }
];
const best_friends_buttons = [{
    "name" : "Remove from Best Friends",
    "action" : "removeBestFriend"
}];
const sent_requests_buttons = [{
    "name" : "Cancel Friend Request",
    "action" : "cancelFriendRequest"
}];
const received_requests_buttons = [{
    "name" : "Accept Friend Request",
    "action" : "acceptFriendRequest"
}, 
{
    "name" : "Decline Friend Request",
    "action" : "declineFriendRequest"
}];
const sent_best_friend_requests_buttons = [{
    "name" : "Cancel Best Friend Request",
    "action" : "cancelBestFriendRequest"
}];
const received_bf_req_buttons = [{
    "name" : "Accept Best Friend Request",
    "action" : "acceptBestFriendRequest"
}, 
{
    "name" : "Decline Best Friend Request",
    "action" : "declineBestFriendRequest"
}];
const send_friend_request_button = [
{
    "name" : "Send Friend Request",
    "action" : "sendFriendRequest"
}];


function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

const checkRelation = async function(relation , user_data , user2_id){
    // console.log(user2_id);
    for(var i = 0; i < user_data[relation].length; i++){
        if(user_data[relation][i]["user_id"] == user2_id){
            return 1;
        }
    }
    return 0;
}

const addRelationButtons = async function(all_users , user_data){
    var my_user_id =  user_data["user_id"];
    if(all_users.length == undefined){
        all_users = [all_users];
    }
    // console.log(all_users);
    // console.log(typeof(all_users));
    for(var i = 0; i < all_users.length; i++){
        all_users[i]["name"] = await toTitleCase(all_users[i]["name"]);
        all_users[i]["username"] = await toTitleCase(all_users[i]["username"]);
        friend_user_id = all_users[i]["user_id"] , friend_name = all_users[i]["name"];
        if(friend_user_id == my_user_id){
            continue;
        }
        var friend = await checkRelation("friends" , user_data , friend_user_id);
        var buttons = [];
        if(friend == 1){
            buttons = friends_buttons;
        }
        var best_friend = await checkRelation("best_friends" , user_data , friend_user_id);
        if(best_friend == 1){
            buttons = best_friends_buttons;
        }
        var sent_friend_req = await checkRelation("sent_requests" , user_data , friend_user_id);
        if(sent_friend_req == 1){
            buttons = sent_requests_buttons;
        }
        var received_friend_req = await checkRelation("received_requests" , user_data , friend_user_id);
        if(received_friend_req == 1){
            buttons = received_requests_buttons;
        }
        var sent_bf_req = await checkRelation("sent_best_friend_requests" , user_data , friend_user_id);
        if(sent_bf_req == 1){
            buttons = sent_best_friend_requests_buttons;
        }
        var rec_bf_req = await checkRelation("received_best_friend_requests" , user_data , friend_user_id);
        if(rec_bf_req == 1){
            buttons = received_bf_req_buttons;
        }
        // console.log(buttons);
        if(buttons.length == 0){
            buttons = send_friend_request_button;
        }
        all_users[i]["buttons"] = buttons;
        // console.log(all_users[i]);
    }
    return all_users;
}


/**GET CHANNEL ID */

const GetChannelId = async function(user_id){
    var data = await database_queries.getChannelId(user_id);
    // data = data.
    return data;
}

/* ADD A USER */
const AddUser = async function (id , username , name , email , profile_picture , channel_id){
    username = await username.toLowerCase();
    name = await name.toLowerCase();
    email = await email.toLowerCase();
    // console.log("userService" , username , name , id);
    return await database_queries.addUser(id , username , name , email , profile_picture , channel_id);
}
 
 /* GET ALL USERS(ONLY FOR ADMINS) */
const GetUsers = async function(my_user_id){
    var all_users = await database_queries.getUsers() , user_data = await database_queries.getUserWithUserId(my_user_id);
    // console.log("data -> " , all_users , user_data);
    all_users = await all_users.queryUser;
    user_data = await user_data.getUser;
    

    all_users = await addRelationButtons(all_users , user_data);
    // console.log(all_users);
    // for(user of all_users){
    //     console.log(user);
    // }

    return all_users;
}

const GetUserWithUserID2 = async function(user_id){
    var all_users = await database_queries.getUserWithUserId(user_id);
    return all_users;
}

/* GET USER WITH USER_ID FOR EXACT DETAILS */
const GetUserWithUserId = async function (my_user_id , user_id){

    var all_users = await database_queries.getUserWithUserId(user_id) , user_data = await database_queries.getUserWithUserId(my_user_id);
    // console.log("data -> " , all_users , user_data);
    all_users = await all_users.getUser;
    user_data = await user_data.getUser;
    

    all_users = await addRelationButtons(all_users , user_data);
    // console.log("Final data -> " , all_users);
    return all_users;
}

/* GET A USER WITH USERNAME */
const GetUserWithUsername = async function (my_user_id , username){
    username = await username.toLowerCase();

    var all_users = await database_queries.getUserWithUsername(username) , user_data = await database_queries.getUserWithUserId(my_user_id);
    // console.log("data -> " , all_users , user_data);
    all_users = await all_users.queryUser;
    user_data = await user_data.getUser;
    // console.log(all_users);

    all_users = await addRelationButtons(all_users , user_data);

    return all_users;
}

/* GET ALL USERS WITH NAME */
const SearchUserWithName = async function(my_user_id , name){
    name = await name.toLowerCase();
    // console.log("name->",name);
    var all_users = await database_queries.searchUserWithName(name) , user_data = await database_queries.getUserWithUserId(my_user_id);
    // console.log("data -> " , all_users , user_data);
    all_users = await all_users.queryUser;
    user_data = await user_data.getUser;
    // console.log("dsa->",all_users);

    all_users = await addRelationButtons(all_users , user_data);
    // console.log("allusers",all_users);
    return all_users;
}

/* VIEW MY FRIENDS */
const GetMyFriends = async function (user_id){
    var all_users = await database_queries.getMyFriends(user_id);
    // console.log(all_users);
    all_users = all_users.getUser.friends;
    
    for(var i = 0; i < all_users.length; i++){
        all_users[i]["buttons"] = friends_buttons;
    }
    return all_users;
}

/* VIEW MY BEST FRIENDS */
const GetMyBestFriends = async function (user_id){
    var all_users = await database_queries.getMyBestFriends(user_id);
    // console.log("all users " , all_users);
    all_users = await all_users.getUser.best_friends;

    for(var i = 0; i < all_users.length; i++){
        all_users[i]["buttons"] = best_friends_buttons;
    }
    return all_users;
}

/* VIEW MY RECEIVED REQUESTS */
const GetMyReceivedRequests = async function (user_id){
    var all_users = await database_queries.getMyReceivedRequests(user_id);
    // console.log(all_users);
    all_users = all_users.getUser.received_requests;
    
    for(var i = 0; i < all_users.length; i++){
        all_users[i]["buttons"] = received_requests_buttons;
    }
    return all_users;
}

/* VIEW MY SENT REQUESTS */
const GetMySentRequests = async function (user_id){
    var all_users = await database_queries.getMySentRequests(user_id);
    all_users = all_users.getUser.sent_requests;
    for(var i = 0; i < all_users.length; i++){
        all_users[i]["buttons"] = sent_requests_buttons;
    }
    return all_users;
}

const GetMySentBestFriendRequests = async function (user_id){
    var all_users = await database_queries.getMySentBestFriendRequests(user_id);
    all_users = all_users.getUser.sent_best_friend_requests;
    for(var i = 0; i < all_users.length; i++){
        all_users[i]["buttons"] = sent_best_friend_requests_buttons;
    }
    return all_users;
}

const GetMyReceivedBestFriendRequests = async function (user_id){
    var all_users = await database_queries.getMyReceivedBestFriendRequests(user_id);
    all_users = all_users.getUser.received_best_friend_requests;
    for(var i = 0; i < all_users.length; i++){
        all_users[i]["buttons"] = received_best_friend_requests_buttons;
    }
    return all_users;
}
/* SEND FRIEND REQUEST */
const SendFriendRequest = async function (my_user_id , friend_user_id){
    /**Pakka koi relation nahi hai
     * 
     * sent_requests
     * received_requests
     * friends
     * best_friends
     * received_best_friend_request
     * sent_best_friend_request
     * 
     * in lists mai nahi hai
     */

    var user_data = await database_queries.getUserWithUserId(my_user_id);
    user_data = await user_data.getUser;
    // console.log("My Data -> ",user_data , my_user_id , friend_user_id);
    var friend = await checkRelation("friends" , user_data , friend_user_id);
    // console.log("friends -> ",friends);
    if(friend == 1){
        // console.log("friends hai");
        return error_button;
    }
    var best_friend = await checkRelation("best_friends" , user_data , friend_user_id);
    if(best_friend == 1){
        // console.log("best friends");
        return error_button;
    }
    var sent_friend_req = await checkRelation("sent_requests" , user_data , friend_user_id);
    if(sent_friend_req == 1){
        // console.log("sent friends");
        return error_button;
    }
    var received_friend_req = await checkRelation("received_requests" , user_data , friend_user_id);
    if(received_friend_req == 1){
        // console.log("rec friends");
        return error_button;
    }
    var sent_bf_req = await checkRelation("sent_best_friend_requests" , user_data , friend_user_id);
    if(sent_bf_req == 1){
        // console.log("sent best friends");
        return error_button;
    }
    var rec_bf_req = await checkRelation("received_best_friend_requests" , user_data , friend_user_id);
    if(rec_bf_req == 1){
        // console.log("rec best friends");
        return error_button;
    }


    var temp = await database_queries.sendFriendRequest(my_user_id , friend_user_id);
    return await next_button.nextButton("sendFriendRequest");
}

/* CANCEL FRIEND REQUEST */
const CancelFriendRequest = async function(my_user_id , friend_user_id){

    var user_data = await database_queries.getUserWithUserId(my_user_id);
    user_data = await user_data.getUser;
    var friend = await checkRelation("friends" , user_data , friend_user_id);
    if(friend == 1){
        return error_button;
    }
    var best_friend = await checkRelation("best_friends" , user_data , friend_user_id);
    if(best_friend == 1){
        return error_button;
    }
    var sent_friend_req = await checkRelation("sent_requests" , user_data , friend_user_id);
    if(sent_friend_req == 0){
        // console.log("sent friends");
        return error_button;
    }
    var received_friend_req = await checkRelation("received_requests" , user_data , friend_user_id);
    if(received_friend_req == 1){
        return error_button;
    }
    var sent_bf_req = await checkRelation("sent_best_friend_requests" , user_data , friend_user_id);
    if(sent_bf_req == 1){
        return error_button;
    }
    var rec_bf_req = await checkRelation("received_best_friend_requests" , user_data , friend_user_id);
    if(rec_bf_req == 1){
        return error_button;
    }


    var temp =  await database_queries.cancelFriendRequest(my_user_id , friend_user_id);
    return await next_button.nextButton("cancelFriendRequest");
}

/* SEND BEST FRIEND REQUEST */
const SendBestFriendRequest = async function (my_user_id , friend_user_id){
    var user_data = await database_queries.getUserWithUserId(my_user_id);
    user_data = await user_data.getUser;
    var best_friend = await checkRelation("best_friends" , user_data , friend_user_id);
    if(best_friend == 1){
        return error_button;
    }
    var sent_friend_req = await checkRelation("sent_requests" , user_data , friend_user_id);
    if(sent_friend_req == 1){
        return error_button;
    }
    var received_friend_req = await checkRelation("received_requests" , user_data , friend_user_id);
    if(received_friend_req == 1){
        return error_button;
    }
    var sent_bf_req = await checkRelation("sent_best_friend_requests" , user_data , friend_user_id);
    if(sent_bf_req == 1){
        return error_button;
    }
    var rec_bf_req = await checkRelation("received_best_friend_requests" , user_data , friend_user_id);
    if(rec_bf_req == 1){
        return error_button;
    }


    var temp = await database_queries.sendBestFriendRequest(my_user_id , friend_user_id);
    return await next_button.nextButton("sendBestFriendRequest");
}

/* CANCEL BEST FRIEND REQUEST */
const CancelBestFriendRequest = async function(my_user_id , friend_user_id){

    var user_data = await database_queries.getUserWithUserId(my_user_id);
    user_data = await user_data.getUser;
    var best_friend = await checkRelation("best_friends" , user_data , friend_user_id);
    if(best_friend == 1){
        return error_button;
    }
    var sent_friend_req = await checkRelation("sent_requests" , user_data , friend_user_id);
    if(sent_friend_req == 1){
        return error_button;
    }
    var received_friend_req = await checkRelation("received_requests" , user_data , friend_user_id);
    if(received_friend_req == 1){
        return error_button;
    }
    var rec_bf_req = await checkRelation("received_best_friend_requests" , user_data , friend_user_id);
    if(rec_bf_req == 1){
        return error_button;
    }


    var temp = await database_queries.cancelBestFriendRequest(my_user_id , friend_user_id);
    return await next_button.nextButton("cancelBestFriendRequest");
}

/* ACCEPT AN INCOMING FRIEND REQUEST */
const AcceptFriendRequest = async function (my_user_id , friend_user_id){

    var user_data = await database_queries.getUserWithUserId(my_user_id);
    user_data = await user_data.getUser;
    var friend = await checkRelation("friends" , user_data , friend_user_id);
    if(friend == 1){
        return error_button;
    }
    var best_friend = await checkRelation("best_friends" , user_data , friend_user_id);
    if(best_friend == 1){
        return error_button;
    }
    var sent_friend_req = await checkRelation("sent_requests" , user_data , friend_user_id);
    if(sent_friend_req == 1){
        return error_button;
    }
    var sent_bf_req = await checkRelation("sent_best_friend_requests" , user_data , friend_user_id);
    if(sent_bf_req == 1){
        return error_button;
    }
    var rec_bf_req = await checkRelation("received_best_friend_requests" , user_data , friend_user_id);
    if(rec_bf_req == 1){
        return error_button;
    }


    var temp = await database_queries.acceptFriendRequest(my_user_id , friend_user_id);
    return await next_button.nextButton("acceptFriendRequest");
}

/* DECLINE AN INCOMING FRIEND REQUEST */
const DeclineFriendRequest = async function (my_user_id , friend_user_id){
    var user_data = await database_queries.getUserWithUserId(my_user_id);
    user_data = await user_data.getUser;
    var friend = await checkRelation("friends" , user_data , friend_user_id);
    if(friend == 1){
        return error_button;
    }
    var best_friend = await checkRelation("best_friends" , user_data , friend_user_id);
    if(best_friend == 1){
        return error_button;
    }
    var sent_friend_req = await checkRelation("sent_requests" , user_data , friend_user_id);
    if(sent_friend_req == 1){
        return error_button;
    }
    var sent_bf_req = await checkRelation("sent_best_friend_requests" , user_data , friend_user_id);
    if(sent_bf_req == 1){
        return error_button;
    }
    var rec_bf_req = await checkRelation("received_best_friend_requests" , user_data , friend_user_id);
    if(rec_bf_req == 1){
        return error_button;
    }


    var temp = await database_queries.declineFriendRequest(my_user_id , friend_user_id);
    return await next_button.nextButton("declineFriendRequest");
}

/* ACCEPT AN INCOMING BEST FRIEND REQUEST */
const AcceptBestFriendRequest = async function (my_user_id , friend_user_id){
    var user_data = await database_queries.getUserWithUserId(my_user_id);
    user_data = await user_data.getUser;
    var best_friend = await checkRelation("best_friends" , user_data , friend_user_id);
    if(best_friend == 1){
        return error_button;
    }
    var sent_friend_req = await checkRelation("sent_requests" , user_data , friend_user_id);
    if(sent_friend_req == 1){
        return error_button;
    }
    var received_friend_req = await checkRelation("received_requests" , user_data , friend_user_id);
    if(received_friend_req == 1){
        return error_button;
    }
    var sent_bf_req = await checkRelation("sent_best_friend_requests" , user_data , friend_user_id);
    if(sent_bf_req == 1){
        return error_button;
    }

    var temp = await database_queries.acceptBestFriendRequest(my_user_id , friend_user_id);
    return await next_button.nextButton("acceptBestFriendRequest");
}

/* DECLINE AN INCOMING BEST FRIEND REQUEST */
const DeclineBestFriendRequest = async function (my_user_id , friend_user_id){
    var user_data = await database_queries.getUserWithUserId(my_user_id);
    user_data = await user_data.getUser;
    var best_friend = await checkRelation("best_friends" , user_data , friend_user_id);
    if(best_friend == 1){
        return error_button;
    }
    var sent_friend_req = await checkRelation("sent_requests" , user_data , friend_user_id);
    if(sent_friend_req == 1){
        return error_button;
    }
    var received_friend_req = await checkRelation("received_requests" , user_data , friend_user_id);
    if(received_friend_req == 1){
        return error_button;
    }
    var sent_bf_req = await checkRelation("sent_best_friend_requests" , user_data , friend_user_id);
    if(sent_bf_req == 1){
        return error_button;
    }

    var temp = await database_queries.declineBestFriendRequest(my_user_id , friend_user_id);
    return await next_button.nextButton("declineBestFriendRequest");
}

/* REMOVE A FRIEND FROM YOUR FRIEND LIST */
const RemoveFriend = async function (my_user_id , friend_user_id){

    var user_data = await database_queries.getUserWithUserId(my_user_id);
    user_data = await user_data.getUser;
    var best_friend = await checkRelation("best_friends" , user_data , friend_user_id);
    if(best_friend == 1){
        return error_button;
    }
    var sent_friend_req = await checkRelation("sent_requests" , user_data , friend_user_id);
    if(sent_friend_req == 1){
        return error_button;
    }
    var received_friend_req = await checkRelation("received_requests" , user_data , friend_user_id);
    if(received_friend_req == 1){
        return error_button;
    }
    var sent_bf_req = await checkRelation("sent_best_friend_requests" , user_data , friend_user_id);
    if(sent_bf_req == 1){
        return error_button;
    }
    var rec_bf_req = await checkRelation("received_best_friend_requests" , user_data , friend_user_id);
    if(rec_bf_req == 1){
        return error_button;
    }

    var temp = await database_queries.removeFriend(my_user_id , friend_user_id);
    return await next_button.nextButton("removeFriend");
}

/* REMOVE A FRIEND FROM YOUR BEST FRIEND LIST */
const RemoveBestFriend = async function (my_user_id , friend_user_id){
    var user_data = await database_queries.getUserWithUserId(my_user_id);
    user_data = await user_data.getUser;
    var friend = await checkRelation("friends" , user_data , friend_user_id);
    if(friend == 1){
        return error_button;
    }
    var sent_friend_req = await checkRelation("sent_requests" , user_data , friend_user_id);
    if(sent_friend_req == 1){
        return error_button;
    }
    var received_friend_req = await checkRelation("received_requests" , user_data , friend_user_id);
    if(received_friend_req == 1){
        return error_button;
    }
    var sent_bf_req = await checkRelation("sent_best_friend_requests" , user_data , friend_user_id);
    if(sent_bf_req == 1){
        return error_button;
    }
    var rec_bf_req = await checkRelation("received_best_friend_requests" , user_data , friend_user_id);
    if(rec_bf_req == 1){
        return error_button;
    }

    var temp = await database_queries.removeBestFriend(my_user_id , friend_user_id);
    return await next_button.nextButton("removeBestFriend");
}

const Nothing = async function (){
    return error_button;
}

module.exports = {
    "addUser" : AddUser,
    "getUsers" : GetUsers,
    "getUserWithUserId" : GetUserWithUserId,
    "getUserWithUsername" : GetUserWithUsername,
    "searchUserWithName" : SearchUserWithName,
    "getMyFriends" : GetMyFriends,
    "getMyBestFriends" : GetMyBestFriends,
    "getMyReceivedRequests" : GetMyReceivedRequests,
    "getMySentRequests" : GetMySentRequests,
    "getMySentBestFriendRequests" : GetMySentBestFriendRequests,
    "sendFriendRequest" : SendFriendRequest,
    "cancelFriendRequest" : CancelFriendRequest,
    "sendBestFriendRequest" : SendBestFriendRequest,
    "cancelBestFriendRequest" : CancelBestFriendRequest,
    "acceptFriendRequest" : AcceptFriendRequest,
    "declineFriendRequest" : DeclineFriendRequest,
    "acceptBestFriendRequest" : AcceptBestFriendRequest,
    "declineBestFriendRequest" : DeclineBestFriendRequest,
    "removeFriend" : RemoveFriend,
    "removeBestFriend" :  RemoveBestFriend,
    "getChannelId" : GetChannelId,
    "received_requests_buttons" : received_requests_buttons,
    "received_bf_req_buttons" : received_bf_req_buttons,
    "getUserWithUserID2" : GetUserWithUserID2,
    "nothing" : Nothing
  }

// GetUsers("U01AMFZCCEP");
// SearchUserWithName("003" , "Shashank");
// GetUserWithUserId("003" , "001");
// GetUserWithUsername("001" , "ria0412");
// AcceptBestFriendRequest("001" , "003");
// AcceptFriendRequest("002" , "001");
// RemoveBestFriend("001" , "003");
// RemoveFriend("001" , "003");
// RemoveBestFriend("001" , "002");
// RemoveFriend("001" , "002");
// RemoveBestFriend("002" , "003");
// RemoveFriend("002" , "003");
// SendBestFriendRequest("001" , "003");
// cancelBestFriendRequest("001" , "003");
// CancelFriendRequest("001" , "003");