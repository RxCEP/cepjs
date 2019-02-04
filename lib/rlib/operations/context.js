const { timer, race, from } = require('rxjs');
const { filter, bufferCount, bufferTime, bufferToggle, share, map, mergeMap } = require('rxjs/operators');
const R = require('ramda');
const { getRecurrenceMilliseconds, ordering } = require('../helperTime');
const { occProp, detcProp, predEvtTypeList, getProp } = require('../helperFunctions');

const isToday = require('date-fns/is_today');
const isAfter = require('date-fns/is_after');
const differenceInMilliseconds = require('date-fns/difference_in_milliseconds');

/* windows */
/**
 * 
 * @param {number} n
 * @return {EventStream} a new event stream instance.
 */
const tumblingCountWindow = n => bufferCount(n);

/**
 * 
 * @param {number} n
 * @return {EventStream} a new event stream instance.
 */
const slidingCountWindow = (n) => (source) => {
    return source.pipe(bufferCount(n, 1),filter(x => x.length == n));
}

/**
 * 
 * @param {number} n 
 * @param {number} hopSize 
 * @return {EventStream} a new event stream instance.
 */
const hoppingCountWindow = (n, hopSize) => bufferCount(n, hopSize);

/**
 * 
 * @param {number} mSeconds 
 * @return {EventStream} a new event stream instance.
 */
const tumblingTemporalWindow = ms => bufferTime(ms);

/**
 * 
 * @param {number} mSeconds 
 * @param {number} hopSize 
 * @return {EventStream} a new event stream instance.
 */
const hoppingTemporalWindow = (ms, hopSize) => bufferTime(ms, hopSize);

/**
 * 
 * @param {date} start 
 * @param {date|number} end 
 * @param {recurrence} recurrence 
 * @param {ordering} order 
 * @return {EventStream} a new event stream instance.
 */
const fixedIntervalWindow = (start, end,  recurrence, order) => (source) => {
    const recurrenceMilliseconds = getRecurrenceMilliseconds(start, recurrence);
    
    const diffEnd = R.is(Number, end) ? end : differenceInMilliseconds(end, start);

    const orderingProp = order === ordering.OCCURRENCE_TIME ? occProp : detcProp;

    return source.pipe(bufferToggle(timer(start, recurrenceMilliseconds), () => timer(diffEnd)),
                filter(R.filter(R.either(R.compose(isToday, orderingProp),
                                    R.compose(isAfter(start), orderingProp)))));
}

/**
 * 
 * @param {string[]} initiatorEvents - a list containing the event types ids of the instances that initiates the window.
 * @param {string[]} terminatorEvents - a list containing the event types ids of the instances that close the window.
 * @param {number} [expirationTime] - an optional time period used to close the window in case a terminator event
 * has not been detected so far.
 * @return {EventStream} a new event stream instance.
 */
const eventIntervalWindow = (initiatorEvents, terminatorEvents, expirationTime) => (source) => {
    const predsInit = predEvtTypeList(initiatorEvents);
    const predsTerm = predEvtTypeList(terminatorEvents);

    const source0 = source.pipe(share());

    const source1 = source0.pipe(filter(R.cond(predsInit)));
    const source2 = source0.pipe(filter(R.cond(predsTerm)));

    return expirationTime
        ? source0.pipe(bufferToggle(source1, () => race(source2, timer(expirationTime))))
        : source0.pipe(bufferToggle(source1, () => source2));
}

/**
 * 
 * @param {(string|(string|number)[])} attribute - the given event attribute to be considered. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @return {EventStream} a new event stream instance.
 */
const groupBy = (attribute) => (source) => 
            source.pipe(map(R.groupWith(R.eqBy(getProp(attribute)))), mergeMap(s => from(s)));


module.exports = {
    tumblingCountWindow,
    slidingCountWindow,
    hoppingCountWindow,
    tumblingTemporalWindow,
    hoppingTemporalWindow,
    fixedIntervalWindow,
    eventIntervalWindow,
    groupBy
};