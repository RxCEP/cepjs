const _ = require('lodash/fp');
const EventStream = require('../eventstream');
const { flatStream } = require('../../helperFunctions');

const flatEventStream = flatStream(EventStream);

module.exports = function createGeneralOperators(cepjsMost) {
  const operations = cepjsMost.lib.core;

  const retry = _.curry((n, stream) =>
    operations.recoverWith(e => n <= 0 ? operations.throwError(e) : retry(n - 1, stream),
      stream));

  const operators = {};

  /**
  * 
  * @param {Function} fn
  * @return {Stream} a new stream instance
  */
  operators.tap = fn => operations.tap(fn);

  /**
  * 
  * @param {number} count 
  * @return {Stream} a new stream instance.
  */
  operators.retry = count => retry(count);

  /**
  * 
  * @return {Stream} a new stream instance.
  */
  operators.share = operators.multicast = () => stream => operations.multicast(stream);

  /**
  * 
  * @param {Function} fn 
  * @return {Stream} a new stream instance.
  */
  operators.filter = fn => operations.filter(fn);

  /**
  * 
  * @param {number} timeDuration
  * @return {Stream} a new stream instance.
  */
  operators.debounce = timeDuration => operations.debounce(timeDuration);

  /**
  * 
  * @param {number} timeDuration
  * @return {Stream} a new stream instance.
  */
  operators.throttle = timeDuration => operations.throttle(timeDuration);

  /**
  * Delay the event stream's emission.
  * @param {number} timeDelay
  * @return {Stream} a new stream instance.
  */
  operators.delay = timeDelay => operations.delay(timeDelay);

  /**
  * Skip a given number of events.
  * @param {number} count - the number of events to be skipped.
  * @return {Stream} a new stream instance.
  */
  operators.skip = count => operations.skip(count);

  /**
  * Skip events while the given predicate doesn't return false.
  * @param {Function} predicate - a predicate that controls events' emission.
  * @return {Stream} a new stream instance.
  */
  operators.skipWhile = predicate => operations.skipWhile(predicate);

  /**
  * Skip events until the provided event stream smits.
  * @param {EventStream} outerEventStream - some event stream instance.
  * @return {Stream} a new stream instance.
  */
  operators.skipUntil = outerEventStream => operations.since(flatEventStream(outerEventStream));

  /**
  * Take only the provided number of events and then completes.
  * @param {number} count - the number of events to be taken.
  * @return {Stream} a new stream instance.
  */
  operators.take = count => operations.take(count);

  /**
  * Take events while the given predicate doesn't return false.
  * @param {Function} predicate - a predicate that controls events' emission.
  * @return {Stream} a new stream instance.
   */
  operators.takeWhile = predicate => operations.takeWhile(predicate);

  /**
  * Take events until the provided event stream smits.
  * @param {EventStream} outerEventStream - some event stream instance.
  * @return {Stream} a new stream instance.
  */
  operators.takeUntil = outerEventStream => operations.until(flatEventStream(outerEventStream));

  /**
  * 
  * @param {Function} projectionFn 
  * @return {Stream} a new stream instance.
  */
  operators.mergeMap = operators.flatMap = projectionFn => operations.chain(_.compose(flatEventStream, projectionFn));

  /**
  * 
  * @param {Function} projectionFn 
  * @return {Stream} a new stream instance.
  */
  operators.concatMap = projectionFn => operations.concatMap(_.compose(flatEventStream, projectionFn));

  return operators;
}