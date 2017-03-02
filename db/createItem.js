// This function shall be later isolated into standalone Lambda function.
exports.put = function(params) {
    return new Promise(function(done, fail) {
        var AWS = require("aws-sdk");

        AWS.config.update({
            region: "eu-central-1",
            endpoint: "dynamodb.eu-central-1.amazonaws.com"
        });

        var dynamodb = new AWS.DynamoDB();
        var docClient = new AWS.DynamoDB.DocumentClient();
        console.log("Attempting to create new thing in DynamoDB...");
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Item was NOT created! Error JSON:", JSON.stringify(err, null, 2));
                fail(err)
            } else {
                console.log("Item was successfully created.");
                done(data);
            }
        });

        console.log('Tohle vypisuje db/createItem.js, mel bys videt parametry...');
        console.log(params);
    });
}