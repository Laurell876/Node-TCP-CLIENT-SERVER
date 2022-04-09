const { SocketMessage } = require("../../utils/socket-message");


const validateAuthValues = (objectData, socket, getCredentials) => {
  const authData = objectData.data;
  const { username, password } = authData;

  const filterResult = getCredentials().filter((credentialSet) =>
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
    const index = getCredentials().findIndex((credentialSet) =>
      isValidCredentials(credentialSet, username, password)
    );
    getCredentials()[index].alreadyLoggedIn = true;
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

module.exports = {
  validateAuthValues,
};
