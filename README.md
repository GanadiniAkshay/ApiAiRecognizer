# API.ai Recoginzer for Microsoft Botframework 

### Based on: https://github.com/GanadiniAkshay/ApiAiRecognizer


## Installation
```
npm install botbuilder-apiai
```

## Usage
```js
var builder = require('botbuilder');  
var connector = new builder.ConsoleConnector().listen();  

var bot = new builder.UniversalBot(connector);  

var apiairecognizer = require('botbuilder-apiai');  
var recognizer      = new apiairecognizer(<api.ai client access token>);  

var intents = new builder.IntentDialog({  
    recognizers: [recognizer];  
});  

bot.dialog('/',intents);  

intents.matches('intent.name',function(session,args){  
    session.send("your response");  
});
```

## Using Entities

Entities can be found in the args.entities object and can be retrieved using code like below:  
```js
var city = builder.EntityRecognizer.findEntity(args.entities, 'city');  
```

The schema for each entity retrieved with the about method is as below:  
```json
 {
    "entity"    : "entity value",  
    "type"      : "entity name",   
    "startIndex": "start index of entity",   
    "endIndex"  : "end index of entity",  
    "score"     : 1   
 }
 ```


## Using Fulfillment

api.ai provides fulfillment which can be useful if you are using domains for your chat agent  

Fulfillments are available as entitities with the entity name as fulfillment and can be used like below:  
```js
var fulfillment = builder.EntityRecognizer.findEntity(args.entities, 'fulfillment');  
if (fulfillment) {  
  var speech = fulfillment.entity;
  session.send(speech);  
}
```

## Using Prompts

You can use prompts provided by api.ai for required entities very easily. Just check the actionIncomplete entity from  
the entities list and if its true use the fulfillment to send out the prompt.

## Added functionaliy
`onEnabled()` function has been added.

## Contributing

All feature requests, bug reprorts and pull requests are welcome!

## License

MIT
