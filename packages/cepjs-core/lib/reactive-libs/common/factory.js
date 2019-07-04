const _ = require('lodash');

const EventType = require('../../eventtype');

const generateNewEvtOccurrence = (eventTypeId, currTime = Date.now()) => {
  return _.set(
    new EventType(eventTypeId, `${eventTypeId} operation`, currTime),
    '_detectionTime',
    currTime);
}

const checkOccurrenceTime = timestamp => evt =>
  evt.occurrenceTime ? evt : _.set(evt, 'occurrenceTime', timestamp);

const generateFromEventStream =
  (target, eventName, useCapture, adaptor, generateStreamAdaptor, generateStreamNoAdaptor, factoryOp) => {
    if (_.isFunction(useCapture)) {
      return generateStreamAdaptor(useCapture, factoryOp(target, eventName));
    } else {
      if (useCapture) {
        if (_.isFunction(adaptor)) {
          return generateStreamAdaptor(adaptor, factoryOp(target, eventName, useCapture));
        } else {
          return generateStreamNoAdaptor('fromEvent', factoryOp(target, eventName, useCapture));
        }
      } else {
        return generateStreamNoAdaptor('fromEvent', factoryOp(target, eventName));
      }
    }
  }

const generateTimerStream =
  (initialDelay, period, adaptor, generateStreamAdaptor, generateStreamNoAdaptor, factoryOp) => {
    if (_.isFunction(period)) {
      return generateStreamAdaptor(period, factoryOp(initialDelay, undefined));
    } else {
      if (_.isNumber(period)) {
        if (_.isFunction(adaptor)) {
          return generateStreamAdaptor(adaptor, factoryOp(initialDelay, period));
        } else {
          return generateStreamNoAdaptor('timer', factoryOp(initialDelay, period));
        }
      } else { //period and adaptor === undefined
        return generateStreamNoAdaptor('timer', factoryOp(initialDelay, undefined));
      }
    }
  }

module.exports = {
  generateNewEvtOccurrence,
  checkOccurrenceTime,
  generateFromEventStream,
  generateTimerStream
}