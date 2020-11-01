
const NextButton = async function(current_button){
    var buttons = [];
    if(current_button == "removeFriend"){
        buttons = [
            {
                "name" : "Send Friend Request",
                "action" : "sendFriendRequest"
            }];
    }
    else if(current_button == "removeBestFriend"){
        buttons = [{
                "name" : "Remove from Friends",
                "action" : "removeFriend"
            },
            {
                "name" : "Send Best Friend Request",
                "action" : "sendBestFriendRequest"
            }
        ];
    }
    else if(current_button == "sendBestFriendRequest"){
        buttons = [{
            "name" : "Cancel Best Friend Request",
            "action" : "cancelBestFriendRequest"
        }];
    }
    else if(current_button == "cancelFriendRequest"){
        buttons = [
            {
                "name" : "Send Friend Request",
                "action" : "sendFriendRequest"
            }];
    }
    else if(current_button == "acceptFriendRequest"){
        buttons = [{
                "name" : "Remove from Friends",
                "action" : "removeFriend"
            },
            {
                "name" : "Send Best Friend Request",
                "action" : "sendBestFriendRequest"
            }
        ];
    }
    else if(current_button == "declineFriendRequest"){
        buttons = [
            {
                "name" : "Send Friend Request",
                "action" : "sendFriendRequest"
            }];
    }
    else if(current_button == "cancelBestFriendRequest"){
        buttons = [{
                "name" : "Remove from Friends",
                "action" : "removeFriend"
            },
            {
                "name" : "Send Best Friend Request",
                "action" : "sendBestFriendRequest"
            }
        ];
    }
    else if(current_button == "acceptBestFriendRequest"){
        buttons = [{
            "name" : "Remove from Best Friends",
            "action" : "removeBestFriend"
        }];
    }
    else if(current_button == "declineBestFriendRequest"){
        buttons = [{
                "name" : "Remove from Friends",
                "action" : "removeFriend"
            },
            {
                "name" : "Send Best Friend Request",
                "action" : "sendBestFriendRequest"
            }
        ];
    }
    else if(current_button == "sendFriendRequest"){
        buttons = [{
            "name" : "Cancel Friend Request",
            "action" : "cancelFriendRequest"
        }];
    }
    return buttons;
}

module.exports = {
    "nextButton" :  NextButton
};