var botBuilder = require('claudia-bot-builder');
var parse = require('./common/parse.js');
var listOps = require('./listops/mainOps.js');

module.exports = botBuilder(function(request) {
    var data = parse.parseInputOrder(request.text); // Completely parsed incoming message into OBJECT called data, with attributes first, second, third, fourth and fifth.
    var userId = request.sender; // We always got a userId available.
    // Full history record. Currently disabled for testing.
    //listOps.saveHistory(userId, request.text);

    return new Promise(function(done) {
        listOps.loadState(userId).then(function(state) { // READ latest state of user. If state is not present, run init script to create necessary table entries.
            console.log(state);
            console.log(data);
            // MAIN switch
            switch (data.first) {
                case "help":
                case "pomoc":
                case "hello":
                case "halo":
                case "hi":
                case "ahoj":
                    var message = 'Ahoj! Ja jsem Nezapominak, Tvuj pomocnik s listecky a tahaky k nakupum a podobnym akcim. Ovladej mne snadno: pomoci prikazu SEZNAM vypises aktualni seznam, pripadne pomoci SEZNAM JMENO SEZNAMU prepni aktivni seznam. Prikazem PRIDEJ NECO pridas neco na aktivni seznam. Prikazem VYHOD NECO odebiras polozky z aktivniho seznamu a prikazem SMAZ JMENO SEZNAMU smazes cely jeden seznam. Dalsi napovedu ziskas po napsani prikazu NAPOVEDA. Preji hezky den!';
                    done (message);
                    break;
                case "napoveda":
                    var message = 'Ahoj! Ja jsem Nezapminak, jednoducha aplikace dostupna kdekoli, kde mate pristup na Facebook Messenger. Zakladnim prikazem SEZNAM zakladate nove seznamy a prepinate mezi seznamy. Prikazem UKAZ lze vypsat obsah seznamu, aniz by doslo ke zmene prave aktivniho. PRIDEJ NECO a VYHOD neco jsou zakladni prikazy pro praci s polozkami v seznamech. SMAZ pak slouzi ke smazani celeho seznamu. Autori mne vytvorili teprve nedavno, takze toho moc neumim, ale mi tvurci bedlive sleduji situaci a diky nim rostu a rostu! V pripade dalsich datazu se nebojte obratit na mou Facebookovou stranku!';
                    done (message);
                    break;
                case "autori":
                case "nezapominak":
                    var message = 'Moje zdrojove kody najdete na GitHubu, pro provoz pouzivam Amazon a momentalne jsem integrovany pouze do Facebook Messengeru. Mi tvurci mi pomahaji s rustem a tak se kazdy den naucim neco noveho.';
                    done (message);
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
                        var message = 'Seznam ' + listName + ' je aktivni. Seznam momentalne obsahuje: ';
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
                            var message = 'Zalozil jsem Ti novy seznam ' + listName + ', muzes zacit pridavat polozky.';
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
                    if (!data.second) {
                        var listName = state.Item.listName;
                    } else {
                        var listName = data.second;
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
                        var message = 'Seznam ' + listName + ' je prazdny nebo neexistuje.';
                        done(message);
                    });
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
                    done('Jsem zatim velice mlady a musim se toho jeste hodne naucit, ale neboj, ucim se rychle! Snad Ti zatim bude stacit napsat prikaz POMOC nebo rovnou NAPOVEDA.');
            }
        }).catch(function(err) {
            listOps.newUser(userId);
            var message = 'Ahoj! My se koukam jeste vubec nezname, ale to nevadi! Zalozil jsem ti zbrusu novy seznam NAKUP (tak to delam, kdyz prijde nekdo novy). Momentalne na tom seznamu neni vubec nic, ale smele zacni pridavat polozky prikazem PRIDEJ. Pokud potrebujes vedet vic, napis prikaz POMOC.';
            done(message);
            // State not found in DB = create new user...
            //listOps.newUser(userId).then(function(response){
            //   var message = 'Ahoj! My se koukam jeste vubec nezname, ale to nevadi! Zalozil jsem ti zbrusu novy seznam NAKUP (tak to delam, kdyz prijde nekdo novy). Momentalne na tom seznamu neni vubec nic, ale smele zacni pridavat polozky prikazem PRIDEJ. Pokud potrebujes vedet vic, napis prikaz POMOC.';
            //   done(message);
            //}).catch(function(err) {
            //   var message = 'Jejda! Neco se pokazilo. Chybu jsem zaznamenal a uz jsem dal vedet svym tvurcum, co maji vylepsit ci opravit. Diky za pochopeni.';
            //   done(message);
            //});
        });
    });
});