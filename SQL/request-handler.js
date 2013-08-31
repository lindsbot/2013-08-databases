/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */

var fs = require('fs');
var mysql = require('mysql');
var _ = require('lodash');

var dbConnection = mysql.createConnection({
  user: "root",
  password: "",
  database: "chat"
});

dbConnection.connect();

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var handleRequest = function(request, response) {

  var sendResponse = function(status, body) {
    var headers = defaultCorsHeaders;
    response.writeHead(statusCode, headers);
    response.end(body);
  };

  var statusCode = 200;
  if (request.method === 'GET') {
    if (request.url === "/") {
      fs.readFile('./index.html', function(err, data){
        if (err) {
          response.writeHead(404)
          response.end(JSON.stringify(err));
          return;
        }
        sendResponse(200, data);
      });
    } else if (request.url === "/messages") {
      dbConnection.query('SELECT messages.body, messages.createdAt, users.name FROM messages, users WHERE users.id = messages.id_user ORDER BY messages.id', function(err, data){
        sendResponse(200, JSON.stringify(data));
      });
    } else {
      fs.readFile('.' + request.url, function(err, data){
        if (err) {
          response.writeHead(404)
          response.end(JSON.stringify(err));
          return;
        }
        sendResponse(200, data);
      });
    }
  } else if (request.method === 'POST') {
    var string = "";
    request.on('data', function(chunk){
      string += chunk;
    });
    request.on('end', function(){
      var message = JSON.parse(string);
      var body = message.message;
      var username = message.username;
      var createdAt = message.createdAt;
      var userID = 0;
      dbConnection.query('SELECT id FROM users WHERE name = \"' + username + '\"', function(err, data){
        if (data && data.length === 0) {
          dbConnection.query('INSERT INTO users (name) VALUE(\"' + username + '\")', function(err, data){
            dbConnection.query('SELECT id FROM users WHERE name = \"' + username + '\"', function(err, data){
              userID=data[0].id;
              var messageSet = {id_user: userID, createdAt: createdAt, body: body};
              dbConnection.query('INSERT INTO messages SET ?', messageSet, function(err, data){});
            });
          });
        } else {
          userID = data[0].id;
          var messageSet = {id_user: userID, createdAt: createdAt, body: body};
          dbConnection.query('INSERT INTO messages SET ?', messageSet, function(err, data){});
        }
      });
    });
  }
};

module.exports.handleRequest = handleRequest;