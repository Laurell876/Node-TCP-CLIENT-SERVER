const readline = require("readline-sync");
const { SocketMessage } = require("../../utils/socket-message");


const attemptLogin = (client) => {
    const username = readline.question("Please enter a username: ");
    const password = readline.question("Please enter the password: ");
    client.write(
      JSON.stringify(
        new SocketMessage("attempt-login", "", {
          username,
          password,
        })
      )
    );
  };

  module.exports = {
      attemptLogin
  }
  