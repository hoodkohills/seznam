var AWS = require("aws-sdk");
var fs = require('fs');

AWS.config.update({
  region: "eu-central-1",
  endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient()

var incoming = JSON.parse(fs.readFileSync('testevent.json', 'utf-8'));
console.log(incoming);

var params = {
        TableName: "users",
        Key: {
            "user": incoming.user,
            "name": incoming.name
        }
    };

docClient.get(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
    }
});