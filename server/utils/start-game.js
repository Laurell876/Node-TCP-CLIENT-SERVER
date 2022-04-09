const { SocketMessage } = require("../../utils/socket-message");


const startGame = (setDealer, setSpotter, getSpotter, getDealer, getClients) => {
  const dealerIndex = Math.round(Math.random()); // will return 0 or 1
  const spotterIndex = dealerIndex === 0 ? 1 : 0;

  setDealer(getClients()[dealerIndex]);
  setSpotter(getClients()[spotterIndex]);

  getSpotter().write(
    JSON.stringify(
      new SocketMessage(
        "Notification",
        "The game has started! You are the spotter!",
        {}
      )
    )
  );
  getDealer().write(
    JSON.stringify(
      new SocketMessage(
        "Notification",
        "The game has started! You are the dealer!",
        {}
      )
    )
  );
};

module.exports = {
  startGame,
};
