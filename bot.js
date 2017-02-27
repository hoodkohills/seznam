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
    switch
    return 'Thanks for sending ' + request.text  + '. Your message is very important to us, but ...';
});