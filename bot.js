var botBuilder = require('claudia-bot-builder');
var parse = require('./common/parse.js');

module.exports = botBuilder(function (request) {
    console.log(request);
    console.log(request.text);
    var data = parse.parseInputOrder(event.text);
    console.log (data);
    console.log (data[0]);
    console.log (data[1]);
    console.log (data[2]);
    console.log (data[3]);
    console.log (data[4]);
    console.log (first);
    console.log (second);
    console.log (third);
    console.log (fourth);
    console.log (fifth);
  return 'Thanks for sending ' + request.text  +
      '. Your message is very important to us, but ...';
});