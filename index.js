"use strict";
var apiai = require('apiai');
const uuid = require('uuid');

var ApiAiRecognizer = function(token){
    this.app = apiai(token);
};


ApiAiRecognizer.prototype.recognize = function (context, done){
            var intent = { score: 0.0 };
            try {            
                var sessionId = context.message.address.user.id + context.message.address.channelId;
                if (sessionId.length > 36){
                    sessionId = sessionId.slice(0,35);
                }
            } catch(err) {
                var sessionId = uuid();
            }
    
            if (context.message.text){
                var request = this.app.textRequest(context.message.text.toLowerCase(),{sessionId: sessionId});

                request.on('response', function(response){
                    var result = response.result;
                    if (result.source == 'domains'){
                        entities_found = [
                            {
                                entity: result.fulfillment.speech,
                                type: 'fulfillment',
                                startIndex: -1,
                                endIndex: -1,
                                score: 1
                            },
                            {
                                entity: result.actionIncomplete,
                                type: 'actionIncomplete',
                                startIndex: -1,
                                endIndex: -1,
                                score: 1
                            }
                        ];

                        intent = { score: result.score, intent: result.action, entities: entities_found };
                    } else if (result.source == 'agent'){
                       var entities_found = [
                            {
                                entity: result.fulfillment.speech,
                                type: 'fulfillment',
                                startIndex: -1,
                                endIndex: -1,
                                score: 1
                            },
                            {
                                entity: result.actionIncomplete,
                                type: 'actionIncomplete',
                                startIndex: -1,
                                endIndex: -1,
                                score: 1
                            }
                        ];

                        for (var key in result.parameters){
                            let entity = result.parameters[key];
                            let length = entity.length;

                            if (length > 0){
                                let type = key;
                                let score = 1;
                                let startIndex = context.message.text.indexOf(entity);
                                let endIndex = startIndex + length - 1;

                                let entity_found = {
                                    entity: entity,
                                    type: type,
                                    startIndex: startIndex,
                                    endIndex: endIndex,
                                    score: score
                                };

                                entities_found.push(entity_found);
                            }
                        }
                        intent = { score: result.score, intent: result.metadata.intentName, entities: entities_found };
                    }
                    done(null, intent);
                });

                request.on('error', function(error){
                    console.log(error);
                    done(error);
                });

                request.end(); 
            }
            else{
                intent = {score:1, intent:"None",entities:[]};
                done(null, intent);
            }
}

module.exports = ApiAiRecognizer;
