const _ = require('lodash/fp');
const EventStream = require('../eventstream');
const { flatStream } = require('../../helperFunctions');

const flatEventStream = flatStream(EventStream);

module.exports = function createGeneralOperators(cepjsRx) {
  const operations = cepjsRx.lib.operators;

  const operators = {};

  /**
   * 
   * @param {Function} fn
   * @return {Observable} a new stream instance
   */
  operators.tap = fn => operations.tap(fn);

  /**
   * 
   * @param {number} count 
   * @return {Observable} a new stream instance.
   */
  operators.retry = count => operations.retry(count);

  /**
   * 
   * @return {Observable} a new stream instance.
   */
  operators.share = operators.multicast = () => operations.share();

  /**
   * 
   * @param {Function} fn 
   * @return {Observable} a new stream instance.
   */
  operators.filter = fn => operations.filter(fn);

  /**
   * 
   * @param {number} timeDuration
   * @return {Observable} a new stream instance.
   */
  operators.debounce = timeDuration => operations.debounceTime(timeDuration);

  /**
   * 
   * @param {number} timeDuration
   * @return {Observable} a new stream instance.
   */
  operators.throttle = timeDuration => operations.throttleTime(timeDuration);

  /**
   * Delay the event stream's emission.
   * @param {number} timeDelay
   * @return {Observable} a new stream instance.
   */
  operators.delay = timeDelay => operations.delay(timeDelay);

  /**
   * Skip a given number of events.
   * @param {number} count - the number of events to be skipped.
   * @return {Observable} a new stream instance.
   */
  operators.skip = count => operations.skip(count);

  /**
   * Skip events while the given predicate doesn't return false.
   * @param {Function} predicate - a predicate that controls events' emission.
   * @return {Observable} a new stream instance.
   */
  operators.skipWhile = predicate => operations.skipWhile(predicate);

  /**
   * Skip events until the provided event stream smits.
   * @param {EventStream} outerEventStream - some event stream instance.
   * @return {Observable} a new stream instance.
   */
  operators.skipUntil = outerEventStream => operations.skipUntil(flatEventStream(outerEventStream));

  /**
   * Take only the provided number of events and then completes.
   * @param {number} count - the number of events to be taken.
   * @return {Observable} a new stream instance.
   */
  operators.take = count => operations.take(count);

  /**
   * Take events while the given predicate doesn't return false.
   * @param {Function} predicate - a predicate that controls events' emission.
   * @return {Observable} a new stream instance.
   */
  operators.takeWhile = predicate => operations.takeWhile(predicate);

  /**
   * Take events until the provided event stream smits.
   * @param {EventStream} outerEventStream - some event stream instance.
   * @return {Observable} a new stream instance.
   */
  operators.takeUntil = outerEventStream => operations.takeUntil(flatEventStream(outerEventStream));

  /**
   * 
   * @param {Function} projectionFn 
   * @return {Observable} a new stream instance.
   */
  operators.mergeMap = operators.flatMap = projectionFn => operations.mergeMap(_.compose(flatEventStream, projectionFn));

  /**
   * 
   * @param {Function} projectionFn 
   * @return {Observable} a new stream instance.
   */
  operators.concatMap = projectionFn => operations.concatMap(_.compose(flatEventStream, projectionFn));


  return operators;
}