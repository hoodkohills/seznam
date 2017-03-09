// This function shall be later isolated into standalone Lambda function.
exports.query = function(params) {
    return new Promise(function(done, fail) {
        var AWS = require("aws-sdk");

        AWS.config.update({
            region: "eu-central-1",
            endpoint: "dynamodb.eu-central-1.amazonaws.com"
        });

        var dynamodb = new AWS.DynamoDB();
        var docClient = new AWS.DynamoDB.DocumentClient();
        console.log("Attempting a query...");
        docClient.query(params, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                fail(err);
            } else {
                console.log("Result of query: ", JSON.stringify(data, null, 2));
                done(data);
            }
        });

        console.log('Tohle vypisuje db/queryItems.js, mel bys videt parametry...');
        console.log(params);
    });
}