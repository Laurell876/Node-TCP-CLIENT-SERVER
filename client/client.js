const net = require("net");
const readline = require("readline-sync");
const { SocketMessage } = require("../utils");

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
    console.log(objectData)

    if (objectData && objectData.type) {
      if (objectData.type === "login") {
        attemptLogin();
      } else if (objectData.type === "failed-login") {
        console.log("Invalid credentials");
        attemptLogin();
      } else if (objectData.type === "notification") {
        console.log("Notification received: " + objectData.message);
      }
    }
  } catch (e) {
    console.log(e);
    console.log("Error thrown while parsing data: " + JSON.stringify(e));
  }
});

client.on("error", (err) => {
  console.log(err.message);
});

const attemptLogin = () => {
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
