const { timer, race, from } = require('rxjs');
const { filter, bufferCount, bufferTime, bufferToggle, share, map, mergeMap } = require('rxjs/operators');
const R = require('ramda');
const { getRecurrenceMilliseconds, ordering, occProp, detcProp } = require('../helperTime');
const { predEvtTypeList, getProp } = require('../helperFunctions');

const differenceInMilliseconds = require('date-fns/difference_in_milliseconds');

/* windows */
/**
 * Splits the stream into sets of fixed size.
 * @param {number} size - the window size.
 * @return {EventStream} a new event stream instance.
 */
const tumblingCountWindow = size => bufferCount(size);

/**
 * Splits the stream into sets of fixed size. Additionally, it receives a second parameter 
 * that control when a new window must be open. If slidingInterval is less than the window size, it will
 * produce overlapping sets.
 * @param {number} size - the window size.
 * @param {number} slidingInterval- the interval at which a new window must be open. It defaults to 1.
 * @return {EventStream} a new event stream instance.
 */
const slidingCountWindow = (size, slidingInterval = 1) => bufferCount(size, slidingInterval);

/**
 * Splits the stream into sets of time-based fixed size.
 * @param {number} timeSize - the window size in milliseconds.
 * @return {EventStream} a new event stream instance.
 */
const tumblingTimeWindow = timeSize => bufferTime(timeSize);

/**
 * Splits the stream into sets of time-based fixed size. Additionally, it receives a second parameter 
 * that control when a new window must be open. If slidingInterval is less than timeSize, it will
 * produce overlapping sets.
 * @param {number} timeSize - the window size in milliseconds.
 * @param {number} slidingInterval - the interval (milliseconds) at which a new window must be open.
 * @return {EventStream} a new event stream instance.
 */
const slidingTimeWindow = (timeSize, slidingInterval) => bufferTime(timeSize, slidingInterval);

/**
 * 
 * @param {date} start 
 * @param {date|number} end 
 * @param {recurrence} recurrence 
 * @param {ordering} order 
 * @return {EventStream} a new event stream instance.
 */
const fixedIntervalWindow = (start, end,  recurrence, order) => stream => {
    const recurrenceMilliseconds = getRecurrenceMilliseconds(start, recurrence);
    
    const diffEnd = R.is(Number, end) ? end : differenceInMilliseconds(end, start);

    const orderingProp = order === ordering.OCCURRENCE_TIME ? occProp : detcProp;

    return stream.pipe(bufferToggle(timer(start, recurrenceMilliseconds), () => timer(diffEnd)),
                filter(R.filter(R.compose(time => time >= start.getTime(), orderingProp))));
}

/**
 * 
 * @param {string[]} initiatorEvents - a list containing the event types ids of the instances that initiates the window.
 * @param {string[]} terminatorEvents - a list containing the event types ids of the instances that close the window.
 * @param {number} [expirationTime] - an optional time period used to close the window in case a terminator event
 * has not been detected so far.
 * @return {EventStream} a new event stream instance.
 */
const eventIntervalWindow = (initiatorEvents, terminatorEvents, expirationTime) => stream => {
    const predsInit = predEvtTypeList(initiatorEvents);
    const predsTerm = predEvtTypeList(terminatorEvents);

    const source0 = stream.pipe(share());

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
const groupBy = attribute => stream => 
            stream.pipe(map(R.groupWith(R.eqBy(getProp(attribute)))), mergeMap(buffer => from(buffer)));


module.exports = {
    tumblingCountWindow, tumblingTimeWindow,
    slidingCountWindow, slidingTimeWindow,
    fixedIntervalWindow,
    eventIntervalWindow,
    groupBy
};