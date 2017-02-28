var write = require('./../db/createItem.js');
var update = require('./../db/updateItem.js');

exports.newList = function(userId, listName, callback) {
    var message = "Seznam " + listName + " byl uspesne vytvoren.";
    console.log(userId);
    console.log(listName);

    var params = {
            TableName: "seznam",
            Item: {
                "user": userId,
                "list": listName
            }
        };
    write.put(params);
    callback (message);
}

exports.updateList = function(userId, listName, item, callback) {
    var message = "Uzivatel cislo " + userId + " chce pridat " + item + " na seznam "+ listName + ".";
    console.log(userId);
    console.log(listName);
    console.log(item);
    var params = {
        TableName: "seznam",
        Key:{
            "user": userId,
            "list": listName
        },
        UpdateExpression: "set items", // INCORRECT!!!
        ConditionExpression: "size(info.actors) >= :num",
        ExpressionAttributeValues:{
            ":num":3
        },
        ReturnValues:"UPDATED_NEW"
    };
    update.update(params);
    callback (message);
}

exports.stateUpdate = function(userId, listName, callback) {
    var message = "Uzivatel cislo " + userId + " chce pridat " + item + " na seznam "+ listName + ".";
    console.log(userId);
    console.log(listName);
    console.log(item);
    var params = {
        TableName: "seznam-state",
        Key:{
            "user": userId,
            "list": listName
        },
        UpdateExpression: "ADD items :i",
        ExpressionAttributeValues:{
            ":i":docClient.createSet([item])
        },
        ReturnValues:"UPDATED_NEW"
    };
    update.update(params);
    callback (message);
}