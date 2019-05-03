const _ = require('lodash/fp');
const { predEvtTypeList, filterEvtsByEvtTypes, deriveEvt, isWindow } = require('../../../helperFunctions');

module.exports = function createModalOperators(cepjsMost) {
  const { filter, map } = cepjsMost.lib.core;

  const operators = {};

  const createModalOps =
    (source, operation) =>
      (eventTypeList, assertion, newEvtTypeId) => stream => {
        const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list
        const derivation = deriveEvt(source, newEvtTypeId);

        return map(derivation,
          filter(operation(assertion),
            map(filterEvtsByEvtTypes(preds), //filters out the events that aren't in the event type list
              filter(isWindow, //checks if it's a window
                stream))));
      }

  /**
  * This pattern is satisfied when all participant events match a given assertion.
  * This operation works on chunks of the stream, so it must be preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
  * @param {Function} assertion - an assertion to be tested against all the participant events.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {EventStream} a new event stream instance.
  */
  operators.always = createModalOps('always', _.all);

  /**
  * This pattern is satisfied when at least one participant event matches a given assertion.
  * This operation works on chunks of the stream, so it must be preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
  * @param {Function} assertion - an assertion to be tested against all the participant events.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {Stream} a new stream instance.
  */
  operators.sometimes = createModalOps('sometimes', _.any);

  return operators;
}