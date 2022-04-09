# How to run this program

Ensure nodejs is installed on your device. This application was built using node version 14

1. Run `npm install`   

2. Create a `.env` file and copy the contents from the `.env.example` file. Enter the values for the different env variables   
This is what your `.env` file should look lke

```
USERNAME_1=
USERNAME_2=
PASSWORD_1=
PASSWORD_2=
```   

3. Start the server by running `node .\server\server.js`, then start both of the clients by running `node .\client\client.js` in two separate terminals.