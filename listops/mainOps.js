var write = require('./../db/createItem.js');
var update = require('./../db/updateItem.js');

exports.newList = function(userId, listName, callback) {
    var message = "Uzivatel cislo " + userId + " zada o zalozeni seznamu " + listName + ".";
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