const _ = require('lodash/fp');
const differenceInMilliseconds = require('date-fns/difference_in_milliseconds');

const { predEvtTypeList, getRecurrenceMilliseconds, groupWith } = require('../../helperFunctions');
const { recurrence, temporalOrdering, getOrderingAccessor } = require('../../common/context');

module.exports = function createContextOperators(cepjsRx) {
  const { timer, race, from } = cepjsRx.lib.core;
  const { filter, bufferCount, bufferTime, bufferToggle, share, map, mergeMap } = cepjsRx.lib.operators;

  const operators = {};

  /* windows */
  /**
  * Splits the stream into sets of fixed size.
  * @param {number} size - the window size.
  * @return {Observable} a new stream instance.
  */
  operators.tumblingCountWindow = size => bufferCount(size);

  /**
  * Splits the stream into sets of fixed size. Additionally, it receives a second parameter 
  * that control when a new window must be open. If slidingInterval is less than the window size, it will
  * produce overlapping sets.
  * @param {number} size - the window size.
  * @param {number} slidingInterval- the interval at which a new window must be open. It defaults to 1.
  * @return {Observable} a new stream instance.
  */
  operators.slidingCountWindow = (size, slidingInterval = 1) => bufferCount(size, slidingInterval);

  /**
  * Splits the stream into sets of time-based fixed size.
  * @param {number} timeSize - the window size in milliseconds.
  * @return {Observable} a new stream instance.
  */
  operators.tumblingTimeWindow = timeSize => bufferTime(timeSize);

  /**
  * Splits the stream into sets of time-based fixed size. Additionally, it receives a second parameter 
  * that control when a new window must be open. If slidingInterval is less than timeSize, it will
  * produce overlapping sets.
  * @param {number} timeSize - the window size in milliseconds.
  * @param {number} slidingInterval - the interval (milliseconds) at which a new window must be open.
  * @return {Observable} a new stream instance.
  */
  operators.slidingTimeWindow = (timeSize, slidingInterval) => bufferTime(timeSize, slidingInterval);

  /**
  * 
  * @param {date} start 
  * @param {date|number} end 
  * @param {recurrence} recurrence 
  * @param {temporalOrdering} order 
  * @return {Observable} a new stream instance.
  */
  operators.fixedIntervalWindow = (start, end, recurrence, order) => stream => {
    const recurrenceMilliseconds = getRecurrenceMilliseconds(start, recurrence);

    const diffEnd = _.isNumber(end) ? end : differenceInMilliseconds(end, start);

    const orderingAccessor = getOrderingAccessor(order);

    return stream.pipe(bufferToggle(timer(start, recurrenceMilliseconds), () => timer(diffEnd)),
      filter(_.filter(_.compose(time => time >= start.getTime(), orderingAccessor))));
  }

  /**
  * 
  * @param {string[]} initiatorEvents - a list containing the event types ids of the instances that initiates the window.
  * @param {string[]} terminatorEvents - a list containing the event types ids of the instances that close the window.
  * @param {number} [expirationTime] - an optional time period used to close the window in case a terminator event
  * has not been detected so far.
  * @return {Observable} a new stream instance.
  */
  operators.eventIntervalWindow = (initiatorEvents, terminatorEvents, expirationTime) => stream => {
    const predsInit = predEvtTypeList(initiatorEvents);
    const predsTerm = predEvtTypeList(terminatorEvents);

    const source0 = stream.pipe(share());

    const source1 = source0.pipe(filter(_.cond(predsInit)));
    const source2 = source0.pipe(filter(_.cond(predsTerm)));

    return expirationTime
      ? source0.pipe(bufferToggle(source1, () => race(source2, timer(expirationTime))))
      : source0.pipe(bufferToggle(source1, () => source2));
  }


  /**
   * 
   * @param {(string|(string|number)[])} path - the given event attribute to be considered. It can either be
   * a simple string for a simple attribute or an array of strings and/or numbers in the case of a nesting structure
   * indicating the path to the attribute.
   * @return {Observable} a new stream instance.
   */
  operators.groupBy = path => stream =>
    stream.pipe(map(groupWith(path)), mergeMap(buffer => from(buffer)));

  return { ...operators, recurrence, temporalOrdering };
}

