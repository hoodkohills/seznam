var write = require('./../db/createItem.js');
var update = require('./../db/updateItem.js');
var get = require('./../db/getItem.js');

exports.newList = function(userId, listName, callback) {
    console.log(userId);
    console.log(listName);

    var params = {
        TableName: "seznam",
        Item: {
            "user": userId,
            "list": listName
        }
    };

    write.put(params, function(err, data) {
        if (!err) {
            var message = "Seznam " + listName + " byl uspesne vytvoren.";
            callback(message);
        } else {
            var message = "Seznam " + listName + " NEBYL vytvoren! Pardon!";
            callback(message);
        }
    });
}

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

exports.updateList = function(userId, listName, item, callback) {
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
    update.update(params);
    var message = "OK, pridal jsem " + item + " na seznam " + listName + ".";
    callback(message);
}

exports.getList = function(userId, listName, callback) {
    console.log('GetList userId: ' + userId);
    console.log('GetList listName: ' + listName);

    var params = {
        TableName: "seznam",
        Key: {
            "user": userId,
            "list": listName
        }
    };

    get.get(params, function(callback) {
        console.log('RESULT of DB call: ', callback);
    });
    var message = "Seznam " + listName + " obsahuje polozky: ...";
    callback(message);
}

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
        UpdateExpression: "SET listName :l",
        ExpressionAttributeValues: {
            ":l": docClient.createSet([listName])
        },
        ReturnValues: "UPDATED_NEW"
    };

    return update.update(params);
}

