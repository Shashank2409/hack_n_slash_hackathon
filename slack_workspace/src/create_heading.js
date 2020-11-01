module.exports = function (heading){
    return [{
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": heading
            }
        },
        {
            "type": "divider"
        }];
}
