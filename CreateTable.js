var AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-central-1",
  endpoint: "http://localhost:8000"
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "nezapominak",
    KeySchema: [
        { AttributeName: "fbUserId", KeyType: "HASH"},  //Partition key
        { AttributeName: "list", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "fbUserId", AttributeType: "S" },
        { AttributeName: "list", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});