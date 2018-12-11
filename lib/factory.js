const {of: libOf, from: libFrom, fromEvent: libFromEvent,
    interval: libInterval, timer: libTimer} = require('./rlib').factoryOperators;
const {map} = require('./rlib').operators;
const {detcTimeLens} = require('./rlib/helperTime.js');

const R = require('ramda');

const {EventStream} = require('./eventhandlers.js');
const EventType = require('./eventtype.js');

/**
 * @param {*[]} values - values that are emitted in sequence.
 * @param {Function} [adaptor] - a function responsable for mapping the values emitted by the stream into instances
 * of the EventType class or its subclasses.
 * @return {EventStream} a new event stream instance.
 */
function of(/*...values, adaptor*/){
    const args = [...arguments];
    const adaptor = args[args.length - 1];

    const currDate = new Date();
    let newEvtOccurence = new EventType('of', 'of', currDate, currDate);

    return new EventStream(arguments.length > 1 && R.is(Function, adaptor)
        ? R.apply(libOf, R.dropLast(1, args)).pipe(map(adaptor), map(R.set(detcTimeLens, currDate)))
        : R.apply(libOf, args).pipe(map(val => R.assoc('payload', val, newEvtOccurence)))
        );
}

/**
 * 
 * @param {Array|Promise|Iterable} source
 * @param {Function} [adaptor] - a function responsable for mapping the values emitted by the stream into instances
 * of the EventType class or its subclasses.
 * @return {EventStream} a new event stream instance.
 */
function from(source, adaptor){
    const currDate = new Date();
    let newEvtOccurence = new EventType('from', 'from', currDate, currDate);

    return new EventStream(R.is(Function, adaptor)
        ? libFrom(source).pipe(map(adaptor), map(R.set(detcTimeLens, currDate)))
        : libFrom(source).pipe(map(val => R.assoc('payload', val, newEvtOccurence)))
        );
}

/**
 * 
 * @param {EventTargetLike} target 
 * @param {string} eventName 
 * @param {Object} optionalParameters - an object that can have two optional attributes: options and adaptor.
 * options corresponds to the EventListenerOptions passed through to addEventListener. adaptor is a function responsable
 * for mapping the values emitted by the stream into instances of the EventType class or any EventType's subclass.
 * @return {EventStream} a new event stream instance.
 */
function fromEvent(target, eventName, {options, adaptor} = {}) {
    const currDate = new Date();
    let newEvtOccurence = new EventType('from', 'from', currDate, currDate);
    
    return new EvenStream(R.is(Function, adaptor)
        ? libFromEvent(target, eventName, options).pipe(map(adaptor), map(R.set(detcTimeLens, currDate)))
        : libFromEvent(target, eventName, options).pipe(map(val => R.assoc('payload', val, newEvtOccurence)))
        );
}
/**
 * 
 * @param {number} period 
 * @param {Function} [adaptor] - a function responsable for mapping the values emitted by the stream into instances
 * of the EventType class or its subclasses.
 * @return {EventStream} a new event stream instance.
 */
function interval(period, adaptor){
    const currDate = new Date();
    let newEvtOccurence = new EventType('interval', 'interval', currDate, currDate);

    return new EventStream(R.is(Function, adaptor)
    ? libInterval(period).pipe(map(adaptor), map(R.set(detcTimeLens, currDate)))
    : libInterval(period).pipe(map(val => R.assoc('payload', val, newEvtOccurence)))
    );
}
/**
 * @param {number|Date} initialDelay
 * @param {number} [period]
 * @param {Function} [adaptor] - a function responsable for mapping the values emitted by the stream into instances
 * of the EventType class or its subclasses.
 * @param {Object} optionalParameters - an object that can have two optional attributes: period and adaptor.
 * period dictates how often subsequent values should be emitted. adaptor is a function responsable
 * for mapping the values emitted by the stream into instances of the EventType class or any EventType's subclass.
 */
function timer(initialDelay, {period, adaptor} = {}){
    const currDate = new Date();
    let newEvtOccurence = new EventType('timer', 'timer', currDate, currDate);

    return new EventStream(R.is(Function, adaptor)
        ? libTimer(initialDelay, period).pipe(map(adaptor), map(R.set(detcTimeLens, currDate)))
        : libTimer(initialDelay, period).pipe(map(val => R.assoc('payload', val, newEvtOccurence)))
        );
}

module.exports = {
    of,
    from,
    fromEvent,
    interval,
    timer
}