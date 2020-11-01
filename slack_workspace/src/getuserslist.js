let usersStore = {};
async function fetchUsers() {
  try {
        const result = await app.client.users.list({
        token: process.env.SLACK_BOT_TOKEN
    });

    saveUsers(result.members);
  }
  catch (error) {
    console.error(error);
  }
}
function saveUsers(usersArray) {
  let userId = '';
  usersArray.forEach(function(user){
    userId = user["id"];
    usersStore[userId] = user;
    console.log(user);
  });
}

fetchUsers();