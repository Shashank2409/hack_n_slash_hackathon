const buttonBuilder = require('../buttonBuilder');

module.exports = function (details , posted_by , count){
    console.log("details " , details);
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
                },
				{
                    "title": "Posted By",
                    "value": `<@${posted_by}>`,
                    "short": false
                }
            ],
			"actions" : [
                {
                    "type" : "button",
                    "text": "Volunteer for this task",
                    "name" : "volunteerTask",
                    "value" : "volunteerTask" + " " + details.task_id,
                    "style" : "primary",
                    "action" : "volunteerTask"
                }
            ]
    }] 
}