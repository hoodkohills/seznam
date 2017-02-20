'use strict';
var https = require('https');
var PAGE_TOKEN = process.env.PAGE;
var VERIFY_TOKEN = process.env.TOKEN;
exports.handler = (event, context, callback) => {
  // process GET request
  if(event.params && event.params.querystring){
    var queryParams = event.params.querystring;
 
    var rVerifyToken = queryParams['hub.verify_token']
 
    if (rVerifyToken === VERIFY_TOKEN) {
      var challenge = queryParams['hub.challenge']
      callback(null, parseInt(challenge))
    }else{
      callback(null, 'Error, wrong validation token');
    }
 
  // process POST request
  }else{
 
    var messagingEvents = event.entry[0].messaging;
    for (var i = 0; i < messagingEvents.length; i++) {
      var messagingEvent = messagingEvents[i];
 
      var sender = messagingEvent.sender.id;
      if (messagingEvent.message && messagingEvent.message.text) {
        var text = messagingEvent.message.text; 
        console.log("Receive a message: " + text);
        
        sendTextMessage(sender, "Text prijat, echo: "+ text.substring(0, 200));
 
        callback(null, "Done")
      }
    }
 
    callback(null, event);
  }
};
function sendTextMessage(senderFbId, text) {
  var json = {
    recipient: {id: senderFbId},
    message: {text: text},
  };
  var body = JSON.stringify(json);
  var path = '/v2.6/me/messages?access_token=' + PAGE_TOKEN;
  var options = {
    host: "graph.facebook.com",
    path: path,
    method: 'POST',
    headers: {'Content-Type': 'application/json'}
  };
  var callback = function(response) {
    var str = ''
    response.on('data', function (chunk) {
      str += chunk;
    });
    response.on('end', function () {
 
    });
  }
  var req = https.request(options, callback);
  req.on('error', function(e) {
    console.log('problem with request: '+ e);
  });
 
  req.write(body);
  req.end();
}
