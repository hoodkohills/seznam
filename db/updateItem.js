// This function shall be later isolated into standalone Lambda function.
exports.update = function(params) {
    return new Promise(function(done, fail) {
        var AWS = require("aws-sdk");

        AWS.config.update({
            region: "eu-central-1",
            endpoint: "dynamodb.eu-central-1.amazonaws.com"
        });


        var dynamodb = new AWS.DynamoDB();
        var docClient = new AWS.DynamoDB.DocumentClient();
        console.log("Attempting an update...");
        docClient.update(params, function(err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                fail(err)
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                done(data);
            }
        });

        console.log('Tohle vypisuje db/updateItems.js, mel bys videt parametry...');
        console.log(params);
    });
}