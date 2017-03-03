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
                case "help":
                case "pomoc":
                    done('Zkus napsat prikaz `ahoj`!');
                    break;
                case "seznam":
                    // ListName is provided by STATE or by user.
                    if (!data.second) {
                        var listName = state.Item.listName;
                    } else {
                        var listName = data.second;
                    }

                    // Update state of user, if user sent second word data.second
                    if (data.second) {
                        listOps.saveState(userId, listName);
                    }
                    // Check the content of the list / or create new one
                    listOps.checkList(userId, listName).then(function(list) {
                        var message = 'Obsah seznamu ' + listName + ': ';
                        console.log(list);
                        var things = list.Item.things.values;
                        things.forEach(function(thing) {
                            message += thing;
                            message += ', '; // New line element to be pushed as well.
                        });
                        console.log('This shall show all things from current list: ' + message);
                        done(message);
                    }).catch(function(err) {
                        console.log('List does not exists, let us create a new one!');
                        listOps.newList(userId, listName).then(function(list) {
                            listOps.saveState(userId, listName); // New list means, we also update latest state.
                            done(list);
                        });
                    });
                    break;
                case "pridej":
                    if (!data.first) {
                        done('Musis napsat, co presne chces pridat na aktualni seznam.');
                    } else {
                        var listName = state.Item.listName;
                        var item = data.second;
                        listOps.updateList(userId, listName, item, function(callback) {
                            console.log(callback);
                            done(callback);
                        });
                    }
                    break;
                case "ukaz":
                    listName = state.Item.listName;
                    listOps.getList(userId, listName, function(callback) {
                        console.log(callback);
                        message = callback;
                    });
                    done(message);
                    break;
                case "seznamy":
                    listOps.listLists(userId, function(callback) {
                        console.log(callback);
                        message = callback;
                    });
                    // WRITE latest state of user, whatever that means. listOps.stateUpdate(userId, listName);
                    done(message);
                    break;
                default:
                    done('Bohuzel, tento prikaz neznam, zkus napsat HELP.');
            }
        }).catch(function(err) {
            // State not found in DB = create new user...
        });
    });
});

/*
                case "ahoj":
                    if (!data.second) { done ('Ahoj! Zkus napsat za ahoj jeste neco a ja to zopakuji.');
                    } else {
                    done('Ahoj znova, napsal si ' + data.second + ', ze mam pravdu?');
                    }
                case "ano":
                case "jo":
                    done ('Ja vim, ze ano...');
                case "ne":
                case "kdepak":
                    done ('Jeden z nas se jiste myli...');





*/