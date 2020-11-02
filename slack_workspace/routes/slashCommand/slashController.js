require('dotenv').config();

const create_heading = require('../../src/create_heading');
const create_user_object = require('../../src/users_src/create_user_object');
const create_task_object = require('../../src/task_src/create_task_object');
const create_show_task_object = require('../../src/task_src/create_show_task_object');
const create_show_my_task_object = require('../../src/task_src/create_show_my_task_object');
const {WebClient} = require('@slack/web-api');
const { App, LogLevel } = require("@slack/bolt"); 
const dbmodule = require('../../../database_workspace/userService')
const dbTaskModule = require('../../../database_workspace/taskService')

const app = new App({
  token: process.env.SLACK_APP_TOKEN_ID,
  signingSecret: process.env.SIGNING_SECRET,
  // LogLevel can be imported and used to make debugging simpler
  logLevel: LogLevel.DEBUG
});


const  web = new WebClient(process.env.SLACK_APP_TOKEN_ID);



module.exports = async (req, res, next) => {
    if(req.body.command === '/search-user'){
        let query = req.body.text;
        console.log("body",req.body);
        let search_response = await dbmodule.searchUserWithName(req.body.user_id, query);
        let heading = `Search results for ${query} from <@${req.body.user_id}>`;
        console.log("search_user");
        let message = {
            "text": heading,
            "response_type" : 'in_channel', 
            "attachments" : []
        };
        console.log(search_response)
        let user;
        for(user of search_response){
            console.log("user", user)
            if(user.user_id != req.body.user_id){ 
                message.attachments.push(...create_user_object(user));
            }
        }
        console.log(message);
        console.log("here");
        res.send(message);
    }
    else if(req.body.command === '/list-friends'){
        let search_response = await dbmodule.getMyFriends(req.body.user_id);
        console.log(req.body.user_name , " user");
        let heading = `My Friends' List`;
        // search_response = await search_response.getUser.friends;
        if(search_response.length == 0){
            heading = `No friend in Friend List`;
        }
        let message = {
            "text": heading,
            "response_type" : 'in_channel', 
            "attachments" : []
        };

        message.attachments.push(...create_heading(heading));
        let user;
        for(user of search_response){
            message.attachments.push(...create_user_object(user));
        }
        console.log("message" , message);
        res.send(message);
    }

    else if(req.body.command === '/list-best-friends'){
        let search_response = await dbmodule.getMyBestFriends(req.body.user_id);
        console.log("search response" , search_response);
        console.log(req.body.user_name , " user");
        let heading = `My Best Friend List`;
        // search_response = await search_response.getUser.friends;
        if(search_response.length == 0){
            heading = `No Best Friend in Friends' List`;
        }
        let message = {
            "text": heading,
            "response_type" : 'in_channel', 
            "attachments" : []
        };

        message.attachments.push(...create_heading(heading));
        let user;
        for(user of search_response){
            message.attachments.push(...create_user_object(user));
        }
        console.log("message" , message);
        res.send(message);
    }

    else if(req.body.command === '/add-task'){
        // let heading = `Add your new task here`;
        // let message = {
        //     "blocks" : []
        // };
        // message.blocks.push(...create_heading(heading));
        console.log(req.body);
        res.send("Insert Task Details");
        let message = await create_task_object();
        try{
        const result = await app.client.views.open({
            // The token you used to initialize your app is stored in the `context` object
            token: process.env.SLACK_APP_TOKEN_ID,
            trigger_id: req.body.trigger_id,
            view: message
          });
      
          console.log(result);
        }
        catch(error){
            console.log(error.ressponse_metadata);
        }
    }
    else if(req.body.command === '/list-friends-task'){
        let search_response = await dbTaskModule.getFriendsActiveTasks(req.body.user_id);
        let heading = `Tasks of your friends`;
        if(search_response.length == 0){
            heading = `No active tasks of your friends'`;
        }

        let message = {
            "text": heading,
            "response_type" : 'in_channel', 
            "attachments" : []
        };

        message.attachments.push(...create_heading(heading));
        let task;
        var count = 0;
        for(user of search_response){
            active_tasks = await user.active_tasks;
            posted_by = await user.username;
            for(task of active_tasks){
                message.attachments.push(...create_show_task_object(task , posted_by , count));
            }
            count++;
        }
        
        res.send(message);
    }

    else if(req.body.command === '/list-my-tasks'){
        let search_response = await dbTaskModule.getMyTasks(req.body.user_id);
        let heading = `Your Tasks`;
        if(search_response.length == 0){
            heading = `You have no active tasks`;
        }

        let message = {
            "text": heading,
            "response_type" : 'in_channel', 
            "attachments" : []
        };
        search_response = await search_response.getUser.active_tasks;
        message.attachments.push(...create_heading(heading));
        let task;
        var count = 0;
        for(task of search_response){
            // console.log("aa raha hai");
            message.attachments.push(...create_show_my_task_object(task,count));
            count++;
        }
        
        res.send(message);
    }

    else if(req.body.command === '/list-best-friend-tasks'){
        console.log("ria check");
        let search_response = await dbTaskModule.getBestFriendsActiveTasks(req.body.user_id);
        let heading = `Tasks of your Best friends`;
        if(search_response.length == 0){
            heading = `No active tasks of your Best friends'`;
        }

        let message = {
            "text": heading,
            "response_type" : 'in_channel', 
            "attachments" : []
        };
        console.log(search_response,"00000");
        message.attachments.push(...create_heading(heading));
        let task;
        var count = 0;
        for(user of search_response){
            active_tasks = await user.active_tasks;
            posted_by = await user.username;
            for(task of active_tasks){
                message.attachments.push(...create_show_task_object(task , posted_by , count));
            }
            count++;
        }
        
        res.send(message);
    }

    else if(req.body.command === '/list-received-friend-requests'){
        let search_response = await dbmodule.getMyReceivedRequests(req.body.user_id);
        let heading = `Received Friend Requests`;
        if(search_response.length == 0){
            heading = `No received friend requests`;
        }

        let message = {
            "text": heading,
            "response_type" : 'in_channel', 
            "attachments" : []
        };
        search_response = await search_response;
        message.attachments.push(...create_heading(heading));
        var count = 0;
        for(user of search_response){
            message.attachments.push(...create_user_object(user));
            count++;
        }
        res.send(message);
    }

    else if(req.body.command === '/list-sent-friend-requests'){
        let search_response = await dbmodule.getMySentRequests(req.body.user_id);
        let heading = `Sent Friend Requests`;
        if(search_response.length == 0){
            heading = `No sent friend requests`;
        }

        let message = {
            "text": heading,
            "response_type" : 'in_channel', 
            "attachments" : []
        };
        search_response = await search_response;
        message.attachments.push(...create_heading(heading));
        var count = 0;
        for(user of search_response){
            message.attachments.push(...create_user_object(user));
            count++;
        }
        res.send(message);
    }

    else if(req.body.command === '/list-received-friend-requests'){
        let search_response = await dbmodule.getMyReceivedRequests(req.body.user_id);
        let heading = `Received Friend Requests`;
        if(search_response.length == 0){
            heading = `No received friend requests`;
        }

        let message = {
            "text": heading,
            "response_type" : 'in_channel', 
            "attachments" : []
        };
        search_response = await search_response;
        message.attachments.push(...create_heading(heading));
        var count = 0;
        for(user of search_response){
            message.attachments.push(...create_user_object(user));
            count++;
        }
        res.send(message);
    }

    else if(req.body.command === '/list-sent-friend-requests'){
        let search_response = await dbmodule.getMySentRequests(req.body.user_id);
        let heading = `Sent Friend Requests`;
        if(search_response.length == 0){
            heading = `No sent friend requests`;
        }

        let message = {
            "text": heading,
            "response_type" : 'in_channel', 
            "attachments" : []
        };
        search_response = await search_response;
        message.attachments.push(...create_heading(heading));
        var count = 0;
        for(user of search_response){
            message.attachments.push(...create_user_object(user));
            count++;
        }
        res.send(message);
    }
    
    else if(req.body.command === '/list-sent-bf-requests'){
        let search_response = await dbmodule.getMySentBestFriendRequests(req.body.user_id);
        let heading = `Sent Best Friend Requests`;
        if(search_response.length == 0){
            heading = `No sent Best friend requests`;
        }

        let message = {
            "text": heading,
            "response_type" : 'in_channel', 
            "attachments" : []
        };
        search_response = await search_response;
        message.attachments.push(...create_heading(heading));
        var count = 0;
        for(user of search_response){
            message.attachments.push(...create_user_object(user));
            count++;
        }
        res.send(message);
    }

    else if(req.body.command === '/list-received-bf-requests'){
        let search_response = await dbmodule.getMyReceivedBestFriendRequests(req.body.user_id);
        let heading = `Received Best Friend Requests`;
        if(search_response.length == 0){
            heading = `No Received Best friend requests`;
        }

        let message = {
            "text": heading,
            "response_type" : 'in_channel', 
            "attachments" : []
        };
        search_response = await search_response;
        message.attachments.push(...create_heading(heading));
        var count = 0;
        for(user of search_response){
            message.attachments.push(...create_user_object(user));
            count++;
        }
        res.send(message);
    }
    else if(req.body.command === '/help'){
        res.send({
            "text": "Heya.!! You are new here. Try the following commands out",
            "attachments": [
                {
                    "text": "/help - To search all the commands\n\n/search-user <name> - Search user with a name\n\n/list-sent-friend-requests - List all your sent friend requests\n\n/list-received-friend-requests - List all your received friend requests\n\n/list-friends - List all your registered friends\n\n/list-sent-bf-requests - List all your sent best friend requests\n\n/list-received-bf-requests - List your received best friend requests\n\n/list-best-friends - List all your registered Best Friend requests\n\n/add-task - Open a form for adding a task\n\n/list-my-tasks - List all you pending tasks\n\n/list-friends-tasks - List all the pending tasks posted by your friends\n\n/list-best-friends-tasks - List all the pending tasks posted by your Best Friends"
                }
            ]
        });
    }
}