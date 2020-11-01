module.exports = function (){
    return {
            "type": "modal",
            "callback_id":"interactive-submit",
            "title": {
                "type": "plain_text",
                "text": "Add a Task"
            },
            "submit": {
                "type": "plain_text",
                "text": "Send"
            },
            "blocks": [
                {
                    "type": "input",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "title",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "For example : 'Bring a pen'"
                        }
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Title"
                    }
                },
                {
                    "type": "input",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "deadline",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "5PM, 2nd November 2010"
                        }
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Deadline"
                    }
                },
                {
                    "type": "input",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "description",
                        "multiline": true,
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Try to keep it as descriptive as you can"
                        }
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Description"
                    }
                }
            ]
        }
    
    
    
}

