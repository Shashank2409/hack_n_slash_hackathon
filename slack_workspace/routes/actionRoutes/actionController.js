require('dotenv').config();

const buttonBuilder = require('../../src/buttonBuilder');
const dbUserModules = require('../../../database_workspace/userService');
const dbmodule = require('../../../database_workspace/userService');
const dbTaskModule = require('../../../database_workspace/taskService');
const volunteerList = require('../../src/users_src/create_volunteer_list');
const {WebClient} = require('@slack/web-api');
const create_user_object = require('../../src/users_src/create_user_object');

const web = new WebClient(process.env.SLACK_APP_TOKEN_ID);

module.exports = async (req_body) => {
    console.log("req body", req_body);
    // console.log("message", req_body.original_message);

    let valueOfAction = req_body.actions[0].value;
    let userID1 = req_body.user.id;
    console.log(valueOfAction);
    let userID2 = valueOfAction.split(" ")[1];
    console.log("req_body",req_body);
    const attachmentID = req_body.attachment_id;
    let reply = req_body.original_message;
    console.log(userID1, userID2);
    // console.log("initial:",reply.attachments[0].fields);
    if(valueOfAction.split(" ")[0] === "viewVolunteers"){
        /**userID1 is posted_by_user_id and UserID2 is the Task ID  */

        // console.log(userID1, console.log(userID2));


        let actionNew = await dbTaskModule.viewVolunteers(userID2);
        delete reply.attachments[attachmentID-1].actions;
        let obj = {
            "buttons" : [],
            "user_id" : userID2
        }
        let volunteers = actionNew.getTask.volunteered_by;
        if(volunteers.length === 0){
            return reply;
        }else{
            let payload = {
                "attachments" :[]
            }
            let count=0;
            for(user of volunteers){
                console.log(user);
                payload.attachments.push(...volunteerList(user, userID2,count));
                count+=1;
            }
            // let payload = volunteerList(volunteers);
            // console.log(payload);
            return payload;
        }
    };
    if(valueOfAction.split(" ")[0] === "assignTask"){
        /**userID1 is posted_by_user_id and UserID2 is the Task ID  */
        let task_id = valueOfAction.split(" ")[2];
        let assigned_user_id = valueOfAction.split(" ")[1];
        let actionNew = await dbTaskModule.assignTask(task_id, assigned_user_id);
        console.log(actionNew);
        delete reply.attachments[attachmentID-1].actions;
        reply.attachments[attachmentID-1].footer = `This user has been alloted the task. \nText <@${assigned_user_id}>`
        let channelID_friend = await dbUserModules.getChannelId(assigned_user_id);
        channelID_friend = channelID_friend.getUser.channel_id;
        web.chat.postMessage({
            channel : channelID_friend,
            text : `Duty Calls.! Your Friend <@${userID1}> trusts you the most with this task. Contact <@${userID1}> ASAP.`
        })
        return reply;
    }

    if(valueOfAction.split(" ")[0] === "volunteerTask"){
        console.log(userID1, userID2);
        await dbTaskModule.volunteerTask(userID2, userID1);
        console.log("volunteering action done");
        console.log(reply.attachments[attachmentID-1])
        let task_owner = reply.attachments[attachmentID-1].fields[3].value;
        delete reply.attachments[attachmentID-1].actions;
        reply.attachments[attachmentID-1].footer = `Thanks for Volunteering. \nStart Conversation ${task_owner}`;
        task_owner = task_owner.substr(2,task_owner.length-3);
        console.log(task_owner);
        let channelID_friend = await dbUserModules.getChannelId(task_owner);
        console.log(channelID_friend);
        channelID_friend = channelID_friend.getUser.channel_id;
        web.chat.postMessage({
            channel : channelID_friend,
            text : `Yayy.! Your friends are there to have your back.\n Check all volenteered tasks by /list-my-tasks`
        })
        console.log("final reply")
        return reply;
    }


    if(valueOfAction.split(" ")[0] === "sendFriendRequest"){
        let actionNew = await dbUserModules.sendFriendRequest(userID1, userID2);
        console.log("reply1", req_body);
        delete reply.attachments[attachmentID-1].actions;
        let obj = {
            "buttons" : actionNew,
            "user_id" : userID2
        }
        let channelID_friend = await dbUserModules.getChannelId(userID2);
        channelID_friend = channelID_friend.getUser.channel_id;
        web.chat.postMessage({
            channel : channelID_friend,
            text : `You have a new friend request from <@${userID1}>\nMake some friends by accepting friend requests\n Access Friend Requests using /list-received-friend-requests `
        })
        reply.attachments[attachmentID-1].actions = buttonBuilder(obj);
        console.log("here")
        return reply;
    }

    if(valueOfAction.split(" ")[0] === "cancelFriendRequest"){
        let actionNew = await dbUserModules.cancelFriendRequest(userID1, userID2);
        console.log("reply1", reply.attachments);
        delete reply.attachments[attachmentID-1].actions;
        let obj = {
            "buttons" : actionNew,
            "user_id" : userID2
        }
        reply.attachments[attachmentID-1].actions = buttonBuilder(obj);
        console.log("reply2", reply.attachments);
        console.log(":cancel")
        return reply;
    }

    if(valueOfAction.split(" ")[0] === "acceptFriendRequest"){
        let actionNew = await dbUserModules.acceptFriendRequest(userID1, userID2);
        console.log("reply1", reply.attachments);
        delete reply.attachments[attachmentID-1].actions;
        let obj = {
            "buttons" : actionNew,
            "user_id" : userID2
        }
        reply.attachments[attachmentID-1].actions = buttonBuilder(obj);
        let channelID_friend = await dbUserModules.getChannelId(userID2);
        channelID_friend = channelID_friend.getUser.channel_id;
        web.chat.postMessage({
            channel : channelID_friend,
            text : `Wohooo.!! <@${userID1}> accepted your Friend Request`
        })
        console.log("reply2", reply.attachments);
        return reply;
    }

    if(valueOfAction.split(" ")[0] === "declineFriendRequest"){
        let actionNew = await dbUserModules.declineFriendRequest(userID1, userID2);
        console.log("reply1", reply.attachments);
        delete reply.attachments[attachmentID-1].actions;
        let obj = {
            "buttons" : actionNew,
            "user_id" : userID2
        }
        reply.attachments[attachmentID-1].actions = buttonBuilder(obj);
        console.log("reply2", reply.attachments);
        return reply;
    }

    if(valueOfAction.split(" ")[0] === "removeFriend"){
        let actionNew = await dbUserModules.removeFriend(userID1, userID2);
        console.log("reply1", reply.attachments);
        delete reply.attachments[attachmentID-1].actions;
        let obj = {
            "buttons" : actionNew,
            "user_id" : userID2
        }
        reply.attachments[attachmentID-1].actions = buttonBuilder(obj);
        console.log("reply2", reply.attachments);
        console.log("here");
        return reply;
    }

    if(valueOfAction.split(" ")[0] === "sendBestFriendRequest"){
        let actionNew = await dbUserModules.sendBestFriendRequest(userID1, userID2);
        console.log("reply1", reply.attachments);
        delete reply.attachments[attachmentID-1].actions;
        let obj = {
            "buttons" : actionNew,
            "user_id" : userID2
        }
        let channelID_friend = await dbUserModules.getChannelId(userID2);
        channelID_friend = channelID_friend.getUser.channel_id;
        web.chat.postMessage({
            channel : channelID_friend,
            text : `Woah, Seems like <@${userID1}> might think of you as a Best Friend'.\nMake some strong connections by accepting BEST Friend Requests\n Access Friend Requests using /list-best-friend-tasks ` 
        })
        reply.attachments[attachmentID-1].actions = buttonBuilder(obj);
        console.log("reply2", reply.attachments);
        return reply;
    }

    if(valueOfAction.split(" ")[0] === "acceptBestFriendRequest"){
        let actionNew = await dbUserModules.acceptBestFriendRequest(userID1, userID2);
        console.log("reply1", reply.attachments);
        delete reply.attachments[attachmentID-1].actions;
        let obj = {
            "buttons" : actionNew,
            "user_id" : userID2
        }
        let channelID_friend = await dbUserModules.getChannelId(userID2);
        channelID_friend = channelID_friend.getUser.channel_id;
        web.chat.postMessage({
            channel : channelID_friend,
            text : `Hurrayy.! You have more more person to count on. <@${userID1}> and You are now Best Friends` 
        })
        reply.attachments[attachmentID-1].actions = buttonBuilder(obj);
        console.log("reply2", reply.attachments);
        return reply;
    }

    if(valueOfAction.split(" ")[0] === "declineBestFriendRequest"){
        let actionNew = await dbUserModules.declineBestFriendRequest(userID1, userID2);
        console.log("reply1", reply.attachments);
        delete reply.attachments[attachmentID-1].actions;
        let obj = {
            "buttons" : actionNew,
            "user_id" : userID2
        }
        reply.attachments[attachmentID-1].actions = buttonBuilder(obj);
        console.log("reply2", reply.attachments);
        return reply;
    }

    if(valueOfAction.split(" ")[0] === "removeBestFriend"){
        let actionNew = await dbUserModules.removeBestFriend(userID1, userID2);
        console.log("reply1", reply.attachments);
        delete reply.attachments[attachmentID-1].actions;
        let obj = {
            "buttons" : actionNew,
            "user_id" : userID2
        }
        reply.attachments[attachmentID-1].actions = buttonBuilder(obj);
        console.log("reply2", reply.attachments);
        return reply;
    }

    if(valueOfAction.split(" ")[0] === "cancelBestFriendRequest"){
        let actionNew = await dbUserModules.cancelBestFriendRequest(userID1, userID2);
        console.log("reply1", reply.attachments);
        delete reply.attachments[attachmentID-1].actions;
        let obj = {
            "buttons" : actionNew,
            "user_id" : userID2
        }
        reply.attachments[attachmentID-1].actions = buttonBuilder(obj);
        console.log("reply2", reply.attachments);
        return reply;
    }
} 