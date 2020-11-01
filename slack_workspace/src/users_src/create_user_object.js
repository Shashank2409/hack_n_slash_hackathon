const buttonBuilder = require('../buttonBuilder');

module.exports = function (details){
    console.log("details " , details);
    return [{
            "text": `${details.name}` + `\n<@${details.username}>`,
			"thumb_url" : details.profile_picture ,
            "fallback": "Unable to search user",
            "callback_id": "user_button",
            "color": "#000000", 
            "attachment_type": "default",
            "actions" : buttonBuilder(details)
        } 
    ]
}