const _ = require('lodash/fp');

const EventStream = require('../eventstream');
const eventStream = EventStream.eventStream;
const { flatStream } = require('../../helperFunctions');
const { generateNewEvtOccurrence, checkOccurrenceTime,
  generateFromEventStream, generateTimerStream } = require('../../common/factory');

const flatEventStream = flatStream(EventStream);

module.exports = function createFactoryOperators(cepjsMost) {
  const { fromPromise, mergeArray, map } = cepjsMost.lib.core;
  const { fromArray } = cepjsMost.lib.mostFromArray;
  const { domEvent } = cepjsMost.lib.domEvent;
  const { fromEvent } = cepjsMost.lib.mostFromEvent;
  const { timer, interval } = cepjsMost.lib.mostRxUtils;

  const generateStreamWithAdaptor = (adaptor, stream) => {
    const currTime = Date.now();

    return eventStream(map(_.set('_detectionTime', currTime),
      map(checkOccurrenceTime(currTime),
        map(adaptor, stream))));
  }

  const generateStreamWithoutAdaptor = (evtTypeId, stream) =>
    map(val => _.set('payload', val, generateNewEvtOccurrence(evtTypeId, Date.now())),
      stream);

  const selectFromOp = source => source instanceof Promise ? fromPromise : _.compose(fromArray, Array.from);

  const selectFromEventOp = target => target instanceof Element ?
    domEvent : (eventName, emitter, $) => fromEvent(eventName, emitter);

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
      eventStream(generateStreamWithAdaptor(adaptor, fromArray(_.initial(args)))) :
      eventStream(generateStreamWithoutAdaptor('of', fromArray(args)));
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
      eventStream(generateStreamWithAdaptor(adaptor, selectFromOp(source))) :
      eventStream(generateStreamWithoutAdaptor('from', selectFromOp(source)));

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
      generateFromEventStream(eventName, target, useCapture, adaptor,
        generateStreamWithAdaptor, generateStreamWithoutAdaptor, selectFromEventOp(target)));

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
    eventStream(
      generateTimerStream(initialDelay, period, adaptor,
        generateStreamWithAdaptor, generateStreamWithoutAdaptor, timer));

  /**
  * 
  * @param  {...EventStream} eventStreams
  * @return {EventStream} a new event stream instance.
  */
  operators.merge = (...eventStreams) => {
    const streams = eventStreams.map(eventStream => flatEventStream(eventStream));
    return eventStream(mergeArray(streams));
  }

  return operators;
}