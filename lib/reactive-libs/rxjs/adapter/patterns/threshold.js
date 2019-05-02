const _ = require('lodash/fp');
const { predEvtTypeList, deriveEvt, isWindow,
  filterEvtsByEvtTypes, AccHelper } = require('../../../helperFunctions');

module.exports = function createThresholdOperators(cepjsRx) {
  const { filter, map } = cepjsRx.lib.operators;

  const operators = {};

  /**
  * This pattern counts the number of the participant events (those events whose ids are listed on eventTypeList) and
  * tests an assertion against this value. This operation works on chunks of the stream, so it must be preceded by some
  * window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern
  * operation.
  * @param {Function} assertion - a threshold assertion to be used against the number of instances.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {Observable} a new stream instance.
  */
  operators.count = (eventTypeList, assertion, newEvtTypeId) => stream => {
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list
    const derivation = deriveEvt('count', newEvtTypeId);

    return stream.pipe(filter(isWindow), //checks if it's a window
      map(filterEvtsByEvtTypes(preds)), //filters events according to a list of predicates
      filter(_.compose(assertion, buffer => buffer.length)),
      map(derivation));
  }

  const createValueOperations =
    (source, operation) =>
      (eventTypeList, attribute, assertion, newEvtTypeId) => stream => {
        const testAssertion = _.compose(assertion, operation, _.map(_.get(attribute)));

        const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list
        const derivation = deriveEvt(source, newEvtTypeId);

        return stream.pipe(filter(isWindow), //checks if it's a window
          map(filterEvtsByEvtTypes(preds)), //filters events according to a list of predicates
          map(buffer => new AccHelper(testAssertion(buffer), buffer)),
          filter(_.get('result')),
          map(_.compose(derivation, _.get('set'))));
      }

  /**
  * This pattern selects an event attribute in every participant events and tests its maximal value against a threshold
  * assertion. This operation works on chunks of the stream, so it must be preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern
  * operation.
  * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a
  * simple string for a simple attribute or an array of strings and/or numbers in the case of a nesting structure
  * indicating the path to the attribute.
  * @param {Function} assertion - a threshold assertion to be used against the maximal value of the given attribute.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {Observable} a new stream instance.
  */
  operators.valueMax = createValueOperations('value max', _.max);

  /**
  * This pattern selects an event attribute in every participant events and tests its minimal value against a threshold
  * assertion. This operation works on chunks of the stream, so it must be preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern
  * operation.
  * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a
  * simple string for a simple attribute or an array of strings and/or numbers in the case of a nesting structure
  * indicating the path to the attribute.
  * @param {Function} assertion - a threshold assertion to be used against the minimal value of the given attribute.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {Observable} a new stream instance.
  */
  operators.valueMin = createValueOperations('value min', _.min);

  /**
  * This pattern selects an event attribute in every participant events and tests its average value against a threshold
  * assertion. This operation works on chunks of the stream, so it must be preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern
  * operation.
  * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a
  * simple string for a simple attribute or an array of strings and/or numbers in the case of a nesting structure
  * indicating the path to the attribute.
  * @param {Function} assertion - a threshold assertion to be used against the average value of the given attribute.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {Observable} a new stream instance.
  */
  operators.valueAvg = createValueOperations('value average', _.mean);

  return operators;
}