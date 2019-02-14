const { filter: rFilter, tap: rTap, map: rMap, debounceTime: rDebounceTime, throttleTime: rThrottleTime,
    delay: rDelay, skip: rSkip, skipWhile: rSkipWhile, skipUntil: rSkipUntil, take: rTake, takeUntil: rTakeUntil,
    takeWhile: rTakeWhile, mergeMap: rMergeMap, concatMap: rConcatMap, switchMap: rSwitchMap,
    retry: rRetry, share: rShare, merge: rMerge } = require('rxjs/operators');
const R = require('ramda');

const context = require('./context');
const transformation = require('./transformation');
const logical = require('./patterns/logical');
const spatial = require('./patterns/spatial');
const modal = require('./patterns/modal');
const subset = require('./patterns/subset');
const threshold = require('./patterns/threshold');
const trend = require('./patterns/trend');

const { flatStream } = require('../helperFunctions');

/* general-purpose stream manipulation */
/**
 * 
 * @param {Function} fn
 * @return {EventStream} a new event stream instance.
 */
const tap = fn => rTap(fn);

/**
 * 
 * @param {number} count 
 * @return {EventStream} a new event stream instance.
 */
const retry = count => rRetry(count);

/**
 * 
 * @return {EventStream} a new event stream instance.
 */
const multicast = () => share();

/**
 * 
 * @return {EventStream} a new event stream instance.
 */
const share = () => rShare();

/**
 * 
 * @param {Function} fn 
 * @return {EventStream} a new event stream instance.
 */
const filter = fn => rFilter(fn);

/**
 * 
 * @param {...EventStream} eventStreams
 * @return {EventStream} the new stream created from the merge operation.
 */
const merge = (...eventStreams) => {
    const streams = eventStreams.map((eventStream) => flatStream(eventStream));
    return rMerge(...streams);
}

// under review
/**
 * 
 * @param {Function} projectionFn 
 * @return {EventStream} a new event stream instance.
 */
const map = projectionFn => rMap(projectionFn);

/**
 * 
 * @param {number} timeDuration
 * @return {EventStream} a new event stream instance.
 */
const debounce = timeDuration => rDebounceTime(timeDuration);

/**
 * 
 * @param {number} timeDuration
 * @return {EventStream} a new event stream instance.
 */
const throttle = timeDuration => rThrottleTime(timeDuration);

/**
 * Delay the event stream's emission.
 * @param {number} timeDelay
 * @return {EventStream} a new event stream instance.
 */
const delay = timeDelay => rDelay(timeDelay);

/**
 * Skip a given number of events.
 * @param {number} count - the number of events to be skipped.
 * @return {EventStream} a new event stream instance.
 */
const skip = count => rSkip(count);

/**
 * Skip events while the given predicate doesn't return false.
 * @param {Function} predicate - a predicate that controls events' emission.
 * @return {EventStream} a new event stream instance.
 */
const skipWhile = predicate => rSkipWhile(predicate);

/**
 * Skip events until the provided event stream smits.
 * @param {EventStream} outerEventStream - some event stream instance.
 * @return {EventStream} a new event stream instance.
 */
const skipUntil = outerEventStream => rSkipUntil(flatStream(outerEventStream));

/**
 * Take only the provided number of events and then completes.
 * @param {number} count - the number of events to be taken.
 * @return {EventStream} a new event stream instance.
 */
const take = count => rTake(count);

/**
 * Take events while the given predicate doesn't return false.
 * @param {Function} predicate - a predicate that controls events' emission.
 * @return {EventStream} a new event stream instance.
 */
const takeWhile = predicate => rTakeWhile(predicate);

/**
 * Take events until the provided event stream smits.
 * @param {EventStream} outerEventStream - some event stream instance.
 * @return {EventStream} a new event stream instance.
 */
const takeUntil = outerEventStream => rTakeUntil(flatStream(outerEventStream));

/**
 * 
 * @param {Function} projectionFn 
 * @return {EventStream} a new event stream instance.
 */
const mergeMap = projectionFn => rMergeMap(R.compose(flatStream, projectionFn));

/**
 * 
 * @param {Function} projectionFn 
 * @return {EventStream} a new event stream instance.
 */
const flatMap = projectionFn => mergeMap(projectionFn);

/**
 * 
 * @param {Function} projectionFn 
 * @return {EventStream} a new event stream instance.
 */
const concatMap = projectionFn => rConcatMap(R.compose(flatStream, projectionFn));


module.exports = {
    ...context,
    ...transformation,
    ...logical,
    ...spatial,
    ...modal,
    ...subset,
    ...threshold,
    ...trend,
    tap,
    retry,
    multicast, share,
    filter,
    merge,
    map,
    debounce,
    throttle,
    delay,
    skip, skipWhile, skipUntil,
    take, takeWhile, takeUntil,
    mergeMap, flatMap,
    concatMap
}