var botBuilder = require('claudia-bot-builder');
var parse = require('./common/parse.js');
var listOps = require('./listops/mainOps.js');

module.exports = botBuilder(function(request) {
    var data = parse.parseInputOrder(request.text); // Completely parsed incoming message into OBJECT called data, with attributes first, second, third, fourth and fifth.
    var userId = request.sender; // We always got a userId available.

    return new Promise(function(done) {
        listOps.loadState(userId).then(function(state) { // READ latest state of user. If state is not present, run init script to create necessary table entries.
            console.log(state);
            if (JSON.stringify(state) === '{}') {
            var message = 'Ahoj! My se jeste koukam nezname, ale to vubec nevadi! Zalozil jsem Ti novy seznam NAKUP (tak to delam pokazde, kdyz se s nekym seznamim). Muzes ho zacit plnit prikazem PRIDEJ. Pro napovedu staci napsat POMOC.';
            console.log('AHA! NEW USER DETECTED!')
            // listOps.newUser(userId);
            done(message);
            }
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
                        var message = 'Obsah prave aktivniho seznamu ' + listName + ': ';
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
                    if (!data.second) {
                        var listName = state.Item.listName.values[0];
                        var message = 'Musis napsat alespon jedno slovo, ktere si prejes pridat na seznam ' + listName + '.';
                        done(message);
                    } else {
                        var listName = state.Item.listName.values[0];
                        var item = data.second;
                        listOps.updateList(userId, listName, item).then(function(response) {
                            var message = 'OK, pridal jsem ' + item + ' na seznam ' + listName + '.';
                            done(message);
                        }).catch(function(err) {
                            var message = 'Oups, neco se pokazilo a nepridal jsem polozku na seznam, omlouvam se.';
                            done(message);
                        });
                    }
                    break;

                case "ukaz":
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
                        done(message);
                    }).catch(function(err) {
                        var message = 'Seznam ' + listName + ' je prazdny :).';
                        done(message);
                    });

                    break;

                case "zahod":
                    if (!data.second) {
                        //var listName = state.Item.listName.values[0];
                        var message = 'Musis napsat alespon jedno slovo, ktere si prejes smazat ze seznamu ' + listName + '.';
                        done(message);
                    } else {
                        var listName = state.Item.listName.values[0];
                        var item = data.second;
                        listOps.removeItem(userId, listName, item).then(function(response) {
                            var message = 'OK, smazal jsem ' + item + ' ze seznamu ' + listName + '.';
                            done(message);
                        }).catch(function(err) {
                            var message = 'Oups, neco se pokazilo a nesmazal jsem polozku ze seznamu, je mi to moc lito.';
                            done(message);
                        });
                    }
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

                case "seznamy":
                    listOps.listLists(userId).then(function(response){
                    var lists = '';
                    response.Items.forEach(function(item){
                        lists += item.list + ', ';
                    });
                    console.log(lists);
                    var message = 'Tvoje seznamy: ' + lists;
                    done(message);
                    }).catch(function(err) {
                        var message = 'Jejda, neco se pokazilo, nepodarilo se mi nacist Tvoje seznamy, omlouvam se.';
                        console.log(err);
                        done(message);
                    });
                    break;

                default:
                    var message = 'Je mi to samotnemu velmi lito, ale tento prikaz jeste neznam ci jsem ho nedokazal rozpoznat. Ucim se kazdy den. Pro napovedu staci napsat POMOC.';
                    done(message);
            }

        }).catch(function(err) {
            // State not found in DB = create new user...
            console.log(err);
            var message = 'Pokud toto ctete, tak se muselo neco osklive pokazit s nahravanim posledniho stavu. Vase data jsou nedotcena, ale jako cert vi! :)';
            done(message);
        });
    });
});