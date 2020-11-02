'use strict';

const { App, ContextMissingPropertyError } = require('@slack/bolt');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const databasemodule = require('../database_workspace/userService')
// const actions = require("./routes/actionRoute/actionroute")
const { createMessageAdapter } = require('@slack/interactive-messages');
require('dotenv').config();
const slackInteractions = createMessageAdapter(process.env.SIGNING_SECRET);
let _ = require("underscore");
const express = require('express');

const express_app = express();

express_app.use('/slack/actions', slackInteractions.expressMiddleware());

express_app.post('/slack/actions', bodyParser.urlencoded({extended:false}), slackSlashCommand)

function doWork(){
  return new Promise((resolve) => setTimeout(() => resolve(1), 2));
}


function slackSlashCommand(req, res, next) {
  if (req.body.command === '/') {
    const type = req.body.text.split(' ')[0];
    res.send("message");
  } else {
    next();
  }
}


/*

slackInteractions.action({ type: 'button' }, (payload, respond) => {
    Logs the contents of the action to the console
    // console.log('payload', payload);
  
    doWork()
      .then(() => {
          // console.log("responding to button")
        respond({ text: 'Processing complete.', replace_original: true });
      })
      .catch((error) => {
          // console.log("there is an error");
        respond({ text: 'Sorry, there\'s been an error. Try again later.',  replace_original: true });
      });
  
    // Return a replacement message
      // console.log("patani kaha");
    return { text: 'Processing...' };
  });

*/



express_app.use("/users",users);

// express_app.use("/actions",actions)


express_app.post('/test', (req,res) => {
    res.send(req.body.text +' Ganda hai');
});

express_app.listen(5000, () => {
    console.log('server 5000 active');
})

const app = new App({
    token : process.env.SLACK_APP_TOKEN_ID,
    signingSecret : process.env.SIGNING_SECRET
});

app.event('app_home_opened', ({event, say}) => {
    console.log("bot started successfully");
    say(`bot here  , <@${event.user}>!`);
});

app.event('team_join', ({event,say}) => {
    console.log(event.user);
});




let usersStore = {};
async function fetchUsers() {
  try {
        const result = await app.client.users.list({
        token: process.env.SLACK_APP_TOKEN_ID
    });
    // console.log(result.members);
    let channel_result = await getChannel();
    console.log("channel results " , channel_result)
    let merged_results = _.map(result.members, function(item) {
        return _.extend(item, _.findWhere(channel_result, {user : item.id}));
    });
    // console.log("final_results", merged_results)
    saveUsers(merged_results);
  }
  catch (error) {
    // console.error(error);
  }
}
async function saveUsers(usersArray) {
    let userId = '';
    usersArray.forEach(async function(user){
        if(user.is_bot==false && user.id!=null){
            console.log("username : " , user);
            // console.log("name" , user.name);
            var temp = await databasemodule.addUser(user.user, user.name, user.real_name, "nullfornow", user.profile.image_72, user.id);
            console.log("adding user "+user.name);
        }
        userId = user["id"];
        usersStore[userId] = user;
        // console.log(user.profile.email);
    });
    // console.log(databasemodule.getUsers("UTCRXTV5L"))
}

fetchUsers();


async function getChannel() {
  try {
    const result = await app.client.conversations.list({
    token: process.env.SLACK_APP_TOKEN_ID,
    types :  "mpim, im" 
  });
  // console.log(result);
  return result.channels;
// saveUsers(result.members);
  }
  catch (error) {
  console.error(error);
}
}



(async () =>{
    await app.start(5010);
    // console.log("Bot Active at 5010");
})();

