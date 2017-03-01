// This function shall be later isolated into standalone Lambda function.
exports.put = function (params) {
var user = params.userId;

var AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-central-1",
  endpoint: "dynamodb.eu-central-1.amazonaws.com"
});

var dynamodb = new AWS.DynamoDB();

var docClient = new AWS.DynamoDB.DocumentClient();

docClient.put(params, function(err, data) {
   if (err) {
       console.log(err);
       console.error("Unable to add new items from user ", user, ". Error JSON:", JSON.stringify(err, null, 2));
   } else {
       console.log("Request by user ", user, " was successfully added.");
   }
});

console.log('Tohle vypisuje db/createItem.js, mel bys videt parametry...');
console.log(params);
}
