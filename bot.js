var botBuilder = require('claudia-bot-builder');
var parse = require('./common/parse.js');
var listOps = require('./listops/test.js')

module.exports = botBuilder(function (request) {
    console.log(request);
    console.log(request.text);
    var data = parse.parseInputOrder(request.text);
    console.log (data); // Completely parsed incoming meesage into OBJECT called data, with attributes first, second, third, fouth and fifth.

    // READ latest state of user. If state is not present, run init script to create necessary table entries.

    // MAIN switch
    switch(data.first) {
        case "ahoj":
            if (!data.second) { return 'Ahoj! Zkus napsat za ahoj jeste neco a ja to zopakuji.'
            } else {
            return 'Ahoj znova, napsal si ' + data.second + ', ze mam pravdu?'
            }
            break;
        case "ano":
            return 'Ja vim, ze ano...'
            break;
        case "help":
            return 'Zkus napsat prikaz ahoj!'
            break;
        case "seznam":
            if (!data.second) { return 'Za prikaz seznam jeste musis dopsat jmeno seznamu, ktery te zajima.'
            } else {
                var listName = data.second; // You can't send an attribute of an object as argument. Extract attribute into new variable.
                var userId = request.sender;
                listOps.setActive(function (userId, listName, callback) {
                    console.log ('Here I expect a callback!');
                    return callback;
                });
            }
            break;
        default:
            return 'Bohuzel, tento prikaz neznam, zkus napsat HELP.';
    }

    // WRITE latest state of user, whatever that means.

});