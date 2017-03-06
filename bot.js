var botBuilder = require('claudia-bot-builder');
var parse = require('./common/parse.js');
var listOps = require('./listops/mainOps.js');

module.exports = botBuilder(function(request) {
    var data = parse.parseInputOrder(request.text); // Completely parsed incoming message into OBJECT called data, with attributes first, second, third, fourth and fifth.
    var userId = request.sender; // We always got a userId available.

    return new Promise(function(done) {
        listOps.loadState(userId).then(function(state) { // READ latest state of user. If state is not present, run init script to create necessary table entries.
            console.log(state);
            console.log(data);
            // MAIN switch
            switch (data.first) {

                case "seznam":
                    if (data.second) {
                        var listName = data.second;
                    } else {
                        var listName = state.Item.listName.values[0];
                    }
                    listOps.checkList(userId, listName).then(function(list) {
                        var message = 'Obsah seznamu ' + listName + ': ';
                        console.log(list);
                        var things = list.Item.things.values;
                        things.forEach(function(thing) {
                            message += thing;
                            message += ', '; // New line element to be pushed as well.
                        });
                        listOps.saveState(userId, listName); // New list is set as active = save state.
                        done(message);
                    }).catch(function(err) {
                        console.log('List does not exists, let us create a new one!');
                        listOps.newList(userId, listName).then(function(list) {
                            listOps.saveState(userId, listName); // New list means, we also update latest state.
                            var message = 'Prave aktivni seznam ' + listName + ' je prazdny.'
                            done(message);
                        });
                    });
                    break;

                case "pridej":



                   break;

                case "save":
                    if (data.second) {
                        var listName = data.second;
                    } else {
                        var listName = state.Item.listName.values[0];
                    }
                    listOps.saveState(userId, listName);
                    var message = 'Saving state: ' + listName;
                    done(message);
                    break;

                default:
                    var message = 'Not recognised.';
                    done(message);
            }

        }).catch(function(err) {
            // State not found in DB = create new user...
            console.log(err);
            done('Some error!');
        });
    });
});