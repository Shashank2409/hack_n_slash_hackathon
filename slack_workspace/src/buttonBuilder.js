module.exports = (details) => {
    const buttons = details.buttons;
    console.log(buttons);
    let button, obj=[] , count = 0;
    for(button of buttons){
        var color;
        if(button.action == "acceptFriendRequest" || button.action == "acceptBestFriendRequest"){
            color = "primary";
        }
        else if(button.action == "cancelFriendRequest" || button.action == "sendFriendRequest" || button.action == "sendBestFriendRequest"){
            color = "default";
        }
        else{
            color = "danger";
        }
        obj.push({
                "name": "accept_tos",
                "text": button.name,
                "type": "button",
                "value": button.action +" "+ details.user_id,
                "style": color
        })
    }
    return obj;
}