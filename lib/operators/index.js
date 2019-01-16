const {merge: rMerge} = require('../rlib').factoryOperators;
const {filter: rFilter, tap: rTap, map: rMap, mergeMap: rMergeMap, concatMap: rConcatMap,
switchMap: rSwitchMap, takeUntil: rTakeUntil, retry: rRetry, share: rShare} = require('../rlib').operators;
const R = require('ramda');

const {EventStream} = require('../eventhandlers.js');

const {tumblingCountWindow: customTumblingCountWindow, slidingCountWindow: customSlidingCountWindow,
    hoppingCountWindow: customHoppingCountWindow, tumblingTemporalWindow: customTumblingTemporalWindow,
    hoppingTemporalWindow: customHoppingTemporalWindow, fixedIntervalWindow: customFixedIntervalWindow,
    eventIntervalWindow: customEventIntervalWindow, groupBy: customGroupBy, all: customAll, any: customAny, abscence: customAbscence,
    always: customAlways, sometimes: customSometimes, nHighestValues: customNhighestValues, nLowestValues: customNlowestValues,
    count: customCount, valueMax: customValueMax, valueMin: customValueMin, valueAvg: customValueAvg,
    increasing: customIncreasing, decreasing: customDecreasing, stable: customStable,
    nonIncreasing: customNonIncreasing, nonDecreasing: customNonDecreasing, mixed: customMixed,
    minDistance: customMinDistance, maxDistance: customMaxDistance, avgDistance: customAvgDistance,
    relativeMinDistance: customRelativeMinDistance, relativeMaxDistance: customRelativeMaxDistance,
    relativeAvgDistance: customRelativeAvgDistance, project: customProject} = require('../rlib');

/* general-purpose stream manipulation */
/**
 * 
 * @param {Function} fn
 * @return {EventStream} a new event stream instance.
 */
const tap = fn => eventStream => new EventStream(eventStream._observable.pipe(rTap(fn)));

/**
 * 
 * @param {number} count 
 * @return {EventStream} a new event stream instance.
 */
const retry = count => eventStream => new EventStream(eventStream._observable.pipe(rRetry(count)));

/**
 * 
 * @return {EventStream} a new event stream instance.
 */
const multicast = () => eventStream => new EventStream(eventStream._observable.pipe(rShare()));

/* filtering */
/**
 * 
 * @param {Function} fn 
 * @return {EventStream} a new event stream instance.
 */
const filter = fn => eventStream => new EventStream(eventStream._observable.pipe(rFilter(fn)));

/* transformation */
/**
 * 
 * @param {EventStream[]} streams
 * @return {EventStream} the new stream created from the merge operation.
 */
const merge = (...eventStreams) => eventStream => {
        return eventStreams.length > 0
            ? new EventStream(R.compose(R.apply(rMerge), R.prepend(eventStream._observable), R.pluck('_observable'))(eventStreams))
            : new EventStream(eventStream._observable);
    }

/**
 * 
 * @param {string[]} list
 * @param {string} newEvtTypeId
 * @return {EventStream} a new event stream instance.
 */
const project = (list, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable.pipe(customProject(list, newEvtTypeId)));

/**
 * 
 * @param {Function} projectionFn 
 * @return {EventStream} a new event stream instance.
 */
const map = projectionFn => eventStream => new EventStream(eventStream._observable.pipe(rMap(projectionFn)));


const checkStream = eventStream => R.is(EventStream, eventStream) ? eventStream._observable : eventStream;
/**
 * 
 * @param {Function} projectionFn 
 * @return {EventStream} a new event stream instance.
 */
const mergeMap = projectionFn => eventStream =>
        new EventStream(eventStream._observable.pipe(rMergeMap(R.compose(checkStream, projectionFn))));

/**
 * 
 * @param {Function} projectionFn 
 * @return {EventStream} a new event stream instance.
 */
const concatMap = projectionFn => eventStream =>
        new EventStream(eventStream._observable.pipe(rConcatMap(R.compose(checkStream, projectionFn))));

/**
 * 
 * @param {Function} projectionFn 
 * @return {EventStream} a new event stream instance.
 */
const switchMap = projectionFn => eventStream =>
        new EventStream(eventStream._observable.pipe(rSwitchMap(R.compose(checkStream, projectionFn))));

/**
 * 
 * @param {EventStream} outerEventStream - some event stream instance.
 * @return {EventStream} a new event stream instance.
 */
