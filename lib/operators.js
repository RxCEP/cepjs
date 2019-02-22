const operators = require('./rlib');
const R = require('ramda');

const { flatStream } = require('./rlib/helperFunctions');


/* general-purpose stream manipulation */
/**
 * 
 * @param {Function} fn
 * @return {*} a new stream instance.
 */
const tap = fn => operators.tap(fn);

/**
 * 
 * @param {number} count 
 * @return {*} a new stream instance.
 */
const retry = count => operators.retry(count);

/**
 * 
 * @return {*} a new stream instance.
 */
const multicast = () => share();

/**
 * 
 * @return {*} a new stream instance.
 */
const share = () => operators.share();

/**
 * 
 * @param {Function} fn 
 * @return {*} a new stream instance.
 */
const filter = fn => operators.filter(fn);

// under review
/**
 * 
 * @param {Function} projectionFn 
 * @return {*} a new stream instance.
 */
const map = projectionFn => operators.map(projectionFn);

/**
 * 
 * @param {number} timeDuration
 * @return {*} a new stream instance.
 */
const debounce = timeDuration => operators.debounce(timeDuration);

/**
 * 
 * @param {number} timeDuration
 * @return {*} a new stream instance.
 */
const throttle = timeDuration => operators.throttle(timeDuration);

/**
 * Delay the event stream's emission.
 * @param {number} timeDelay
 * @return {*} a new stream instance.
 */
const delay = timeDelay => operators.delay(timeDelay);

/**
 * Skip a given number of events.
 * @param {number} count - the number of events to be skipped.
 * @return {*} a new stream instance.
 */
const skip = count => operators.skip(count);

/**
 * Skip events while the given predicate doesn't return false.
 * @param {Function} predicate - a predicate that controls events' emission.
 * @return {*} a new stream instance.
 */
const skipWhile = predicate => operators.skipWhile(predicate);

/**
 * Skip events until the provided event stream smits.
 * @param {EventStream} outerEventStream - some event stream instance.
 * @return {*} a new stream instance.
 */
const skipUntil = outerEventStream => operators.skipUntil(flatStream(outerEventStream));

/**
 * Take only the provided number of events and then completes.
 * @param {number} count - the number of events to be taken.
 * @return {*} a new stream instance.
 */
const take = count => operators.take(count);

/**
 * Take events while the given predicate doesn't return false.
 * @param {Function} predicate - a predicate that controls events' emission.
 * @return {*} a new stream instance.
 */
const takeWhile = predicate => operators.takeWhile(predicate);

/**
 * Take events until the provided event stream smits.
 * @param {EventStream} outerEventStream - some event stream instance.
 * @return {*} a new stream instance.
 */
const takeUntil = outerEventStream => operators.takeUntil(flatStream(outerEventStream));

/**
 * 
 * @param {Function} projectionFn 
 * @return {*} a new stream instance.
 */
const mergeMap = projectionFn => operators.mergeMap(R.compose(flatStream, projectionFn));

/**
 * 
 * @param {Function} projectionFn 
 * @return {*} a new stream instance.
 */
const flatMap = projectionFn => mergeMap(projectionFn);

/**
 * 
 * @param {Function} projectionFn 
 * @return {*} a new stream instance.
 */
const concatMap = projectionFn => operators.concatMap(R.compose(flatStream, projectionFn));


module.exports = {
    ...operators.context,
    ...operators.transformation,
    ...operators.logical,
    ...operators.spatial,
    ...operators.modal,
    ...operators.subset,
    ...operators.threshold,
    ...operators.trend,
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