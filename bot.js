var botBuilder = require('claudia-bot-builder');
var parse = require('./common/parse.js');
var listOps = require('./listops/mainOps.js');

module.exports = botBuilder(function (request) {
    var data = parse.parseInputOrder(request.text); // Completely parsed incoming message into OBJECT called data, with attributes first, second, third, fourth and fifth.
    //console.log(request);
    //console.log(request.text);
    console.log (data);
    var listName = data.second; // You can't send an attribute of an object as argument. Extract attribute into new variable.
    var userId = request.sender; // We always got a userId available.

    // READ latest state of user. If state is not present, run init script to create necessary table entries.
    //var state = { listName: 'paja' }; // Currently hardcoded!

    return new Promise(function(done) {
        listOps.loadState(userId).then(function (state) {
            // MAIN switch
            switch(data.first) {
                case "ahoj":
                    if (!data.second) { done 'Ahoj! Zkus napsat za ahoj jeste neco a ja to zopakuji.'
                    } else {
                    done('Ahoj znova, napsal si ' + data.second + ', ze mam pravdu?');
                    }
                case "ano":
                case "jo":
                    done ('Ja vim, ze ano...');
                case "ne":
                case "kdepak":
                    done ('Jeden z nas se jiste myli...');
                case "help":
                case "pomoc":
                    done ('Zkus napsat prikaz `ahoj`!');
                    break;
                case "seznam":
                    if (!data.second) { done ('Za prikaz seznam jeste musis dopsat jmeno seznamu, ktery te zajima.');
                    } else {
                           var listName = state.listName;
                           var item = data.second;
                           listOps.newList(userId, listName, function (callback) {
                               listName = data.second;
                               listOps.saveState(userId, listName);
                               console.log(callback);
                               done(callback);
                           });
                    }
                case "pridej":
                    if (!data.second) { done ('Musis napsat, co presne chces pridat na aktualni seznam.');
                    } else {
                        done new Promise(function(done) {
                            var listName = state.listName;
                            var item = data.second;
                            listOps.updateList(userId, listName, item, function (callback) {
                                console.log(callback);
                                done(callback);
                            });
                        });
                    }
                    break;
                case "ukaz":
                    var listName = state.listName;
                    listOps.getList(userId, listName, function (callback) {
                    console.log(callback);
                    global.message = callback;
                    });
                    // WRITE latest state of user, whatever that means. listOps.stateUpdate(userId, listName);
                    done (message);
                    break;
                case "seznamy":
                    listOps.listLists(userId, function (callback) {
                    console.log(callback);
                    global.message = callback;
                    });
                    // WRITE latest state of user, whatever that means. listOps.stateUpdate(userId, listName);
                    done (message);

                default:
                    done ('Bohuzel, tento prikaz neznam, zkus napsat HELP.');
            }
        }).catch(function(err) {
        // create new user
        });
    });
});