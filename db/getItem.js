// This function shall be later isolated into standalone Lambda function.
exports.get = function(params) {
    return new Promise(function(done, fail) {
        var AWS = require("aws-sdk");

        AWS.config.update({
            region: "eu-central-1",
            endpoint: "dynamodb.eu-central-1.amazonaws.com"
        });


        var dynamodb = new AWS.DynamoDB();
        var docClient = new AWS.DynamoDB.DocumentClient();
        console.log("Attempting to get something from DynamoDB...");
        docClient.get(params, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                fail(err)
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                done(data);
            }
        });

        console.log('Tohle vypisuje db/getItems.js, mel bys videt parametry...');
        console.log(params);
    });
}