const takeUntil = outerEventStream => eventStream =>
        new EventStream(eventStream._observable.pipe(rTakeUntil(outerEventStream._observable)));

/* windows */
/**
 * 
 * @param {number} n
 * @return {EventStream} a new event stream instance.
 */
const tumblingCountWindow = n => eventStream =>
        new EventStream(eventStream._observable.pipe(customTumblingCountWindow(n)));

/**
 * 
 * @param {number} n
 * @return {EventStream} a new event stream instance.
 */
const slidingCountWindow = n => eventStream =>
        new EventStream(eventStream._observable.pipe(customSlidingCountWindow(n)));

/**
 * 
 * @param {number} n 
 * @param {number} hopSize 
 * @return {EventStream} a new event stream instance.
 */
const hoppingCountWindow = (n, hopSize) => eventStream =>
        new EventStream(eventStream._observable.pipe(customHoppingCountWindow(n, hopSize)));

/**
 * 
 * @param {number} mSeconds 
 * @return {EventStream} a new event stream instance.
 */
const tumblingTemporalWindow = mSeconds => eventStream =>
        new EventStream(eventStream._observable.pipe(customTumblingTemporalWindow(mSeconds)));
    
/**
 * 
 * @param {number} mSeconds 
 * @param {number} hopSize 
 * @return {EventStream} a new event stream instance.
 */
const hoppingTemporalWindow = (mSeconds, hopSize) => eventStream =>
        new EventStream(eventStream._observable.pipe(customHoppingTemporalWindow(mSeconds, hopSize)));

/**
 * 
 * @param {date} start 
 * @param {date|number} end 
 * @param {recurrence} recurrence 
 * @param {ordering} order 
 * @return {EventStream} a new event stream instance.
 */
const fixedIntervalWindow = (start, end, recurrence, order) => eventStream =>
        new EventStream(eventStream._observable.pipe(customFixedIntervalWindow(start, end, recurrence, order)));

/**
 * 
 * @param {string[]} initiatorEvents - a list containing the event types ids of the instances that initiates the window.
 * @param {string[]} terminatorEvents - a list containing the event types ids of the instances that close the window.
 * @param {number} [expirationTime] - an optional time period used to close the window in case a terminator event
 * has not been detected so far.
 * @return {EventStream} a new event stream instance.
 */
const eventIntervalWindow = (initiatorEvents, terminatorEvents, expirationTime) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customEventIntervalWindow(initiatorEvents, terminatorEvents, expirationTime)));

/**
 * 
 * @param {(string|(string|number)[])} attribute - the given event attribute to be considered. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @return {EventStream} a new event stream instance.
 */
const groupBy = attribute => eventStream => new EventStream(eventStream._observable.pipe(customGroupBy(attribute)));

/* logical patterns */
/**
 * Based on the logical conjunction operation, this pattern looks for one instance of each event type ids listed on {@code eventTypeList}.
 * Optionally, the pattern accepts an assertion that can be used to define a condition that the matching set should meet.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @param {Function} [assertion] - an assertion to be tested against the matching set.
 * @return {EventStream} a new event stream instance.
 */
const all = (eventTypeList, newEvtTypeId, assertion) =>
    eventStream => new EventStream(eventStream._observable.pipe(customAll(eventTypeList, newEvtTypeId, assertion)));

/**
 * Based on the logical disjunction operation, this pattern looks for one event instance of any of event type ids listed on {@code eventTypeList}.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const any = (eventTypeList, newEvtTypeId) =>
    eventStream => new EventStream(eventStream._observable.pipe(customAny(eventTypeList, newEvtTypeId)));

/**
 * Based on the logical negation operation, this pattern is satisfied when there are no event instances listed on {@code eventTypeList}.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const abscence = (eventTypeList, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable.pipe(customAbscence(eventTypeList, newEvtTypeId)));

/* modal patterns */
/**
 * This pattern is satisfied when all participant events match a given assertion.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {Function} assertion - an assertion to be tested against all the participant events.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const always = (eventTypeList, assertion, newEvtTypeId) =>
    eventStream => new EventStream(eventStream._observable.pipe(customAlways(eventTypeList, assertion, newEvtTypeId)));

/**
 * This pattern is satisfied when at least one participant event matches a given assertion.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {Function} assertion - an assertion to be tested against all the participant events.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const sometimes = (eventTypeList, assertion, newEvtTypeId) =>
    eventStream => new EventStream(eventStream._observable.pipe(customSometimes(eventTypeList, assertion, newEvtTypeId)));

/* subset selection */
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
const nHighestValues = (eventTypeList, n, attribute, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customNhighestValues(eventTypeList, n, attribute, newEvtTypeId)));

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
const nLowestValues = (eventTypeList, n, attribute, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customNlowestValues(eventTypeList, n, attribute, newEvtTypeId)));

