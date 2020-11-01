const fetch = require('node-fetch');
const database_url = "https://melted-price.ap-south-1.aws.cloud.dgraph.io/graphql";

async function fetchGraphQL(operationsDoc, operationName, variables) {
    const result = await fetch(
      database_url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: operationsDoc,
          variables: variables,
          operationName: operationName
        })
      }
    );
    return await result.json();
  }

  
  async function fetchGetAllUsers(operationsDoc , operationName) {
    return await fetchGraphQL(
      operationsDoc,
      operationName,
      {}
    );
  }
  
  async function executeQueryOrMutation(operationsDoc , operationName) {
    const { errors, data } = await fetchGetAllUsers(operationsDoc , operationName);
  
    if (errors) {
      // handle those errors like a pro
      console.error(errors);
      return errors;
    }
    // console.log("executing");
    // console.log(data);
    return await data;
  }

/* GET CHANNEL ID */
const GetChannelId = async function(user_id){
  const operationDoc = `query GetChannelID{
    getUser(user_id : "` + user_id + `"){
      channel_id
    }
  }`;
  var data = await executeQueryOrMutation(operationDoc , "GetChannelID");
  return data;
}

/* ADD A USER */
const AddUser = async function (id , username , name , email , profile_picture , channel_id){
  
   const operationsDoc = `
    mutation AddUser {
        addUser(input: [
            {
                user_id: "` + id + `",
                username:"` + username + `", 
                name: "` + name + `" ,
                email: "` + email + `" ,
                profile_picture: "` + profile_picture + `",
                channel_id : "` + channel_id + `",
            }]) {
        user {
            username
            name
            friends {
                username
                name
            }
        }
        }
    }
    `;
    // console.log(operationsDoc);
    var data = await executeQueryOrMutation(operationsDoc , "AddUser");
    return data;
}

/* GET ALL USERS(ONLY FOR ADMINS) */
const GetUsers = async function(){
    const operationsDoc = `
    query GetAllUsers {
      queryUser(order: {asc: username}) {
        user_id
        username
        name
        email
        profile_picture
        channel_id 
        friends {
          user_id
          username
          name
          profile_picture
        }
        best_friends{
            user_id
            username
            name
            profile_picture
        }
      }
    }
  `;
  const data = await executeQueryOrMutation(operationsDoc , "GetAllUsers");
  // console.log(data);
    return data;
}

/* GET USER WITH USER_ID FOR EXACT DETAILS */
const GetUserWithUserId = async function (user_id){
    const operationsDoc = `query GetUserWithUserId{
        getUser(user_id: "` + user_id + `"){
          user_id
          name
          username
          profile_picture
          channel_id
          friends{
              user_id
          }
          best_friends{
              user_id
          }
          sent_requests{
              user_id
          }
          received_requests{
              user_id
          }
          sent_best_friend_requests{
              user_id
          }
          received_best_friend_requests{
              user_id
          }
        }
      }
    `;
    const response = await executeQueryOrMutation(operationsDoc , "GetUserWithUserId");
    // console.log(response);
    return response;
}

/* GET A USER WITH USERNAME */
const GetUserWithUsername = async function (username){
    const operationsDoc = `
    query GetUserWithUsername {
        queryUser(filter: {username: {eq: "` + username + `"}}) {
          user_id
          name
          username
          email
          profile_picture
          channel_id
        }
      }
    `;
    const response = await executeQueryOrMutation(operationsDoc , "GetUserWithUsername");
    return response;
}

/* GET ALL USERS WITH NAME */
const SearchUserWithName = async function(name){
    const operationsDoc = `
    query GetUsersWithName  {
        queryUser(filter: {name: {regexp: "/.*` + name + `.*/"}}) {
            user_id
            name
            username
            email
            profile_picture
        }
    }
    `;
    console.log("getting response");
    const response = await executeQueryOrMutation(operationsDoc , "GetUsersWithName");
    console.log("rec res ",response);
    console.log(response[0]);
    return response;
}

/* VIEW MY FRIENDS */
const GetMyFriends = async function (user_id){
    const operationsDoc = `
    query GetMyFriends {
        getUser(user_id: "` + user_id + `") {
          #channel_id
           friends{
             name
             user_id
             username
             channel_id
           }
         }
       }
  `;
  
  const response = await executeQueryOrMutation(operationsDoc , "GetMyFriends");
  return response;
}

