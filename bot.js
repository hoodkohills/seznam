var botBuilder = require('claudia-bot-builder');
var parse = require('./common/parse.js');

module.exports = botBuilder(function (request) {
    console.log(request);
    console.log(request.text);
    var data = parse.parseInputOrder(request.text);
    console.log (data);
    console.log (data.first);
    console.log (data.second);
    console.log (data.third);
    console.log (data.fourth);
    console.log (data.fifth);
    switch(data.first) {
        case "ahoj":
            if (data.second = undefined) { return 'Ahoj! Zkus napsat za ahoj jeste neco a ja to zopakuji.'
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
        default:
            return 'Bohuzel, tento prikaz neznam, zkus napsat HELP.';
    }



});