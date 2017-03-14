var write = require('./../db/createItem.js');
var update = require('./../db/updateItem.js');
var get = require('./../db/getItem.js');
var query = require('./../db/queryItem.js');

// newlist confirmed working OK
exports.newList = function(userId, listName) {
    console.log(userId);
    console.log(listName);

    var params = {
        TableName: "seznam",
        Item: {
            "user": userId,
            "list": listName
        }
    };

    return write.put(params);
}

// checklist confirmed working OK
exports.checkList = function(userId, listName) {
    console.log('Checklist userId: ' + userId);
    console.log('Checklist listName: ' + listName);

    var params = {
        TableName: "seznam",
        Key: {
            "user": userId,
            "list": listName
        }
    };

    return get.get(params);
}

// updatelist confirmed working OK
exports.updateList = function(userId, listName, item) {
    var AWS = require('aws-sdk');
    //var dynamodb = new AWS.DynamoDB();
    var docClient = new AWS.DynamoDB.DocumentClient();
    console.log('UpdateList userId: ' + userId);
    console.log('UpdateList listName: ' + listName);
    console.log('UpdateList item: ' + item);
    var params = {
        TableName: "seznam",
        Key: {
            "user": userId,
            "list": listName
        },
        UpdateExpression: "ADD things :i",
        ExpressionAttributeValues: {
            ":i": docClient.createSet([item])
        },
        ReturnValues: "UPDATED_NEW"
    };
    return update.update(params);

}

// loadstate confirmed working OK
exports.loadState = function(userId) {
    // Loads latest state of user
    var params = {
        TableName: "seznam-state",
        Key: {
            "user": userId
        }
    };

    return get.get(params);
}

// savestate confirmed working OK
exports.saveState = function(userId, listName) {
    var AWS = require('aws-sdk');
    //var dynamodb = new AWS.DynamoDB();
    var docClient = new AWS.DynamoDB.DocumentClient();
    // Saves latest change to the state.
    var params = {
        TableName: "seznam-state",
        Key: {
            "user": userId
        },
        UpdateExpression: "SET listName = :l",
        ExpressionAttributeValues: {
            ":l": docClient.createSet([listName])
        },
        ReturnValues: "UPDATED_NEW"
    };

    return update.update(params);
}

// removeitem confirmed working OK
exports.removeItem = function(userId, listName, item) {

    var AWS = require('aws-sdk');
    //var dynamodb = new AWS.DynamoDB();
    var docClient = new AWS.DynamoDB.DocumentClient();
    console.log('UpdateList userId: ' + userId);
    console.log('UpdateList listName: ' + listName);
    console.log('UpdateList item: ' + item);
    var params = {
        TableName: "seznam",
        Key: {
            "user": userId,
            "list": listName
        },
        UpdateExpression: "DELETE things :i",
        ExpressionAttributeValues: {
            ":i": docClient.createSet([item])
        },
        ReturnValues: "UPDATED_NEW"
    };
    return update.update(params);

}

// list all lists confirmed workin OK
exports.listLists = function(userId) {
        var params = {
            TableName: "seznam",
            KeyConditionExpression: "#usr = :userid",
            ExpressionAttributeNames: {
                "#usr": "user"
            },
            ExpressionAttributeValues: {
                ":userid": userId
            }
        };
    return query.query(params);
}

// add a new user
exports.newUser = function(userId) {

    var AWS = require('aws-sdk');
    //var dynamodb = new AWS.DynamoDB();
    var docClient = new AWS.DynamoDB.DocumentClient();

    var paramsState = {
        TableName: "seznam-state",
        Item: {
            "user": userId,
            "listName": docClient.createSet(["nakup"])
        }
    };

    var paramsList = {
        TableName: "seznam",
        Item: {
            "user": userId,
            "list": "nakup"
        }
    };

    write.put(paramsList);
    write.put(paramsState);
    return
}

// save history, not implemented yet...
exports.saveHistory = function(userId, text) {
     // So far no timestamp
     var params = {
         TableName: "seznam-history",
         Item: {
             "user": userId,
             "text": text
         }
     };
     return write.put(params);
}