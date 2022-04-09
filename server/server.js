require('dotenv').config();

console.log(process.env.USERNAME_1)

const net = require("net");
const server = net.createServer();
const readline = require("readline-sync");
const { setupCredentials } = require('../utils/setup-credentials');
const { SocketMessage } = require("../utils/socket-message");
const credentials = setupCredentials();

let clients = [];
let dealersChoice;
let dealer;
let spotter;
let dealerScore = 0;
let spotterScore = 0;
let round = 1;

const sendDataToAllClients = (messageToSend) => {
  clients.forEach((client) => {
    client.write(
      JSON.stringify(
        new SocketMessage(
          messageToSend.type,
          messageToSend.message,
          messageToSend.data
        )
      )
    );
  });
};

const getClients = () => {
  return clients;
};

const setCredentials = (updatedCredentials) => {
  credentials = updatedCredentials;
};

server.on("connection", (socket) => {

  if (clients.length === 2) {
    socket.write(JSON.stringify(new SocketMessage("notification", "Only two players can play this game!", {})));
    socket.destroy();
  }

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
    if (objectData && objectData.type) {
      if (objectData.type === "update-credentials") {
        setCredentials(objectData.data.credentials);
      } else if (objectData.type === "attempt-login") {
        attemptLogin(objectData, socket);
      } else if (objectData.type === "value-selected") {
        dealersChoice = objectData.data.selectedValue;
        spotter.write(JSON.stringify(new SocketMessage("spot-value", "", {})));
      } else if (objectData.type === "start-game") {
        dealer.write(
          JSON.stringify(
            new SocketMessage("dealer-choose-value", "You are the dealer!", {})
          )
        );
        spotter.write(
          JSON.stringify(
            new SocketMessage("Notification", "You are the spotter!", {})
          )
        );
      } else if (objectData.type === "login-successful") {
        if (clients.length === 2) {
          const dealerIndex = Math.round(Math.random()); // will return 0 or 1
          const spotterIndex = dealerIndex === 0 ? 1 : 0;
          dealer = clients[dealerIndex];
          spotter = clients[spotterIndex];

          spotter.write(
            JSON.stringify(
              new SocketMessage(
                "Notification",
                "The game has started! You are the spotter!",
                {}
              )
            )
          );
          dealer.write(
            JSON.stringify(
              new SocketMessage(
                "Notification",
                "The game has started! You are the dealer!",
                {}
              )
            )
          );
        }
      } else if (objectData.type === "spotter-choice-selected") {
        const spotterChoice = objectData.data.selectedValue;
        if (round < 5) {
          if (spotterChoice === dealersChoice) {
            spotterScore++;
          } else {
            dealerScore++;
          }
          round++;

          dealer.write(
            JSON.stringify(
              new SocketMessage(
                "dealer-choose-value",
                "You are the dealer!",
                {}
              )
            )
          );
        } else {
          if (spotterScore > dealerScore) {
            spotter.write(
              JSON.stringify(new SocketMessage("notification", "Victory", {}))
            );
            dealer.write(
              JSON.stringify(new SocketMessage("notification", "Defeat", {}))
            );
          } else {
            spotter.write(
              JSON.stringify(new SocketMessage("notification", "Defeat", {}))
            );
            dealer.write(
              JSON.stringify(new SocketMessage("notification", "Victory", {}))
            );
          }

          sendDataToAllClients({
            type: "notification",
            message: "Thanks For Playing",
            data: {},
          });

          // disconnect clients
          clients.forEach((client) => client.destroy());
        }
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

  const filterResult = credentials.filter((credentialSet) =>
    isValidCredentials(credentialSet, username, password)
  );

  if (filterResult.length > 0) {
    // user is authenticated - start game if it has two players

    socket.write(
      JSON.stringify({
        type: "login-successful",
        message: "",
        data: {},
      })
    );
    const index = credentials.findIndex((credentialSet) =>
      isValidCredentials(credentialSet, username, password)
    );
    credentials[index].alreadyLoggedIn = true;
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
