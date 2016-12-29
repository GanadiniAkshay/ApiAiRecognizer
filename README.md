# api-ai-recognizer

### Use api.ai instead of LUIS in Microsoft Bot Framework


## Installation

npm install api-ai-recognizer

## Tutorial
http://blog.ozz.ai/using-api-ai-with-microsoft-bot-framework/

## Usage
&nbsp;&nbsp;&nbsp;&nbsp;var builder = require('botbuilder');  
&nbsp;&nbsp;&nbsp;&nbsp;var connector = new builder.ConsoleConnector().listen();  

&nbsp;&nbsp;&nbsp;&nbsp;var bot       = new builder.UniversalBot(connector);  

&nbsp;&nbsp;&nbsp;&nbsp;var apiairecognizer = require('api-ai-recognizer');  
&nbsp;&nbsp;&nbsp;&nbsp;var recognizer      = new apiairecognizer(<api.ai client access token>);  

&nbsp;&nbsp;&nbsp;&nbsp;var intents = new builder.IntentDialog({  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    recognizers: [recognizer];  
&nbsp;&nbsp;&nbsp;&nbsp;});  

&nbsp;&nbsp;&nbsp;&nbsp;bot.dialog('/',intents);  

&nbsp;&nbsp;&nbsp;&nbsp;intents.matches('intent.name',function(session,args){  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    session.send("your response");  
&nbsp;&nbsp;&nbsp;&nbsp;});

## Using Entities

Entities can be found in the args.entities object and can be retrieved using code like below:  
  
&nbsp;&nbsp;&nbsp;&nbsp;var city = builder.EntityRecognizer.findEntity(args.entities, 'city');  

The schema for each entity retrieved with the about method is as below:  

&nbsp;&nbsp;&nbsp;&nbsp; {
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  entity: 'entity value',  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  type  : 'entity name',   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  startIndex: 'start index of entity',   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  endIndex:   'end index of entity',  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  score:   1   
&nbsp;&nbsp;&nbsp;&nbsp; }


## Using Fulfillment

api.ai provides fulfillment which can be useful if you are using domains for your chat agent  

Fulfillments are available as entitities with the entity name as fulfillment and can be used like below:  

&nbsp;&nbsp;&nbsp;&nbsp; var fulfillment = builder.EntityRecognizer.findEntity(args.entities, 'fulfillment');  
&nbsp;&nbsp;&nbsp;&nbsp; if (fulfillment) {  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; var speech = fulfillment.entity;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; session.send(speech);  
&nbsp;&nbsp;&nbsp;&nbsp; }


## Using Prompts

You can use prompts provided by api.ai for required entities very easily. Just check the actionIncomplete entity from  
the entities list and if its true use the fulfillment to send out the prompt.


## Contributing

All feature requests, bug reprorts and pull requests are welcome!

## License

MIT