/* VIEW MY BEST FRIENDS */
const GetMyBestFriends = async function (user_id){
    const operationsDoc = `
    query GetMyBestFriends {
        getUser(user_id: "` + user_id + `") {
          #channel_id
           best_friends{
             name
             user_id
             username
             channel_id
           }
         }
       }
  `;
  
  const response = await executeQueryOrMutation(operationsDoc , "GetMyBestFriends");
  return response;
}

/* VIEW MY RECEIVED REQUESTS */
const GetMyReceivedRequests = async function (user_id){
    const operationsDoc = `
    query GetMyReceivedRequests {

        getUser(user_id: "` + user_id + `") {
          user_id  
          #channel_id
            received_requests{
             name
             user_id
             channel_id
             username
           }
         }
       }
  `;
  
  const response = await executeQueryOrMutation(operationsDoc , "GetMyReceivedRequests");
  return response;
}

/* VIEW MY SENT REQUESTS */
const GetMySentRequests = async function (user_id){
    const operationsDoc = `
    query GetMySentRequests {
        getUser(user_id: "` + user_id + `") {
          user_id
          channel_id
           sent_requests{
             name
             user_id
             #hannel_id
             username
           }
         }
       }
  `;
  
  const response = await executeQueryOrMutation(operationsDoc , "GetMySentRequests");
  return response;
}

const GetMySentBestFriendRequests = async function (user_id){
  const operationsDoc = `
  query GetMySentBestFriendRequests {
      getUser(user_id: "` + user_id + `") {
        user_id
        channel_id
         sent_best_friend_requests{
           name
           user_id
           username
         }
       }
     }
`;

  const response = await executeQueryOrMutation(operationsDoc , "GetMySentBestFriendRequests");
  return response;
}

const GetMyReceivedBestFriendRequests = async function (user_id){
  const operationsDoc = `
  query GetMyReceivedBestFriendRequests {

      getUser(user_id: "` + user_id + `") {
        user_id  
        #channel_id
          received_best_friend_requests{
           name
           user_id
           channel_id
           username
         }
       }
     }
`;

const response = await executeQueryOrMutation(operationsDoc , "GetMyReceivedBestFriendRequests");
return response;
}

/* SEND FRIEND REQUEST */
const SendFriendRequest = async function (my_user_id , friend_user_id){
    const operationsDoc = `mutation SendFriendRequest{
        updateUser(input: {
          filter: {
            user_id: {
              eq: "` + my_user_id + `"
            }
          }
          set: {
            sent_requests: [
              {
                user_id: "` + friend_user_id + `"
              }
            ]
          }
        }){
          user{
            user_id
            username
            name
            sent_requests{
              user_id
              username
              name
            }
          }
        }
      }
    `;
    const response = await executeQueryOrMutation(operationsDoc , "SendFriendRequest");
    return response;
}

const CancelFriendRequest = async function(user_id , friend_user_id){
    const operationsDoc = `mutation CancelFriendRequest{
        updateUser(input: {
          filter: {
            user_id: {
              eq: "` + user_id + `"
            }
          },
          remove: {
            sent_requests: [
              {
                user_id: "` + friend_user_id + `"
              }
            ]
          }
        }){
          user{
            name
            username
            friends{
              name
              username
            }
            best_friends{
              name
              username
            }
            sent_best_friend_requests{
              name
              username
            }
          }
        }
      }
    `;
    const response = await executeQueryOrMutation(operationsDoc , "CancelFriendRequest");
    return response;
}

/* SEND BEST FRIEND REQUEST */
const SendBestFriendRequest = async function (my_user_id , friend_user_id){
    const operationsDoc = `mutation SendBestFriendRequest{
        updateUser(input: {
          filter: {
            user_id: {
              eq: "` + my_user_id + `"
            }
          }
          set: {
            sent_best_friend_requests: [
              {
                user_id: "` + friend_user_id + `"
              }
            ]
          }
        }){
          user{
            user_id
            username
            name
            sent_requests{
              user_id
              username
              name
            }
          }
        }
      }
    `;
    const response = await executeQueryOrMutation(operationsDoc , "SendBestFriendRequest");
    return response;
}

const CancelBestFriendRequest = async function(user_id , friend_user_id){
    const operationsDoc = `mutation CancelBestFriendRequest{
        updateUser(input: {
          filter: {
            user_id: {
              eq: "` + user_id + `"
            }
          },
          remove: {
            sent_best_friend_requests: [
              {
                user_id: "` + friend_user_id + `"
              }
            ]
          }
        }){
          user{
            name
            username
            friends{
              name
              username
            }
            best_friends{
              name
              username
            }
            sent_best_friend_requests{
              name
              username
            }
          }
        }
      }
    `;
    const response = await executeQueryOrMutation(operationsDoc , "CancelBestFriendRequest");
    return response;
}

