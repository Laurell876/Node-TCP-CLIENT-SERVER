const validateAuthValues = (objectData, socket) => {
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

module.exports = {
  validateAuthValues,
};
