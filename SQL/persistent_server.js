var mysql = require('mysql');
var http = require("http");
var fs = require('fs');
var handleRequest = require('./request-handler.js')
/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
var dbConnection = mysql.createConnection({
  user: "root",
  password: "",
  database: "chat"
});

dbConnection.connect();

var requestListener = function (request, response) {

  console.log("Serving request type " + request.method + " for url " + request.url);

  handleRequest.handleRequest(request, response);
};



var port = 8080;

var ip = "127.0.0.1";

var server = http.createServer(requestListener);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);




dbConnection.end();
