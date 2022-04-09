const net = require("net");
const readline = require("readline-sync");

const options = {
  port: 7621,
  host: "127.0.0.1",
};

const client = net.createConnection(options);

client.on("connect", () => {
  console.log("Connected to server");
  // sendLine()
});

client.on("data", (data) => {
  try {
    const objectData = JSON.parse(data.toString());

    if (objectData && objectData.type) {
      if (objectData.type === "login") {
        const credentials = objectData.data.credentials;
        console.log(credentials);

        let keepChecking = true;
        let isAuthenticated = false;

        /// while (keepChecking && !isAuthenticated) {
        attemptLogin();
        // const filterResult = credentials.filter(credentialSet => isValidCredentials(credentialSet, username, password))
        // if(filterResult.length > 0) {
        //     const userFound = filterResult[0];
        //     const index = credentials.findIndex(credentialSet => isValidCredentials(credentialSet, username, password));
        //     credentials[index].alreadyLoggedIn = true;

        //     keepChecking = false;
        //     isAuthenticated = true;
        // } else {
        //     console.log("Invalid credentials")
        //     const retry = readline.question('Would you like to try again? Answer yes or no: ')
        //     if(retry.toLowerCase() === 'no') keepChecking = false;
        //     else if(retry.toLowerCase() === 'yes') keepChecking = true;
        // }
        //  }
        //console.log(isAuthenticated)
        // return {
        //     isAuthenticated,
        //     updatedCredentials: credentials
        // }

        // client.write(JSON.stringify({
        //     type: "update-credentials",
        //     data: {
        //         credentials
        //     }
        // }))
      } else if (objectData.type === "retry-login") {
          console.log("Invalid credentials")
          attemptLogin()
      }
    }
  } catch (e) {
    console.log(e);
    console.log("Error thrown while parsing data: " + JSON.stringify(e));
  }
  // console.log('Data sent: ' + data)
  // if(data === 'Please choose 1, 2 or 3.') {
  //     console.log("")
  // }
  //sendLine()
});

client.on("error", (err) => {
  console.log(err.message);
});

function sendLine() {
  var line = readline.question("\nEnter a message\t");
  if (line == "0") {
    client.end();
  } else {
    client.write(line);
  }
}

const attemptLogin = () => {
  const username = readline.question("Please enter a username: ");
  const password = readline.question("Please enter the password: ");
  client.write(
    JSON.stringify({
      type: "attempt-login",
      data: {
        username,
        password,
      },
    })
  );
};

const isValidCredentials = (credentialSet, username, password) => {
  return (
    credentialSet.username === username &&
    credentialSet.password === password &&
    credentialSet.alreadyLoggedIn === false
  );
};
