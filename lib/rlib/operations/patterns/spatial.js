const { filter, map } = require('rxjs/operators');
const R = require('ramda');
const { Point } = require("../../location");
const { predEvtTypeList, getLens, deriveEvt, isWindow,
        filterEvtsByEvtTypes, minFn, maxFn, AccHelper } = require("../../helperFunctions");

const distanceFn = (lens) => ([a, b]) => Point.distance(R.view(lens, a), R.view(lens, b));
const curriedDistanceFn = R.curry((a, lensB, b) => Point.distance(a, R.view(lensB, b)));

const accHelperConstructor = R.construct(AccHelper);

/* absolute patterns */
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
const minDistance = (eventTypeList, givenPoint, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = curriedDistanceFn(givenPoint, attributeLens);
    const derivation = deriveEvt('min distance pattern', newEvtTypeId);

    const testAssertion = R.compose(assertion, minFn, R.map(calcDistance));

    return source.pipe(filter(isWindow),
            map(filterEvtsByEvtTypes(preds)),
            map(buffer => accHelperConstructor(testAssertion(buffer), buffer)),
            filter(R.prop('result')),
            map(R.compose(derivation, R.prop('set'))));
}

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
const maxDistance = (eventTypeList, givenPoint, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = curriedDistanceFn(givenPoint, attributeLens);
    const derivation = deriveEvt('max distance pattern', newEvtTypeId);

    const testAssertion = R.compose(assertion, maxFn, R.map(calcDistance));

    return source.pipe(filter(isWindow),
            map(filterEvtsByEvtTypes(preds)),
            map(buffer => accHelperConstructor(testAssertion(buffer), buffer)),
            filter(R.prop('result')),
            map(R.compose(derivation, R.prop('set'))));
}

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
const avgDistance = (eventTypeList, givenPoint, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = curriedDistanceFn(givenPoint, attributeLens);
    const derivation = deriveEvt('average distance pattern', newEvtTypeId);

    const testAssertion = R.compose(assertion, R.mean, R.map(calcDistance));

    return source.pipe(filter(isWindow),
            map(filterEvtsByEvtTypes(preds)),
            map(buffer => accHelperConstructor(testAssertion(buffer), buffer)),
            filter(R.prop('result')),
            map(R.compose(derivation, R.prop('set'))));
}

/* relative patterns */
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
const relativeMinDistance = (eventTypeList, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = distanceFn(attributeLens);
    const derivation = deriveEvt('relative min distance pattern', newEvtTypeId);

    const testAssertion = R.compose(assertion, minFn, R.map(calcDistance), R.aperture(2));

    return source.pipe(filter(isWindow),
            map(filterEvtsByEvtTypes(preds)),
            map(buffer => accHelperConstructor(testAssertion(buffer), buffer)),
            filter(R.prop('result')),
            map(R.compose(derivation, R.prop('set'))));
}

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
const relativeMaxDistance = (eventTypeList, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = distanceFn(attributeLens);
    const derivation = deriveEvt('relative max distance pattern', newEvtTypeId);

    const testAssertion = R.compose(assertion, maxFn, R.map(calcDistance), R.aperture(2));

    return source.pipe(filter(isWindow),
            map(filterEvtsByEvtTypes(preds)),
            map(buffer => accHelperConstructor(testAssertion(buffer), buffer)),
            filter(R.prop('result')),
            map(R.compose(derivation, R.prop('set'))));
}

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
const relativeAvgDistance = (eventTypeList, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = distanceFn(attributeLens);
    const derivation = deriveEvt('relative average distance pattern', newEvtTypeId);

    const testAssertion = R.compose(assertion, R.mean, R.map(calcDistance), R.aperture(2));

    return source.pipe(filter(isWindow),
            map(filterEvtsByEvtTypes(preds)),
            map(buffer => accHelperConstructor(testAssertion(buffer), buffer)),
            filter(R.prop('result')),
            map(R.compose(derivation, R.prop('set'))));
}

module.exports = {
    minDistance,
    maxDistance,
    avgDistance,
    relativeMinDistance,
    relativeMaxDistance,
    relativeAvgDistance
};