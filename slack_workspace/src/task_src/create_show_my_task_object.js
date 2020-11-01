module.exports = function (details,count){
    // console.log("details " , details);
    return [{
            "fallback": "Task not found. Sorry.",
			"callback_id" : "task_button", 
            "color": (count%2 == 0)?"#FC766A":"#5B84B1",
            "fields": [
                {
                    "title": "Title",
                    "value": details.title,
                    "short": false
                },
				{
                    "title": "Description",
                    "value": details.description,
                    "short": false
                },
				{
                    "title": "Deadline",
                    "value": details.deadline,
                    "short": false
                }
            ],
            "actions" : [
                {
                    "type" : "button",
                    "text": "View Friends who volunteered",
                    "name" : "viewVolunteers",
                    "value" : "viewVolunteers" + " " + details.task_id,
                    "style" : "primary",
                    "action" : "viewVolunteers"
                }
            ]
    }] 
}