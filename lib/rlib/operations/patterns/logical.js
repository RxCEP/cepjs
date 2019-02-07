const { from } = require('rxjs');
const { filter, map, mergeMap } = require('rxjs/operators');
const R = require('ramda');
const { predEvtTypeList, compareEvtType, deriveEvt, isWindow,
    evtTypeListLengthOne, filterEvtsByEvtTypes } = require('../../helperFunctions');


const separateEvtsByType = R.curry((evtTypeList, evtTypeListCounted, elems) => {
    return R.uniq(evtTypeList).reduce((acc, evtType) =>
        acc.push(evtTypeListCounted[evtType] === 1 ?
        elems.filter(compareEvtType(evtType)): 
        R.splitEvery(evtTypeListCounted[evtType], elems.filter(compareEvtType(evtType)))) ,[]);
});

const countList = list => R.countBy(R.identity, list);

const xprodN = length => R.liftN(length, (...args) => args); //calculates the product of n sets

const applyAssertion = R.curry((assertion, product) => product.filter(set => assertion ? R.apply(assertion, set) : true));

const elemsCheckLength = R.curry((length, elems) => elems.length === length);

/**
 * Based on the logical conjunction operation, this pattern looks for one instance of each event type ids listed on {@code eventTypeList}.
 * Optionally, the pattern accepts an assertion that can be used to define a condition that the matching set should meet.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @param {Function} [assertion] - an assertion to be tested against the matching set.
 * @return {EventStream} a new event stream instance.
 */
const all = (eventTypeList, newEvtTypeId, assertion) => stream => {
    const evtTypeListCounted = countList(eventTypeList);

    const derivation = deriveEvt('all', newEvtTypeId);

    return stream.pipe(filter(elems => evtTypeListLengthOne(eventTypeList)),
            filter(isWindow), //checks if it's a window
            map(separateEvtsByType(eventTypeList, evtTypeListCounted)),
            map(buffer => R.apply(xprodN(buffer.length), buffer)), //calculates the cartesian product
            map(R.map(R.flatten)), //flattens the inner sets
            filter(R.filter(elemsCheckLength(eventTypeList.length))), //checks if the sets have the required size
            map(applyAssertion(assertion)), //applies the assertion if it exists
            mergeMap(from),
            map(derivation));
}

/**
 * Based on the logical disjunction operation, this pattern looks for one event instance of any of event type ids listed on {@code eventTypeList}.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const any = (eventTypeList, newEvtTypeId) => stream => {
    const notNullNotEmpty = R.allPass([x => !R.isEmpty(x), x => !R.isNil(x)]);
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const derivation = deriveEvt('any', newEvtTypeId);

    return stream.pipe(filter(isWindow), //checks if it's a window
            map(filterEvtsByEvtTypes(preds)), //filters out the events that aren't in the event type list
            map(R.head),
            filter(notNullNotEmpty),
            map(derivation));
}

/**
 * Based on the logical negation operation, this pattern is satisfied when there are no event instances listed on {@code eventTypeList}.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const abscence = (eventTypeList, newEvtTypeId) => stream => {
    const notNullisEmpty = R.allPass([x => !R.isNil(x), R.isEmpty]);
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const derivation = deriveEvt('abscence', newEvtTypeId);

    return stream.pipe(filter(isWindow), //checks if it's a window
            map(filterEvtsByEvtTypes(preds)), //filters out the events that aren't in the event type list
            filter(notNullisEmpty),
            map(derivation));
}

module.exports = {
    all,
    any,
    abscence
};