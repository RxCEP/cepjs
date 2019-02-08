const { filter, map } = require('rxjs/operators');
const R = require('ramda');
const { predEvtTypeList, filterEvtsByEvtTypes, deriveEvt, isWindow } = require('../../helperFunctions');

/**
 * This pattern is satisfied when all participant events match a given assertion.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {Function} assertion - an assertion to be tested against all the participant events.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const always = (eventTypeList, assertion, newEvtTypeId) => stream => {
    const preds = predEvtTypeList(eventTypeList);//a list of predicates with the event type list
    const derivation = deriveEvt('always', newEvtTypeId);

    return stream.pipe(filter(isWindow),//checks if it's a window
                        map(filterEvtsByEvtTypes(preds)),//filters out the events that aren't in the event type list
                        filter(R.all(assertion)),
                        map(derivation));
}

/**
 * This pattern is satisfied when at least one participant event matches a given assertion.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {Function} assertion - an assertion to be tested against all the participant events.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const sometimes = (eventTypeList, assertion, newEvtTypeId) => stream => {
    const preds = predEvtTypeList(eventTypeList);//a list of predicates with the event type list
    const derivation = deriveEvt('sometimes', newEvtTypeId);

    return stream.pipe(filter(isWindow),//checks if it's a window
            map(filterEvtsByEvtTypes(preds)),//filters out the events that aren't in the event type list
            filter(R.any(assertion)),
            map(derivation));
}


module.exports = {
    always,
    sometimes
};