/* threshold patterns */
/**
 * This pattern counts the number of the participant events (those events whose ids are listed on eventTypeList) and
 * tests an assertion against this value. This operation works on chunks of the stream, so it must be preceded by some
 * window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {Function} assertion - a threshold assertion to be used against the number of instances.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const count = (eventTypeList, assertion, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable.pipe(customCount(eventTypeList, assertion, newEvtTypeId)));

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
const valueMax = (eventTypeList, attribute, assertion, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customValueMax(eventTypeList, attribute, assertion, newEvtTypeId)));

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
const valueMin = (eventTypeList, attribute, assertion, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customValueMin(eventTypeList, attribute, assertion, newEvtTypeId)));

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
const valueAvg = (eventTypeList, attribute, assertion, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customValueAvg(eventTypeList, attribute, assertion, newEvtTypeId)));

/* trend patterns */
/**
 * 
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {*} orderPolicy 
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const increasing = (eventTypeList, attribute, orderPolicy, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customIncreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId)));

/**
 * 
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {*} orderPolicy 
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const decreasing = (eventTypeList, attribute, orderPolicy, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customDecreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId)));

/**
 * 
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {*} orderPolicy 
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const stable = (eventTypeList, attribute, orderPolicy, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customStable(eventTypeList, attribute, orderPolicy, newEvtTypeId)));

/**
 * 
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {*} orderPolicy 
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const nonIncreasing = (eventTypeList, attribute, orderPolicy, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customNonIncreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId)));

/**
 * 
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {*} orderPolicy 
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const nonDecreasing = (eventTypeList, attribute, orderPolicy, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customNonDecreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId)));
        
/**
 * 
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {*} orderPolicy 
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const mixed = (eventTypeList, attribute, orderPolicy, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customMixed(eventTypeList, attribute, orderPolicy, newEvtTypeId)));

/* spatial patterns */
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
const minDistance = (eventTypeList, givenPoint, attribute, assertion, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customMinDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));

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
const maxDistance = (eventTypeList, givenPoint, attribute, assertion, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customMaxDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));

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
const avgDistance = (eventTypeList, givenPoint, attribute, assertion, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customAvgDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));

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
const relativeMinDistance = (eventTypeList, attribute, assertion, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customRelativeMinDistance(eventTypeList, attribute, assertion, newEvtTypeId)));

/**
 * This pattern is matched when the minimal distance among the events' locations satisfies a given threshold assertion.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {(string|(string|number)[])} attribute - the common attribute carried by all event occurrences that is used to
 * calculate the distance among the events' locations. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {Function} assertion - a threshold assertion to be used against the relative maximal distance.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const relativeMaxDistance = (eventTypeList, attribute, assertion, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customRelativeMaxDistance(eventTypeList, attribute, assertion, newEvtTypeId)));

/**
 * This pattern is matched when the minimal distance among the events' locations satisfies a given threshold assertion.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {(string|(string|number)[])} attribute - the common attribute carried by all event occurrences that is used to
 * calculate the distance among the events' locations. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {Function} assertion - a threshold assertion to be used against the relative average distance.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
const relativeAvgDistance = (eventTypeList, attribute, assertion, newEvtTypeId) => eventStream =>
        new EventStream(eventStream._observable
            .pipe(customRelativeAvgDistance(eventTypeList, attribute, assertion, newEvtTypeId)));

module.exports = {
    tap,
    retry,
    multicast,
    filter,
    merge, 
    project,
    map,
    concatMap,
    mergeMap,
    switchMap,
    takeUntil,
    tumblingCountWindow,
    slidingCountWindow,
    hoppingCountWindow,
    tumblingTemporalWindow,
    hoppingTemporalWindow,
    fixedIntervalWindow,
    eventIntervalWindow,
    groupBy,
    all,
    any,
    abscence, 
    always,
    sometimes,
    nHighestValues,
    nLowestValues,
    count,
    valueMax,
    valueMin,
    valueAvg,
    increasing,
    decreasing,
    stable,
    nonIncreasing,
    nonDecreasing,
    mixed,
    minDistance,
    maxDistance,
    avgDistance,
    relativeMinDistance,
    relativeMaxDistance,
    relativeAvgDistance
}