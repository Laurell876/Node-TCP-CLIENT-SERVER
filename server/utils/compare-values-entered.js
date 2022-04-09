const { SocketMessage } = require("../../utils/socket-message");

const compareValuesEntered = (
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
    ) => {
    if (getRound() < 5) {
      if (getDealersChoice() === spotterChoice) {
        incrementSpotterScore();
      } else {
        incrementDealerScore();
      }
      incrementRound();

      getDealer().write(
        JSON.stringify(
          new SocketMessage(
            "dealer-choose-value",
            "You are the dealer!",
            {}
          )
        )
      );
    } else {
      if (getSpotterScore() > getDealerScore()) {
        getSpotter().write(
          JSON.stringify(new SocketMessage("notification", "Victory", {}))
        );
        getDealer().write(
          JSON.stringify(new SocketMessage("notification", "Defeat", {}))
        );
      } else {
        getSpotter().write(
          JSON.stringify(new SocketMessage("notification", "Defeat", {}))
        );
        getDealer().write(
          JSON.stringify(new SocketMessage("notification", "Victory", {}))
        );
      }

      sendDataToAllClients({
        type: "notification",
        message: "Thanks For Playing",
        data: {},
      });

      // disconnect clients
      getClients().forEach((client) => client.destroy());
    }
}

module.exports = {
    compareValuesEntered
}