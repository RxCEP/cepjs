const { filter: rFilter, tap: rTap, map: rMap, mergeMap: rMergeMap,
    concatMap: rConcatMap, switchMap: rSwitchMap, takeUntil: rTakeUntil,
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

const EventStream = require('../../eventstream');


const checkStream = eventStream => R.is(EventStream, eventStream) ? eventStream.stream : eventStream;

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
const multicast = () => rShare();

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
    const streams = eventStreams.map((eventStream) => checkStream(eventStream));
    return rMerge(...streams);
}

/**
 * 
 * @param {Function} projectionFn 
 * @return {EventStream} a new event stream instance.
 */
const map = projectionFn => rMap(projectionFn);

/**
 * 
 * @param {EventStream} outerEventStream - some event stream instance.
 * @return {EventStream} a new event stream instance.
 */
const takeUntil = outerEventStream => rTakeUntil(checkStream(outerEventStream));

/**
 * 
 * @param {Function} projectionFn 
 * @return {EventStream} a new event stream instance.
 */
const mergeMap = projectionFn => rMergeMap(R.compose(checkStream, projectionFn));

/**
 * 
 * @param {Function} projectionFn 
 * @return {EventStream} a new event stream instance.
 */
const concatMap = projectionFn => rConcatMap(R.compose(checkStream, projectionFn));

/**
 * 
 * @param {Function} projectionFn 
 * @return {EventStream} a new event stream instance.
 */
const switchMap = projectionFn => rSwitchMap(R.compose(checkStream, projectionFn));

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
    multicast,
    filter,
    merge,
    map,
    takeUntil,
    mergeMap,
    concatMap,
    switchMap
}