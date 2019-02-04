const { filter, map } = require('rxjs/operators');
const R = require('ramda');
const { predEvtTypeList, deriveEvt, isWindow, getProp,
    filterEvtsByEvtTypes, AccHelper, minFn, maxFn } = require('../../helperFunctions');

const accHelperConstructor = R.construct(AccHelper);

/**
 * This pattern counts the number of the participant events (those events whose ids are listed on eventTypeList) and
 * tests an assertion against this value. This operation works on chunks of the stream, so it must be preceded by some
 * window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {Function} assertion - a threshold assertion to be used against the number of instances.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const count = (eventTypeList, assertion, newEvtTypeId) => (source) => {
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list
    const derivation = deriveEvt('count', newEvtTypeId);

    return source.pipe(filter(isWindow),//checks if it's an array(window)
            map(filterEvtsByEvtTypes(preds)),//filters events according to a list of predicates
            filter(R.compose(assertion, R.length)),
            map(derivation));
}

/**
 * This pattern selects an event attribute in every participant events and tests its maximal value against a threshold assertion.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {Function} assertion - a threshold assertion to be used against the maximal value of the given attribute.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const valueMax = (eventTypeList, attribute, assertion, newEvtTypeId) => (source) => {
    const testAssertion = R.compose(assertion, maxFn, R.map(getProp(attribute)));

    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list
    const derivation = deriveEvt('value max', newEvtTypeId);

    return source.pipe(filter(isWindow), //checks if it's an array(window)
            map(filterEvtsByEvtTypes(preds)), //filters events according to a list of predicates
            map(buffer => accHelperConstructor(testAssertion(buffer), buffer)),
            filter(R.prop('result')),
            map(R.compose(derivation, R.prop('set'))));
}

/**
 * This pattern selects an event attribute in every participant events and tests its minimal value against a threshold assertion.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {Function} assertion - a threshold assertion to be used against the minimal value of the given attribute.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const valueMin = (eventTypeList, attribute, assertion, newEvtTypeId) => (source) => {
    const testAssertion = R.compose(assertion, minFn, R.map(getProp(attribute)));

    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list
    const derivation = deriveEvt('value min', newEvtTypeId);

    return source.pipe(filter(isWindow), //checks if it's an array(window)
            map(filterEvtsByEvtTypes(preds)), //filters events according to a list of predicates
            map(buffer => accHelperConstructor(testAssertion(buffer), buffer)),
            filter(R.prop('result')),
            map(R.compose(derivation, R.prop('set'))));
}

/**
 * This pattern selects an event attribute in every participant events and tests its average value against a threshold assertion.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {Function} assertion - a threshold assertion to be used against the average value of the given attribute.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const valueAvg = (eventTypeList, attribute, assertion, newEvtTypeId) => (source) => {
    const testAssertion = R.compose(assertion, R.mean, R.map(getProp(attribute)));

    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list
    const derivation = deriveEvt('value average', newEvtTypeId);

    return source.pipe(filter(isWindow), //checks if it's an array(window)
            map(filterEvtsByEvtTypes(preds)), //filters events according to a list of predicates
            map(buffer => accHelperConstructor(testAssertion(buffer), buffer)),
            filter(R.prop('result')),
            map(R.compose(derivation, R.prop('set'))));
}

module.exports = {
    count,
    valueMax,
    valueMin,
    valueAvg
};