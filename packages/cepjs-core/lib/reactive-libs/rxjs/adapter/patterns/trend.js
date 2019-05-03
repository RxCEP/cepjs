const _ = require('lodash/fp');
const { isWindow, predEvtTypeList, filterEvtsByEvtTypes, getPropOrderPolicy,
  deriveEvt, AccHelper, compareStable, compareIncreasing, compareDecreasing,
  compareMixed } = require('../../../helperFunctions');

module.exports = function createTrendOperators(cepjsRx){
  const { filter, map } = cepjsRx.lib.operators;

  const operators = {};

  const createTrendOps =
    (source, compareFn, selector) =>
      (eventTypeList, attribute, newEvtTypeId, policies = {}) => stream => {
        const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list
        const orderProp = getPropOrderPolicy(policies.order);

        const derivation = deriveEvt(source, newEvtTypeId);

        return stream.pipe(filter(isWindow), //checks if it's a window
          map(filterEvtsByEvtTypes(preds)), //filters events according to a list of predicates
          map(buffer => !orderProp ? buffer : _.sortBy([orderProp], buffer)), //order events according to order policy
          map(buffer => new AccHelper(
            _.reduce((acc, val) => compareFn(acc, val), null, buffer.map(_.get(attribute))),
            buffer)),
          filter(selector), //checks the appropriate flag
          map(_.compose(derivation, _.get('set'))));
      }

  /**
  * 
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern
  * operation.
  * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a
  * simple string for a simple attribute or an array of strings and/or numbers in the case of a nesting structure
  * indicating the path to the attribute.
  * @param {orderPolicy} orderPolicy 
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {Observable} a new stream instance.
  */
  operators.increasing = createTrendOps('increasing', compareIncreasing, _.get(['result', 'increasing']));

  /**
  * 
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern
  * operation.
  * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a
  * simple string for a simple attribute or an array of strings and/or numbers in the case of a nesting structure
  * indicating the path to the attribute.
  * @param {orderPolicy} orderPolicy 
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {Observable} a new stream instance.
  */
  operators.decreasing = createTrendOps('decreasing', compareDecreasing, _.get(['result', 'decreasing']));

  /**
  * 
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern
  * operation.
  * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a
  * simple string for a simple attribute or an array of strings and/or numbers in the case of a nesting structure
  * indicating the path to the attribute.
  * @param {orderPolicy} orderPolicy 
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {Observable} a new stream instance.
  */
  operators.stable = createTrendOps('stable', compareStable, _.get(['result', 'stable']));

  /**
  * 
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern
  * operation.
  * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a
  * simple string for a simple attribute or an array of strings and/or numbers in the case of a nesting structure
  * indicating the path to the attribute.
  * @param {orderPolicy} orderPolicy 
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {Observable} a new stream instance.
  */
  operators.nonIncreasing = createTrendOps('non increasing', compareIncreasing, _.negate(_.get(['result', 'increasing'])));

  /**
  * 
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern
  * operation.
  * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a
  * simple string for a simple attribute or an array of strings and/or numbers in the case of a nesting structure
  * indicating the path to the attribute.
  * @param {orderPolicy} orderPolicy 
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {Observable} a new stream instance.
  */
  operators.nonDecreasing = createTrendOps('non decreasing', compareDecreasing, _.negate(_.get(['result', 'decreasing'])));

  /**
  * 
  * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern
  * operation.
  * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a
  * simple string for a simple attribute or an array of strings and/or numbers in the case of a nesting structure
  * indicating the path to the attribute.
  * @param {orderPolicy} orderPolicy 
  * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
  * @return {Observable} a new stream instance.
  */
  operators.mixed = createTrendOps('mixed', compareMixed, _.get(['result', 'mixed']));

  return operators;
}