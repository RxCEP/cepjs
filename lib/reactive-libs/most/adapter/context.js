const _ = require('lodash/fp');
const differenceInMilliseconds = require('date-fns/difference_in_milliseconds');

const { predEvtTypeList, getRecurrenceMilliseconds, groupWith } = require('../../helperFunctions');
const { recurrence, temporalOrdering, getOrderingAccessor } = require('../../common/context');

module.exports = function createContextOperators(cepjsMost) {
  const { join, take, merge, chain, map, startWith, filter, at, multicast } = cepjsMost.lib.core;
  const { bufferCount, bufferTime, bufferToggle, timer } = cepjsMost.lib.mostRxUtils;
  const { fromArray: from } = cepjsMost.lib.mostFromArray;

  const race = (s1, s2) =>
    join(take(1, merge(mapToSelf(s1), mapToSelf(s2))));

  const mapToSelf = s => map(x => startWith(x, s), take(1, s));

  const operators = {};

  /* windows */
  /**
  * Splits the stream into sets of fixed size.
  * @param {number} size - the window size.
  * @return {Stream} a new stream instance.
  */
  operators.tumblingCountWindow = size => bufferCount(size, undefined);

  /**
  * Splits the stream into sets of fixed size. Additionally, it receives a second parameter 
  * that control when a new window must be open. If slidingInterval is less than the window size, it will
  * produce overlapping sets.
  * @param {number} size - the window size.
  * @param {number} slidingInterval - interval at which a new window must be open. It defaults to 1.
  * @return {Stream} a new stream instance.
  */
  operators.slidingCountWindow = (size, slidingInterval = 1) => bufferCount(size, slidingInterval);

  /**
  * Splits the stream into sets of time-based fixed size.
  * @param {number} timeSize - the window size in milliseconds.
  * @return {Stream} a new stream instance.
  */
  operators.tumblingTimeWindow = timeSize => bufferTime(timeSize, undefined);

  /**
  * Splits the stream into sets of time-based fixed size. Additionally, it receives a second parameter 
  * that control when a new window must be open. If slidingInterval is less than timeSize, it will
  * produce overlapping sets.
  * @param {number} timeSize - the window size in milliseconds.
  * @param {number} slidingInterval - the interval (milliseconds) at which a new window must be open.
  * @return {Stream} a new stream instance.
  */
  operators.slidingTimeWindow = (timeSize, slidingInterval) => bufferTime(timeSize, slidingInterval);

  /**
  * 
  * @param {Date} start 
  * @param {Date|number} end 
  * @param {recurrence} recurrence 
  * @param {temporalOrdering} order 
  * @return {Stream} a new stream instance.
  */
  operators.fixedIntervalWindow = (start, end, recurrence, order) => stream => {
    const recurrenceMilliseconds = getRecurrenceMilliseconds(start, recurrence);

    const diffEnd = _.isNumber(end) ? end : differenceInMilliseconds(end, start);

    const orderingAccessor = getOrderingAccessor(order);

    return filter(_.filter(_.compose(time => time >= start.getTime(), orderingAccessor)),
      bufferToggle(timer(start, recurrenceMilliseconds), timer(diffEnd, undefined), stream));
  }

  /**
  * 
  * @param {string[]} initiatorEvents - a list containing the event types ids of the instances that initiates the window.
  * @param {string[]} terminatorEvents - a list containing the event types ids of the instances that close the window.
  * @param {number} [expirationTime] - an optional time period used to close the window in case a terminator event
  * has not been detected so far.
  * @return {Stream} a new stream instance.
  */
  operators.eventIntervalWindow = (initiatorEvents, terminatorEvents, expirationTime) => stream => {
    const predsInit = predEvtTypeList(initiatorEvents);
    const predsTerm = predEvtTypeList(terminatorEvents);

    const source0 = multicast(stream);

    const source1 = filter(_.cond(predsInit), source0);
    const source2 = filter(_.cond(predsTerm), source0);

    return expirationTime
      ? bufferToggle(source1, race(source2, at(expirationTime, 1)), source0)
      : bufferToggle(source1, source2, source0);
  }


  /**
  * 
  * @param {(string|(string|number)[])} path - the given event attribute to be considered. It can either be
  * a simple string for a simple attribute or an array of strings and/or numbers in the case of a nesting structure
  * indicating the path to the attribute.
  * @return {Stream} a new stream instance.
  */
  operators.groupBy = path => stream =>
    chain(from, map(groupWith(path), stream));


  return { ...operators, recurrence, temporalOrdering };
}