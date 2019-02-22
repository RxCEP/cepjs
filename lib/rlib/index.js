const { of, from, fromEvent, timer, interval, merge } = require('rxjs');
const { filter, tap, map, debounceTime, throttleTime, delay, skip, skipWhile, skipUntil, take, takeUntil,
    takeWhile, mergeMap, concatMap, retry, share } = require('rxjs/operators');

const context = require('./operations/context');
const transformation = require('./operations/transformation');
const logical = require('./operations/patterns/logical');
const spatial = require('./operations/patterns/spatial');
const modal = require('./operations/patterns/modal');
const subset = require('./operations/patterns/subset');
const threshold = require('./operations/patterns/threshold');
const trend = require('./operations/patterns/trend');

const { Point, hemisphere } = require('./location');

const composeLeft = (eventStream, operations) => eventStream.stream.pipe(...operations);

const run = (eventStream, observer) => eventStream.stream.subscribe(observer);

const unsubscribe = (streamSubscription) => streamSubscription.subscription.unsubscribe();

module.exports = {
    Point,
    hemisphere,
    composeLeft,
    run,
    unsubscribe,
    //cep operations
    context,
    transformation,
    logical,
    spatial,
    modal,
    subset,
    threshold,
    trend,
    //factory operations
    of,
    from,
    fromEvent,
    timer,
    interval,
    merge,
    // general-purpose operations
    tap,
    retry,
    share,
    filter,
    map,
    debounce: debounceTime,
    throttle: throttleTime,
    delay,
    skip, skipWhile, skipUntil,
    take, takeWhile, takeUntil,
    mergeMap,
    concatMap
}