const AcceptFriendRequest = async function (my_user_id , friend_user_id){
    const operationsDoc = `mutation AcceptFriendRequest {
        updateUser(input: 
          {
            filter: 
            {
              user_id: 
              {
                eq: "` + my_user_id + `"
              }
            }, 
            set:{
              friends: [{
                user_id: "` + friend_user_id + `"
              }]
            },
            remove:{
              received_requests: [
                {
                    user_id: "` + friend_user_id + `"
                }
              ]
            }
          }){
            user {
            username
            name
            friends {
                username
                name
            }
            received_requests{
              username
              name
            }
         }
        }
      }
    `;
    const response = await executeQueryOrMutation(operationsDoc , "AcceptFriendRequest");
    return response;
}

const DeclineFriendRequest = async function (my_user_id , friend_user_id){
    const operationsDoc = `mutation declineFriendRequest {
        updateUser(input: 
          {
            filter: 
            {
              user_id: 
              {
                eq: "` + my_user_id + `"
              }
            }, 
            remove:{
              received_requests: [
                {
                    user_id: "` + friend_user_id + `"
                }
              ]
            }
          }){
            user {
            username
            name
            friends {
                username
                name
            }
            received_requests{
              username
              name
            }
         }
        }
      }
    `;
    const response = await executeQueryOrMutation(operationsDoc , "declineFriendRequest");
    return response;
}

const AcceptBestFriendRequest = async function (my_user_id , friend_user_id){
    const operationsDoc = `mutation AcceptBestFriendRequest {
        updateUser(input: 
          {
            filter: 
            {
              user_id: 
              {
                eq: "` + my_user_id + `"
              }
            }, 
            set:{
              best_friends: [{
                user_id: "` + friend_user_id + `"
              }]
            },
            remove:{
              received_best_friend_requests: [
                {
                    user_id: "` + friend_user_id + `"
                }
              ],
              friends: [
                {
                  user_id: "` + friend_user_id + `"
                }
              ]
            }
          }){
            user {
            username
            name
            friends {
                username
                name
            }
            received_requests{
              username
              name
            }
         }
        }
      }
    `;
    const response = await executeQueryOrMutation(operationsDoc , "AcceptBestFriendRequest");
    return response;
}

const DeclineBestFriendRequest = async function (my_user_id , friend_user_id){
    const operationsDoc = `mutation declineBestFriendRequest {
        updateUser(input: 
          {
            filter: 
            {
              user_id: 
              {
                eq: "` + my_user_id + `"
              }
            }, 
            remove:{
              received_best_friend_requests: [
                {
                    user_id: "` + friend_user_id + `"
                }
              ]
            }
          }){
            user {
            username
            name
            friends {
                username
                name
            }
            received_requests{
              username
              name
            }
         }
        }
      }
    `;
    const response = await executeQueryOrMutation(operationsDoc , "declineBestFriendRequest");
    return response;
}

const RemoveFriend = async function (my_user_id , friend_user_id){
    const operationsDoc = `mutation RemoveFriend {
        updateUser(input: 
          {
            filter: 
            {
              user_id: 
              {
                eq: "` + my_user_id + `"
              }
            }, 
            remove:{
              friends: [
                {
                    user_id: "` + friend_user_id + `"
                }
              ]
            }
          }){
            user {
            username
            name
            friends {
                username
                name
            }
            received_requests{
              username
              name
            }
         }
        }
      }
    `;
    const response = await executeQueryOrMutation(operationsDoc , "RemoveFriend");
    return response;
}

const RemoveBestFriend = async function (my_user_id , friend_user_id){
    const operationsDoc = `mutation RemoveBestFriend {
        updateUser(input: 
          {
            filter: 
            {
              user_id: 
              {
                eq: "` + my_user_id + `"
              }
            }, 
            remove:{
              best_friends: [
                {
                    user_id: "` + friend_user_id + `"
                }
              ]
            },
            set:{
              friends: [
                {
                  user_id: "` + friend_user_id + `"
                }
              ]
            }
          }){
            user {
            username
            name
            friends {
                username
                name
            }
            received_requests{
              username
              name
            }
         }
        }
      }
    `;
    const response = await executeQueryOrMutation(operationsDoc , "RemoveBestFriend");
    return response;
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
  "getMyReceivedBestFriendRequests" : GetMyReceivedBestFriendRequests,
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
  "getChannelId" : GetChannelId
}
// GetUsers("000");
// AddUser("001" , "shashank2409" , "Shashank Gupta" , "sha@gmail.com" , "no");
