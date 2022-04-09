const net = require("net");
const { SocketMessage } = require("../utils/socket-message");
const { attemptLogin } = require("./utils/attempt-login");
const { selectValue } = require("./utils/select-value");

const options = {
  port: 7621,
  host: "127.0.0.1",
};

const client = net.createConnection(options);

client.on("connect", () => {
  console.log("Connected to server");
});

client.on("data", (data) => {
  try {
    const objectData = JSON.parse(data.toString());

    if (objectData && objectData.type) {
      if (objectData.type === "login") {
        attemptLogin(client);
      } else if (objectData.type === "failed-login") {
        console.log("Invalid credentials");
        attemptLogin(client);
      } else if (objectData.type === "notification") {
        console.log("Notification received: " + objectData.message);

        if (
          objectData.message.toLowerCase() ===
          "the game has started! you are the dealer!"
        ) {
          client.write(JSON.stringify(new SocketMessage("start-game", "", {})));
        }
      } else if (objectData.type === "spot-value") {
        let selectedValue = selectValue();
        client.write(
          JSON.stringify(
            new SocketMessage("spotter-choice-selected", "", {
              selectedValue,
            })
          )
        );
      } else if (objectData.type === "login-successful") {
        console.log("Login was successful!");

        client.write(
          JSON.stringify(new SocketMessage("login-successful", "", {}))
        );
      } else if (objectData.type === "dealer-choose-value") {
        const selectedValue = selectValue();
        client.write(
          JSON.stringify(
            new SocketMessage("value-selected", "", {
              selectedValue,
            })
          )
        );
      }
    }
  } catch (e) {
    console.log(data.toString());
    console.log("Error thrown while parsing data");
    console.log(e);
  }
});

client.on("error", (err) => {
  console.log(err.message);
});

