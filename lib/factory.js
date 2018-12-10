const {of: libOf, from: libFrom, fromEvent: libFromEvent,
    interval: libInterval, timer: libTimer} = require('./rlib').factoryOperators;
const {map} = require('./rlib').operators;
const {detcTimeLens} = require('./rlib/helperTime.js');

const R = require('ramda');

const {EventStream} = require('./eventhandlers.js');
const {EventType} = require('./eventtype.js');

const esConstructor = R.construct(EventStream);
const etConstructor = R.construct(EventType);


/**
 * @param {*[]} values - values that are emitted in sequence.
 * @param {Function} [adaptor] - a function responsable for mapping the values emitted by the stream into instances
 * of the EventType class or its subclasses.
 * @return {EventStream} a new event stream instance.
 */
function of(){
    const args = [...arguments];
    const adaptor = args[args.length - 1];

    const currDate = new Date();
    let newEvtOccurence = etConstructor('of', 'of', currDate, currDate);

    return esConstructor(arguments.length > 1 && R.is(Function, adaptor)
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
    let newEvtOccurence = etConstructor('from', 'from', currDate, currDate);

    return esConstructor(arguments.length > 1 && R.is(Function, adaptor)
        ? libFrom(source).pipe(map(adaptor), map(R.set(detcTimeLens, currDate)))
        : libFrom(source).pipe(map(val => R.assoc('payload', val, newEvtOccurence)))
        );
}

/**
 * 
 * @param {EventTargetLike} target 
 * @param {string} eventName 
 * @param {EventListenerOptions} [options]
 * @param {Function} [adaptor] - a function responsable for mapping the values emitted by the stream into instances
 * of the EventType class or its subclasses.
 * @return {EventStream} a new event stream instance.
 */
function fromEvent() {
    const args = [...arguments];
    const adaptor = args[args.length - 1];

    const currDate = new Date();
    let newEvtOccurence = etConstructor('from', 'from', currDate, currDate);

    return esConstructor(arguments.length > 2 && R.is(Function, adaptor)
        ? R.apply(libFromEvent, R.dropLast(1, args)).pipe(map(adaptor), map(R.set(detcTimeLens, currDate)))
        : R.apply(libFromEvent, args).pipe(map(val => R.assoc('payload', val, newEvtOccurence)))
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
    let newEvtOccurence = etConstructor('interval', 'interval', currDate, currDate);

    return esConstructor(arguments.length > 1 && R.is(Function, adaptor)
    ? libInterval(period).pipe(map(adaptor), map(R.set(detcTimeLens, currDate)))
    : libInterval(period).pipe(map(val => R.assoc('payload', val, newEvtOccurence)))
    );
}
/**
 * @param {number|Date} initialDelay
 * @param {number} [period]
 * @param {Function} [adaptor] - a function responsable for mapping the values emitted by the stream into instances
 * of the EventType class or its subclasses.
 */
function timer(){
    const args = [...arguments];
    const adaptor = args[args.length - 1];

    const currDate = new Date();
    let newEvtOccurence = etConstructor('timer', 'timer', currDate, currDate);

    return esConstructor(arguments.length > 1 && R.is(Function, adaptor)
        ? R.apply(libTimer, R.dropLast(1, args)).pipe(map(adaptor), map(R.set(detcTimeLens, currDate)))
        : R.apply(libTimer, args).pipe(map(val => R.assoc('payload', val, newEvtOccurence)))
        );
}

module.exports = {
    of,
    from,
    fromEvent,
    interval,
    timer
}