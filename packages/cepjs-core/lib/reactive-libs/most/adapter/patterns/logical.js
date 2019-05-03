const _ = require('lodash/fp');
const { predEvtTypeList, deriveEvt, isWindow, evtTypeListLengthOne,
  filterEvtsByEvtTypes } = require('../../../helperFunctions');
const { separateEvtsByType, countList, cartesianProduct, applyAssertion,
  elemsCheckLength } = require('../../../common/logical');

module.exports = function createLogicalOperators(cepjsMost) {
  const { filter, map, chain: mergeMap } = cepjsMost.lib.core;
  const { fromArray: from } = cepjsMost.lib.mostFromArray;

  const operators = {};

  /**
  * Based on the logical conjunction operation, this pattern looks for one instance of each event type ids
  * listed on the first parameter. Optionally, the pattern accepts an assertion that can be used to define a
  * condition that the matching set should meet. This operation works on chunks of the stream, so it must be
  * preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @param {Function} [assertion] - an assertion to be tested against the matching set.
  * @return {Stream} a new stream instance.
  */
  operators.all = (eventTypeList, newEvtTypeId, assertion) => stream => {
    const evtTypeListCounted = countList(eventTypeList);

    const derivation = deriveEvt('all', newEvtTypeId);

    return map(derivation,
      mergeMap(from,
        map(applyAssertion(assertion), //applies the assertion if it exists
          filter(_.filter(elemsCheckLength(eventTypeList.length)), //checks if the sets have the required size
            map(_.map(_.flattenDeep), //flattens the inner sets
              map(buffer => cartesianProduct.apply(null, buffer), //calculates the cartesian product
                map(separateEvtsByType(eventTypeList, evtTypeListCounted),
                  filter(isWindow, //checks if it's a window
                    filter(elems => evtTypeListLengthOne(eventTypeList),
                      stream)))))))));
  }

  /**
  * Based on the logical disjunction operation, this pattern looks for one event instance of any of
  * event type ids listed on the first parameter. This operation works on chunks of the stream, so it
  * must be preceded by some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {EventStream} a new event stream instance.
  */
  operators.any = (eventTypeList, newEvtTypeId) => stream => {
    const notNullNotEmpty = _.allPass([x => !_.isEmpty(x), x => !_.isNil(x)]);
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const derivation = deriveEvt('any', newEvtTypeId);

    return map(derivation,
      filter(notNullNotEmpty,
        map(_.head,
          map(filterEvtsByEvtTypes(preds), //filters out the events that aren't in the event type list
            filter(isWindow, //checks if it's a window
              stream)))));
  }

  /**
  * Based on the logical negation operation, this pattern is satisfied when there are no event instances
  * listed on the first parameter. This operation works on chunks of the stream, so it must be preceded by
  * some window operation.
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {EventStream} a new event stream instance.
  */
  operators.absence = (eventTypeList, newEvtTypeId) => stream => {
    const notNullisEmpty = _.allPass([x => !_.isNil(x), _.isEmpty]);
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const derivation = deriveEvt('absence', newEvtTypeId);

    return map(derivation,
      filter(notNullisEmpty,
        map(filterEvtsByEvtTypes(preds), //filters out the events that aren't in the event type list
          filter(isWindow, //checks if it's a window
            stream))));
  }

  return operators;
}