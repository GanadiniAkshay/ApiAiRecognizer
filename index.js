"use strict";
var apiai = require('apiai');
const uuid = require('uuid');

var ApiAiRecognizer = function(token){
    this.app = apiai(token);
    // not sure - is this the place?
    this._onEnabled = [];
    this._onFilter = [];
};


ApiAiRecognizer.prototype.recognize = function (context, done){
        var _this = this;

        this.isEnabled(context, function (err, enabled) {
            if (err) {
                callback(err, null);
            }
            else if (!enabled) {
                callback(null, { score: 0.0, intent: null });
            }
            else {


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
                var request = _this.app.textRequest(context.message.text.toLowerCase(),{sessionId: sessionId});
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
                    console.log('Error found on request to API.AI:',error);
                    done(error);
                });
                request.end(); 
            }
            else{
                intent = {score:1, intent:"None",entities:[]};
                done(null, intent);
            }

            }
        })

  
}

ApiAiRecognizer.prototype.onEnabled = function (handler) {
    this._onEnabled.unshift(handler);
    return this;
};

ApiAiRecognizer.prototype.onFilter = function (handler) {
    this._onFilter.push(handler);
    return this;
};

ApiAiRecognizer.prototype.isEnabled = function (context, callback) {
    var index = 0;
    var _that = this;
    function next(err, enabled) {
        if (index < _that._onEnabled.length && !err && enabled) {
            try {
                _that._onEnabled[index++](context, next);
            }
            catch (e) {
                callback(e, false);
            }
        }
        else {
            callback(err, enabled);
        }
    }
    next(null, true);
};

ApiAiRecognizer.prototype.filter = function (context, result, callback) {
    var index = 0;
    var _that = this;
    function next(err, r) {
        if (index < _that._onFilter.length && !err) {
            try {
                _that._onFilter[index++](context, r, next);
            }
            catch (e) {
                callback(e, null);
            }
        }
        else {
            callback(err, r);
        }
    }
    next(null, result);
};

module.exports = ApiAiRecognizer;
