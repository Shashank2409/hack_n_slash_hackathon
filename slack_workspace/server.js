require('dotenv').config();

const {createServer} = require('http');
const express = require('express');
const {createMessageAdapter} = require('@slack/interactive-messages');
const {createEventAdapter} = require('@slack/events-api');
const {WebClient} = require('@slack/web-api');
const dbmodule = require('../database_workspace/taskService.js');
const dbmoduleUser = require('../database_workspace/userService');
const axios = require('axios');
const bodyParser = require('body-parser');
const { response } = require('express');
const controller = require('./routes/controller');
const slackSlashController = require('./routes/slashCommand/slashController');
const actionController = require('./routes/actionRoutes/actionController');
const taskPayload = require('./src/task_src/create_show_task_object');
const { Console } = require('console');

// Creating adapters
const slackSigningSecret = process.env.SIGNING_SECRET;
const slackAccessToken = process.env.SLACK_APP_TOKEN_ID;

const slackEvents = createEventAdapter(slackSigningSecret, {
    includeBody : true
});
const slackInteraction = createMessageAdapter(slackSigningSecret);
const web = new WebClient(slackAccessToken);

const express_app = express();

//Attaching adapter
express_app.use('/slack/events', slackEvents.expressMiddleware());
express_app.use('/slack/actions', slackInteraction.expressMiddleware());
                 
//slashcommand Handler
express_app.post('/slack/commands', bodyParser.urlencoded({extended: false}), slackSlashController);


slackEvents.on('error', (error) => {
    console.log(error.name);
});

slackEvents.on('message',(message, body) => {
    if(body.event.hasOwnProperty('client_msg_id')){
        console.log("message => ", message);
        console.log("body => ", body);
        (async () => {
            console.log("inside async function");
            try{
            const res =await web.chat.postMessage({
                channel: message.channel,
                text : `message wapas aagya`
            });
            console.log(res);
            }
            catch(error){
                console.error();
            }
        })();
    }
});

//Slack Interactive message handlers
slackInteraction.action('user_button', async (message, respond)=> {
    console.log("user button clicked");
    const reply = await actionController(message);
    return reply;
});

slackInteraction.action('task_button', async (message, respond)=> {
    // console.log("message" , message);
    const reply = await actionController(message);
    return reply;
})


slackInteraction.viewSubmission({callbackId: 'interactive-submit'}, async(message, respond) => {
    // console.log("message", message);
    console.log("object");
    let object = {
        "user_id" : message.user.id
    };
    let vals = message.view.state.values;
    for(diffvalue in vals){
        for(types in vals[diffvalue]){
            object[types] = vals[diffvalue][types].value;
        }
    }
    console.log(object);
    const task_details = await dbmodule.addTask(object.title, object.description, object.deadline, object.user_id);
    object.task_id = task_details.addTask.task[0].task_id; 
    console.log("task details",task_details)
    let friends = await dbmoduleUser.getMyFriends(message.user.id);
    console.log(friends);
    if(friends.length != 0){
        for(friend of friends){
            console.log(friend);
            web.chat.postMessage({
                channel : friend.channel_id,
                text : "Task Initialized",
                attachments : taskPayload(object, object.user_id, 0)
            });
        }
    }

    return {
        "response_action": "clear"
      }
});


slackInteraction.action('sendFriendRequest U01AJCWA5HT', (message, response) => {
    console.log('payload',message);
    const reply = message.original_message;
    delete reply.attachments[0].actions[0];
    console.log(reply);
    return reply;
});

const server = createServer(express_app);
server.listen(3000, () => {
    console.log("Connected to port 3000");
})