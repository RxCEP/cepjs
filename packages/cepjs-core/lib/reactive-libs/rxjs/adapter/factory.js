const _ = require('lodash/fp');

const EventStream = require('../eventstream');
const eventStream = EventStream.eventStream;
const { flatStream } = require('../../helperFunctions');
const { generateNewEvtOccurrence, checkOccurrenceTime,
  generateFromEventStream, generateTimerStream } = require('../../common/factory');

const flatEventStream = flatStream(EventStream);

module.exports = function createFactoryOperators(cepjsRx) {
  const { of, from, fromEvent, interval, timer, merge } = cepjsRx.lib.core;
  const { map } = cepjsRx.lib.operators;

  const generateStreamWithAdaptor = (adaptor, stream) => {
    const currTime = Date.now();

    return stream.pipe(map(adaptor),
      map(checkOccurrenceTime(currTime)), map(_.set('_detectionTime', currTime)));
  }

  const generateStreamWithoutAdaptor = (evtTypeId, stream) =>
    stream.pipe(map(val => _.set('payload', val, generateNewEvtOccurrence(evtTypeId, Date.now()))))

  const operators = {};

  /**
  * 
  * @param {*[]} values - values that are emitted in sequence.
  * @param {Function} [adaptor] - a function responsable for mapping the values emitted by the stream into instances
  * of the EventType class or its subclasses.
  * @return {EventStream} a new event stream instance.
  */
  operators.of = (...args) => { /*...values, adaptor*/
    const adaptor = args[args.length - 1];

    return args.length > 1 && _.isFunction(adaptor) ?
      eventStream(generateStreamWithAdaptor(adaptor, of(...(_.initial(args))))) :
      eventStream(generateStreamWithoutAdaptor('of', of(...args)));
  }

  /**
  * 
  * @param {Array|Promise|Iterable} source
  * @param {Function} [adaptor] - a function responsable for mapping the values emitted by the stream into instances
  * of the EventType class or its subclasses.
  * @return {EventStream} a new event stream instance.
  */
  operators.from = (source, adaptor) =>
    _.isFunction(adaptor) ?
      eventStream(generateStreamWithAdaptor(adaptor, from(source))) :
      eventStream(generateStreamWithoutAdaptor('from', from(source)));

  /**
  * 
  * @param {EventTargetLike} target 
  * @param {string} eventName 
  * @param {boolean} [useCapture]
  * @param {Function} [adaptor] - adaptor is a function responsable
  * for mapping the values emitted by the stream into instances of the EventType class or any EventType's subclass.
  * @return {EventStream} a new event stream instance.
  */
  operators.fromEvent = (target, eventName, useCapture, adaptor) =>
    eventStream(
      generateFromEventStream(target, eventName, useCapture, adaptor,
        generateStreamWithAdaptor, generateStreamWithoutAdaptor, fromEvent));

  /**
  * 
  * @param {number} period 
  * @param {Function} [adaptor] - a function responsable for mapping the values emitted by the stream into instances
  * of the EventType class or its subclasses.
  * @return {EventStream} a new event stream instance.
  */
  operators.interval = (period, adaptor) =>
    _.isFunction(adaptor) ?
      eventStream(generateStreamWithAdaptor(adaptor, interval(period))) :
      eventStream(generateStreamWithoutAdaptor('interval', interval(period)));

  /**
  * 
  * @param {number|Date} initialDelay
  * @param {Object} [period] - dictates how often subsequent values should be emitted.
  * @param {Function} [adaptor] - a function responsable for mapping the values emitted by the stream into instances
  * of the EventType class or any EventType's subclass.
  * @return {EventStream} a new event stream instance.
  */
  operators.timer = (initialDelay, period, adaptor) =>
    eventStream(generateTimerStream(initialDelay, period, adaptor,
      generateStreamWithAdaptor, generateStreamWithoutAdaptor, timer));

  /**
  * 
  * @param  {...EventStream} eventStreams
  * @return {EventStream} a new event stream instance.
  */
  operators.merge = (...eventStreams) => {
    const streams = eventStreams.map(eventStream => flatEventStream(eventStream));
    return eventStream(merge(...streams));
  }

  return operators;
}