var botBuilder = require('claudia-bot-builder');
var parse = require('./common/parse.js');
var listOps = require('./listops/mainOps.js');

module.exports = botBuilder(function(request) {
    var data = parse.parseInputOrder(request.text); // Completely parsed incoming message into OBJECT called data, with attributes first, second, third, fourth and fifth.
    var userId = request.sender; // We always got a userId available.

    return new Promise(function(done) {
        listOps.loadState(userId).then(function(state) { // READ latest state of user. If state is not present, run init script to create necessary table entries.
            console.log(state.Items.listName.values);
            console.log(data);
            // MAIN switch
            switch (data.first) {

                case "save":
                    var message = 'Savestate';
                    //var listName = state.Items.listName.values;
                    //console.log(listName)
                    console.log(message);
                    done(message);
                    break;

                default:
                    var message = 'Not recognised.';
                    done(message);
            }

        }).catch(function(err) {
            // State not found in DB = create new user...
            done(err);
        });
    });
});