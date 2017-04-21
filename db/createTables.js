var AWS = require("aws-sdk");

AWS.config.update({
  region: "your-region",
  endpoint: "your-region-endpoint" // http://docs.aws.amazon.com/general/latest/gr/rande.html#ddb_region
});

var dynamodb = new AWS.DynamoDB();

var paramsMain = {
    TableName : "seznam",
    KeySchema: [
        { AttributeName: "user", KeyType: "HASH"},  //Partition key
        { AttributeName: "list", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "user", AttributeType: "S" },
        { AttributeName: "list", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

var paramsState = {
    TableName : "seznam-state",
    KeySchema: [
        { AttributeName: "user", KeyType: "HASH"}  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "user", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(paramsMain, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});

dynamodb.createTable(paramsState, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});