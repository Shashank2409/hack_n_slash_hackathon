const fetch = require('node-fetch');
const { getUserWithUserId } = require('.');
const database_url = "https://melted-price.ap-south-1.aws.cloud.dgraph.io/graphql";

async function fetchGraphQL(operationsDoc, operationName, variables) {
    const result = await fetch(
      database_url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query: operationsDoc,
          variables: variables,
          operationName: operationName
        })
      }
    );
    return await result.json();
  }

  
  async function fetchGetAllUsers(operationsDoc , operationName) {
    return await fetchGraphQL(
      operationsDoc,
      operationName,
      {}
    );
  }
  
  async function executeQueryOrMutation(operationsDoc , operationName) {
    const { errors, data } = await fetchGetAllUsers(operationsDoc , operationName);
  
    if (errors) {
      // handle those errors like a pro
      console.error(errors);
      return errors;
    }
    // console.log("executing");
    // console.log(data);
    return await data;
  }


/* ADD TASK */
const AddTask = async function (title , description , deadline , user_id){
    const operationsDoc = `
    mutation AddTask{
        addTask(input:[
          {
            title : "` + title + `",
            description : "` + description + `",
            deadline : "` + deadline + `",
            posted_by : {
                user_id: "` + user_id + `", 
            },
            status : uploaded
          }
        ]){
          task{
            task_id
            title
            description
            posted_by{
                  user_id
            }
          }
        }
      }
     `;
    //  console.log(operationsDoc);
     var data = await executeQueryOrMutation(operationsDoc , "AddTask");
     return data;
 }

