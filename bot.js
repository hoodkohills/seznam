var botBuilder = require('claudia-bot-builder');
var parse = require('./common/parse.js');
var listOps = require('./listops/mainOps.js');

module.exports = botBuilder(function (request) {
    var data = parse.parseInputOrder(request.text); // Completely parsed incoming meesage into OBJECT called data, with attributes first, second, third, fourth and fifth.
    //console.log(request);
    //console.log(request.text);
    console.log (data);
    var listName = data.second; // You can't send an attribute of an object as argument. Extract attribute into new variable.
    var userId = request.sender;

    // READ latest state of user. If state is not present, run init script to create necessary table entries.
    var state = { listName: 'paja' };

    // MAIN switch
    switch(data.first) {
        case "ahoj":
            if (!data.second) { return 'Ahoj! Zkus napsat za ahoj jeste neco a ja to zopakuji.'
            } else {
            return 'Ahoj znova, napsal si ' + data.second + ', ze mam pravdu?';
            }
            break;
        case "ano":
        case "jo":
            return 'Ja vim, ze ano...';
            break;
        case "help":
            return 'Zkus napsat prikaz ahoj!';
            break;
        case "seznam":
            if (!data.second) { return 'Za prikaz seznam jeste musis dopsat jmeno seznamu, ktery te zajima.'
            } else {
                listOps.newList(userId, listName, function (callback) {
                console.log ('Message to be send back to user: ' + callback);
                global.message = callback;
                });
            }
            // WRITE latest state of user, whatever that means.
            return message;
            break;
        case "pridej":
            if (!data.second) { return 'Musis napsat, co presne chces pridat na aktualni seznam.'
            } else {
                var listName = state.listName;
                var item = data.second;
                listOps.updateList(userId, listName, item, function (callback) {
                console.log(callback);
                global.message = callback;
                });
            }


            // WRITE latest state of user, whatever that means.
            return message;
            break;
        default:
            return 'Bohuzel, tento prikaz neznam, zkus napsat HELP.';
    }
});