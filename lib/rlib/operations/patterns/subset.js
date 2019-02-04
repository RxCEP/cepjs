const { filter, map } = require('rxjs/operators');
const R = require('ramda');
const { predEvtTypeList, deriveEvt, isWindow, getProp, filterEvtsByEvtTypes } = require('../../helperFunctions');

const notNullNotEmpty = R.allPass([x => !R.isEmpty(x), x => !R.isNil(x)]);

/**
 * This pattern selects a subset of the participant events with the n highest values of a given event attribute.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {number} n - the number of events to be selected according to the highest value criteria.
 * @param {(string|(string|number)[])} attribute - the given event attribute to be considered. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const nHighestValues = (eventTypeList, n, attribute, newEvtTypeId) => (source) => {
    const property = getProp(attribute);
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const derivation = deriveEvt('n highest values', newEvtTypeId);

    return source.pipe(filter(isWindow),//checks if it's an array(window)
            map(filterEvtsByEvtTypes(preds)),//filters events according to a list of predicates
            map(R.compose(R.take(n),R.sortBy(property))),
            filter(notNullNotEmpty),
            map(derivation));
}

/**
 * This pattern selects a subset of the participant events with the n lowest values of a given event attribute.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {number} n - the number of events to be selected according to the lowest value criteria.
 * @param {(string|(string|number)[])} attribute - the given event attribute to be considered. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const nLowestValues = (eventTypeList, n, attribute, newEvtTypeId) => (source) => {
    const property = getProp(attribute);

    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list
    const derivation = deriveEvt('n lowest values', newEvtTypeId);

    return source.pipe(filter(isWindow),//checks if it's an array(window)
            map(filterEvtsByEvtTypes(preds)),//filters events according to a list of predicates
            map(R.compose(R.takeLast(n),R.sortBy(property))),
            filter(notNullNotEmpty)),
            map(derivation);
}

module.exports = {
    nHighestValues,
    nLowestValues
};