/* GET MY TASKS */
const GetMyTasks = async function (user_id){
    const operationsDoc = `
    query GetMyTasks {
        getUser(user_id:"`+ user_id + `") {
            active_tasks{
              task_id
              title
              description
              deadline
              volunteered_by{
                username
              }
              status
            }
        }
      }
     `;
    //  console.log(operationsDoc);
     var data = await executeQueryOrMutation(operationsDoc , "GetMyTasks");
    //  console.log(data.getUser);
     return data;
 }

 const GetMyActiveTasks = async function (user_id){
    const operationsDoc = `
    query GetMyActiveTasks {
        getUser(user_id:"`+ user_id + `") {
            active_tasks{
              title
              description
              deadline
              volunteered_by{
                username
              }
            }
        }
      }
     `;
    //  console.log(operationsDoc);
     var data = await executeQueryOrMutation(operationsDoc , "GetMyActiveTasks");
     return data;
 }

 const GetMyClosedTasks = async function (user_id){
    const operationsDoc = `
    query GetMyClosedTasks {
        getUser(user_id:"`+ user_id + `") {
            closed_tasks{
              title
              description
              deadline
              alloted_to{
                username
              }
            }
        }
      }
     `;
    //  console.log(operationsDoc);
     var data = await executeQueryOrMutation(operationsDoc , "GetMyClosedTasks");
     return data;
 }

 
 const GetFriendsActiveTasks = async function (user_id){
    const operationsDoc = `
    query GetFriendsActiveTasks {
        getUser(user_id:"`+ user_id + `") {
            friends{
                username
                active_tasks{
                  task_id
                  title
                  description
                  deadline
                }
            }
        }
      }
     `;
    //  console.log(operationsDoc);
     var data = await executeQueryOrMutation(operationsDoc , "GetFriendsActiveTasks");
     return data;
 }

 const GetBestFriendsActiveTasks = async function (user_id){
  const operationsDoc = `
  query GetBestFriendsActiveTasks {
      getUser(user_id:"`+ user_id + `") {
          best_friends{
              username
              active_tasks{
                task_id
                title
                description
                deadline
              }
          }
      }
    }
   `;
  //  console.log(operationsDoc);
   var data = await executeQueryOrMutation(operationsDoc , "GetBestFriendsActiveTasks");
   return data;
}

 const GetTasksUsingUserId = async function (user_id){
    const operationsDoc = `
    query GetTasksUsingUserId {
        getUser(user_id:"`+ user_id + `") {
            active_tasks{
                title
                description
                deadline
            }
        }
      }
     `;
    //  console.log(operationsDoc);
     var data = await executeQueryOrMutation(operationsDoc , "GetTasksUsingUserId");
     return data;
 } 

 const RemoveTask = async function (task_id){
    const operationsDoc = `
    mutation RemoveTask{
        deleteTask (filter: {
          task_id:[
            "` + task_id + `"
          ]
        }){
          msg
        }
      }
     `;
    //  console.log(operationsDoc);
     var data = await executeQueryOrMutation(operationsDoc , "RemoveTask");
     return data;
 }

 const UpdateTask = async function (task_id , title , description , deadline){
    var operationsDoc = `
    mutation UpdateTask {
        updateTask(input: 
          {
            filter: 
            {
              task_id: 
              [ 
                "` + task_id + `"
              ]               
            }, 
            set:{`;
    var count = 0;
    if(title != "")
    count++;
    if(description != "")
    count++;
    if(deadline != "")
    count++;
    if(title != ""){
        operationsDoc = operationsDoc + `title : "` + title + `"`;
        count--;
        if(count!=0){
            operationsDoc = operationsDoc + `,`;
        }
    }
    if(description != ""){
        operationsDoc = operationsDoc + `description : "` + description + `"`;
        count--;
        if(count!=0){
            operationsDoc = operationsDoc + `,`;
        }
    }
    if(deadline != ""){
        operationsDoc = operationsDoc + `deadline : "` + deadline + `"`;
        count--;
        if(count!=0){
            operationsDoc = operationsDoc + `,`;
        }
    }
    operationsDoc = operationsDoc + `}
        }){
            task{
                title
                description
                deadline
                alloted_to{
                username
                }
            }
        }
        }`;
       
    //  console.log(operationsDoc);
     var data = await executeQueryOrMutation(operationsDoc , "UpdateTask");
     return data;
 }

 const VolunteerTask = async function(task_id , user_id){
    const operationsDoc = `mutation VolunteerTask{
      updateTask(input: {
        filter: {
          task_id: [
            "` + task_id + `"
          ]
        },
        set:{ 
          volunteered_by:[
            {user_id: "` + user_id +`"}
          ]
        }
      }){
        task{
          volunteered_by{
            user_id
          }
        }
      }
    }`;
    var data = await executeQueryOrMutation(operationsDoc , "VolunteerTask");
    return data;
 }

 const BackoutFromTask = async function(task_id , user_id){
    const operationsDoc = `mutation BackoutFromTask{
      updateTask(input: {
        filter: {
          task_id: [
            "` + task_id + `"
          ]
        },
        remove: {
          volunteered_by: [
            {user_id: "` + user_id + `"}
          ]
        }
      }){
        task{
          volunteered_by{
            user_id
          }
        }
      }
    }`;
    var data = await executeQueryOrMutation(operationsDoc , "BackoutFromTask");
     return data;
}

 const ViewVolunteeredTasks = async function(user_id){
    const operationsDoc = `query ViewVolunteeredTasks{
      getUser(user_id: "` + user_id +`"){
        volunteered_tasks{
          task_id
          title
          description
          volunteered_by{
            username
            name
          }
          alloted_to{
            username
            name
          }
          status
        }
      }
    }
    `;   
    var data = await executeQueryOrMutation(operationsDoc , "ViewVolunteeredTasks");
     return data;
}

 const UpdateTaskStatus = async function (task_id , TaskStatus){
    var operationsDoc = `
    mutation UpdateTaskStatus {
        updateTask(input: 
          {
            filter: 
            {
              task_id: 
              [ 
                "` + task_id + `"
              ]               
            }, 
            set:{
                status : ` + TaskStatus + `
            }
        }){
            task{
                title
                description
                deadline
                alloted_to{
                  username
                }
                status
            }
        }
        }`;
       
    //  console.log(operationsDoc);
     var data = await executeQueryOrMutation(operationsDoc , "UpdateTaskStatus");
     return data;
 }

 const ViewTaskStatusUsingTaskId = async function (task_id){
    var operationsDoc = `query ViewTaskStatusUsingTaskId{
        getTask(task_id: "` + task_id + `"){
          status
        }
      }
    `;
       
    //  console.log(operationsDoc);
     var data = await executeQueryOrMutation(operationsDoc , "ViewTaskStatusUsingTaskId");
     return data;
 }

 const AssignTask = async function (task_id , alloted_user_id){
    var operationsDoc = `mutation AssignTask{
        updateUser(input: {
            filter: {
              user_id: {
                eq: "` + alloted_user_id + `"
              }
            }
            set: {
              assigned_tasks: [
                {
                  task_id: "` + task_id + `"
                }
              ]
            }
          }){
            user{
              user_id
              username
              name
              assigned_tasks{
                task_id
                title
                description
              }
            }
          }
      }
    `;
       
    //  console.log(operationsDoc);
     var data = await executeQueryOrMutation(operationsDoc , "AssignTask");
     return data;
 }

 const ViewAssignedTasks = async function (user_id){
    var operationsDoc = `query ViewAssignedTasks{
        getUser(user_id: "` + user_id + `"){
            assigned_tasks{
                title
                description
                deadline
              }
        }
      }
    `;
    //  console.log(operationsDoc);
     var data = await executeQueryOrMutation(operationsDoc , "ViewAssignedTasks");
     return data;
 }

 const ViewVolunteers = async function(task_id){
    const operationsDoc = `query ViewVolunteers{
      getTask(task_id : "` + task_id + `"){
        title
        volunteered_by{
          user_id
          username
          name
          profile_picture
        }
      }
    }
    `;
    var data = await executeQueryOrMutation(operationsDoc , "ViewVolunteers");
    return data;
}
// GetMyTasks("002");
// UpdateTaskStatus("0x5","assigned");
// GetMyTasks("002");

module.exports = {
  "addTask" : AddTask,
  "getMyTasks" : GetMyTasks,
  "getMyActiveTasks" : GetMyActiveTasks,
  "getMyClosedTasks" : GetMyClosedTasks,
  "getFriendsActiveTasks" : GetFriendsActiveTasks,
  "getBestFriendsActiveTasks" : GetBestFriendsActiveTasks,
  "getTasksUsingUserId" : GetTasksUsingUserId,
  "removeTask" : RemoveTask,
  "assignTask" : AssignTask,
  "viewTaskStatusUsingTaskId" : ViewTaskStatusUsingTaskId,
  "viewVolunteeredTasks" : ViewVolunteeredTasks,
  "backoutFromTask" :  BackoutFromTask,
  "volunteerTask" :  VolunteerTask,
  "updateTask" :  UpdateTask,
  "viewAssignedTasks" : ViewAssignedTasks,
  "viewVolunteers" : ViewVolunteers
 };
