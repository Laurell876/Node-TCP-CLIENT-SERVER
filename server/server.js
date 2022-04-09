require("dotenv").config();

console.log(process.env.USERNAME_1);

const net = require("net");
const server = net.createServer();
const { setupCredentials } = require("../utils/setup-credentials");
const { SocketMessage } = require("../utils/socket-message");
const { compareValuesEntered } = require("./utils/compare-values-entered");
const { startGame } = require("./utils/start-game");
const { validateAuthValues } = require("./utils/validate-auth-values");
const credentials = setupCredentials();

let clients = [];
let dealersChoice;
let dealer;
let spotter;
let dealerScore = 0;
let spotterScore = 0;
let round = 0;

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

const setCredentials = (updatedCredentials) => {
  credentials = updatedCredentials;
};

const getCredentials = () => {
  return credentials;
};

const getRound = () => {
  return round;
};

const incrementSpotterScore = () => {
  spotterScore++;
};

const incrementDealerScore = () => {
  dealerScore++;
};

const incrementRound = () => {
  round++;
};

const setDealer = (updatedDealer) => {
  dealer = updatedDealer;
};

const getDealer = () => {
  return dealer;
};

const setSpotter = (updatedSpotter) => {
  spotter = updatedSpotter;
};

const getSpotter = () => {
  return spotter;
};

const getClients = () => {
  return clients;
};

const getDealerScore = () => {
  return dealerScore;
};

const getSpotterScore = () => {
  return spotterScore;
};

const getDealersChoice = () => {
  return dealersChoice;
}

server.on("connection", (socket) => {
  if (clients.length === 2) {
    socket.write(
      JSON.stringify(
        new SocketMessage(
          "notification",
          "Only two players can play this game!",
          {}
        )
      )
    );
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
        validateAuthValues(objectData, socket, getCredentials);
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
          startGame(setDealer, setSpotter, getSpotter, getDealer, getClients);
        }
      } else if (objectData.type === "spotter-choice-selected") {
        const spotterChoice = objectData.data.selectedValue;
        compareValuesEntered(
          getRound,
          incrementSpotterScore,
          incrementDealerScore,
          incrementRound,
          getDealersChoice,
          spotterChoice,
          getDealer,
          getSpotter,
          getClients,
          getSpotterScore,
          getDealerScore,
          sendDataToAllClients
        );
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
