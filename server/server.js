const net = require("net");
const server = net.createServer();
let { credentials } = require("./utils/data");

let numberOfUsersConnected = 0;
let clients = [];
const readline = require("readline-sync");
const { SocketMessage } = require("../utils");

const sendDataToAllClients = (messageToSend) => {
  clients.forEach((client) => {
    client.write(JSON.stringify(new SocketMessage(messageToSend.type, messageToSend.message, messageToSend.data)));
  });
};

const addUser = () => {
  numberOfUsersConnected++;
  return numberOfUsersConnected;
};

const getClients = () => {
  return clients;
};

const setCredentials = (updatedCredentials) => {
  credentials = updatedCredentials;
};

server.on("connection", (socket) => {
  clients.push(socket);

  socket.write(
    JSON.stringify(
      new SocketMessage("login", "", {
        credentials,
      })
    )
  );

  socket.on("data", (data) => {
    const objectData = JSON.parse(data);
    console.log(objectData);

    if (objectData && objectData.type) {
      if (objectData.type === "update-credentials") {
        setCredentials(objectData.data.credentials);
      } else if (objectData.type === "attempt-login") {
        attemptLogin(objectData, socket);
      }
    }
  });

  socket.on("close", () => {
    console.log("Server connection closed");
  });

  socket.on("error", (err) => {
    console.log(err.message);
  });
});

server.listen(7621, () => {
  console.log("Server started on port: ", server.address().port);
});

const attemptLogin = (objectData, socket) => {
  const authData = objectData.data;
  const { username, password } = authData;
  console.log(username);
  console.log(password);

  const filterResult = credentials.filter((credentialSet) =>
    isValidCredentials(credentialSet, username, password)
  );

  if (filterResult.length > 0) {
    const userFound = filterResult[0];
    const index = credentials.findIndex((credentialSet) =>
      isValidCredentials(credentialSet, username, password)
    );
    credentials[index].alreadyLoggedIn = true;

    keepChecking = false;
    isAuthenticated = true;

    // user is authenticated - start game if it has two players

    console.log("number of clients: " + clients.length);
    if (clients.length === 2) {
      console.log("Find the Queen has started");
      
      sendDataToAllClients({
        type: "notification",
        message: "Find the Queen has started",
        data: {},
      });

      const clients = getClients();
      const dealerIndex = Math.round(Math.random()); // will return 0 or 1
      const spotterIndex = dealerIndex === 0 ? 1 : 0;
      const dealer = clients[dealerIndex];
      const spotter = clients[spotterIndex];

      dealer.write(
        JSON.stringify(
          new SocketMessage("Notification", "You are the dealer!", {})
        )
      );

      // dealer.write(JSON.stringify({
      //     type: "Prompt",
      //     msg: "Please choose 1, 2 or 3."
      // }));

      spotter.write(
        JSON.stringify(
          new SocketMessage("Notification", "You are the spotter!", {})
        )
      );
    }
  } else {
    socket.write(JSON.stringify(new SocketMessage("failed-login", "", {})));
  }
};

const isValidCredentials = (credentialSet, username, password) => {
  return (
    credentialSet.username === username &&
    credentialSet.password === password &&
    credentialSet.alreadyLoggedIn === false
  );
};
