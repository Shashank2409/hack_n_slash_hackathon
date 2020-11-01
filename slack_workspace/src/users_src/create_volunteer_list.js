module.exports = function (details,taskID,count=0){
    // console.log("details " , details);
    return [{
        "fallback": "User not found. Sorry.",
        "callback_id" : "task_button", 
        "color": (count%2 == 0)?"#FC766A":"#5B84B1",
        "fields": [
            {
                "title": "Username",
                "value": details.username
            },
            {
                "title": "Name",
                "value": details.name
            }
        ],
        "actions" : [
            {
                "name": "assignTask",
                "text": "Assign Task",
                "type": "button",
                "value": "assignTask" + " " + details.user_id+" "+taskID
            }
        ]
    }] 
}