const create_user_object = require("../src/users_src/create_user_object");
const create_heading = require("../src/create_heading");
const dbmodule = require("../../database_workspace/userService");


module.exports = {
    "usermethod" : async (req,res,next) =>{
        console.log(req.body);
        let search_name = req.body.text;
        let search_results_name = await dbmodule.searchUserWithName(req.body.user_id, search_name);
        // console.log("search_use" ,search_results)
        // let search_results_name = search_results.queryUser;
        // console.log("search_user_name",search_results_name)
        let heading = `Search results for ${search_name} from <@${req.body.user_name}>`;
        console.log(heading)
        let message = {
            "blocks": []
        };

        message["blocks"].push(...create_heading(heading));
        var user;
        for(user of search_results_name){
            message["blocks"].push(...create_user_object(user));
        }
        
        console.log(message);

        console.log(`Search results for ${search_name}`);
        res.send(message);
    },

    "allUserMethod" : async (req, res, next) => {
        let search_results = dbmodule.getUsers();
        let search_results_name = search_results.queryUser;

        let heading = `List of All Users`;
        let message = {
            "blocks": []
        };

        message["blocks"].push(...create_heading(heading));
        var user;
        for(user of search_results_name){
            message["blocks"].push(...create_user_object(user));
        }
        
        console.log(message);

        console.log(`Search results for ${search_name}`);
        res.send(message);
    },

    "allFriendsMethod" : async (req, res, next) => {
        let main_user = req.body.user;
        let heading = `Fiends of <@${main_user}>`;
        let message = {"blocks" :[]};

        message["blocks"].push(...create_heading(heading));
        // search for user here;
        /*
        let search_results = dbmodule.functionnamehere(user);
        search_results_name = search_results.queryuser;

        var user;
        for(user of search_results_name){
            message["blocks"].push(...create_user_object(user));
        }
        */

        res.send(message);
    }
}