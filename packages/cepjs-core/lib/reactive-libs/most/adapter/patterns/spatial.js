const _ = require('lodash/fp');
const { predEvtTypeList, deriveEvt, isWindow, filterEvtsByEvtTypes,
  AccHelper, aperture } = require("../../../helperFunctions");
const { distanceFn, curriedDistanceFn } = require("../../../common/spatial");

module.exports = function createSpatialOperators(cepjsMost) {
  const { filter, map } = cepjsMost.lib.core;

  const operators = {};

  const createAbsoluteOps =
    (source, operation) =>
      (eventTypeList, givenPoint, attribute, assertion, newEvtTypeId) => stream => {
        const preds = predEvtTypeList(eventTypeList);
        const calcDistance = curriedDistanceFn(givenPoint, attribute);
        const derivation = deriveEvt(source, newEvtTypeId);

        const testAssertion = _.compose(assertion, operation, _.map(calcDistance));

        return map(_.compose(derivation, _.get('set')),
          filter(_.get('result'),
            map(buffer => new AccHelper(testAssertion(buffer), buffer),
              map(filterEvtsByEvtTypes(preds),
                filter(isWindow,
                  stream)))));
      }

  const createRelativeOps =
    (source, operation) =>
      (eventTypeList, attribute, assertion, newEvtTypeId) => stream => {
        const preds = predEvtTypeList(eventTypeList);
        const calcDistance = distanceFn(attribute);
        const derivation = deriveEvt(source, newEvtTypeId);

        const testAssertion = _.compose(assertion, operation, _.map(calcDistance), aperture(2));

        return map(_.compose(derivation, _.get('set')),
          filter(_.get('result'),
            map(buffer => new AccHelper(testAssertion(buffer), buffer),
              map(filterEvtsByEvtTypes(preds),
                filter(isWindow,
                  stream)))));
      }

  /**
  * This pattern is matched when the minimal distance of the events' locations from a given point satisfies a given threshold assertion.
  * This operation works on chunks of the stream, so it must be preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
  * @param {Point} givenPoint - a fixed point location used to calculate the absolute distance.
  * @param {(string|(string|number)[])} attribute - the common attribute carried by all event occurrences that is used to
  * calculate the distance between the events' locations and the given point. It can either be a simple string for a simple
  * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
  * @param {Function} assertion - a threshold assertion to be used against the minimal distance.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {EventStream} a new event stream instance.
  */
  operators.minDistance = createAbsoluteOps('min distance pattern', _.min);

  /**
  * This pattern is matched when the maximal distance of the events' locations from a given point satisfies a given threshold assertion.
  * This operation works on chunks of the stream, so it must be preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
  * @param {Point} givenPoint - a fixed point location used to calculate the absolute distance.
  * @param {(string|(string|number)[])} attribute - the common attribute carried by all event occurrences that is used to
  * calculate the distance between the events' locations and the given point. It can either be a simple string for a simple
  * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute
  * @param {Function} assertion - a threshold assertion to be used against the maximal distance.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {EventStream} a new event stream instance.
  */
  operators.maxDistance = createAbsoluteOps('max distance pattern', _.max);

  /**
  * This pattern is matched when the average distance of the events' locations from a given point satisfies a given threshold assertion.
  * This operation works on chunks of the stream, so it must be preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
  * @param {Point} givenPoint - a fixed point location used to calculate the absolute distance.
  * @param {(string|(string|number)[])} attribute - the common attribute carried by all event occurrences that is used to
  * calculate the distance between the events' locations and the given point. It can either be a simple string for a simple
  * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
  * @param {Function} assertion - a threshold assertion to be used against the average distance.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {EventStream} a new event stream instance.
  */
  operators.avgDistance = createAbsoluteOps('average distance pattern', _.mean);

  /**
  * This pattern is matched when the minimal distance among the events' locations satisfies a given threshold assertion.
  * This operation works on chunks of the stream, so it must be preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
  * @param {(string|(string|number)[])} attribute - the common attribute carried by all event occurrences that is used to
  * calculate the distance among the events' locations. It can either be a simple string for a simple
  * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
  * @param {Function} assertion - a threshold assertion to be used against the relative minimal distance.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {EventStream} a new event stream instance.
  */
  operators.relativeMinDistance = createRelativeOps('relative min distance pattern', _.min);

  /**
  * This pattern is matched when the maximal distance among the events' locations satisfies a given threshold assertion.
  * This operation works on chunks of the stream, so it must be preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
  * @param {(string|(string|number)[])} attribute - the common attribute carried by all event occurrences that is used to
  * calculate the distance among the events' locations. It can either be a simple string for a simple
  * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
  * @param {Function} assertion - a threshold assertion to be used against the relative maximal distance.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {EventStream} a new event stream instance.
  */
  operators.relativeMaxDistance = createRelativeOps('relative max distance pattern', _.max);

  /**
  * This pattern is matched when the average distance among the events' locations satisfies a given threshold assertion.
  * This operation works on chunks of the stream, so it must be preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
  * @param {(string|(string|number)[])} attribute - the common attribute carried by all event occurrences that is used to
  * calculate the distance among the events' locations. It can either be a simple string for a simple
  * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
  * @param {Function} assertion - a threshold assertion to be used against the relative average distance.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {EventStream} a new event stream instance.
  */
  operators.relativeAvgDistance = createRelativeOps('relative average distance pattern', _.mean);

  return operators;
}