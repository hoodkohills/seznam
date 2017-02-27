exports.setActive = function(userId, listName, callback) {
    var message = "Uzivatel cislo " + userId + "zada o zalozeni seznamu " + listName + ".";
    console.log(userId);
    console.log(listName);
    callback (userId, listName, message);
}