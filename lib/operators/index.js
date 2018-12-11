const {merge: rMerge} = require('../rlib').factoryOperators;
const {filter: rFilter, tap: rTap, map: rMap, mergeMap: rMergeMap, concatMap: rConcatMap,
switchMap: rSwitchMap} = require('../rlib').operators;
const R = require('ramda');

const {EventStream} = require('../eventhandlers.js');

const {tumblingCountWindow: customTumblingCountWindow, slidingCountWindow: customSlidingCountWindow,
    hoppingCountWindow: customHoppingCountWindow, tumblingTemporalWindow: customTumblingTemporalWindow,
    hoppingTemporalWindow: customHoppingTemporalWindow, fixedIntervalWindow: customFixedIntervalWindow,
    eventIntervalWindow: customEventIntervalWindow, all: customAll, any: customAny, abscence: customAbscence,
    always: customAlways, sometimes: customSometimes, nHighestValues: customNhighestValues, nLowestValues: customNlowestValues,
    count: customCount, valueMax: customValueMax, valueMin: customValueMin, valueAvg: customValueAvg,
    increasing: customIncreasing, decreasing: customDecreasing, stable: customStable,
    nonIncreasing: customNonIncreasing, nonDecreasing: customNonDecreasing, mixed: customMixed,
    minDistance: customMinDistance, maxDistance: customMaxDistance, avgDistance: customAvgDistance,
    relativeMinDistance: customRelativeMinDistance, relativeMaxDistance: customRelativeMaxDistance,
    relativeAvgDistance: customRelativeAvgDistance, project: customProject} = require('../rlib');

/**
 * 
 * @param {Function} fn
 * @return {EventStream} a new event stream instance.
 */
function tap(fn){
    return function(stream){
        return new EventStream(stream._observable.pipe(rTap(fn)));
    }
}

//filtering
/**
 * 
 * @param {Function} fn 
 * @return {EventStream} a new event stream instance.
 */
function filter(fn){
    return function(stream){
        return new EventStream(stream._observable.pipe(rFilter(fn)));
    }
}

//transformation
/**
 * 
 * @param {EventStream[]} streams
 * @return {EventStream} the new stream created from the merge operation.
 */
function merge(...streams){
    return function(stream){
        return streams.length > 0
            ? new EventStream(R.compose(R.apply(rMerge), R.prepend(stream._observable), R.pluck('_observable'))(streams))
            : stream;
    }
}

/**
 * 
 * @param {string[]} list
 * @param {string} newEvtTypeId
 * @return {EventStream} a new event stream instance.
 */
function project(list, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable.pipe(customProject(list, newEvtTypeId)));
    }
}

/**
 * 
 * @param {Function} projectionFn 
 * @return {EventStream} a new event stream instance.
 */
function map(projectionFn){
    return function(stream){
        return new EventStream(stream._observable.pipe(rMap(projectionFn)));
    }
}
/**
 * 
 * @param {Function} projectionFn 
 * @return {EventStream} a new event stream instance.
 */
function mergeMap(projectionFn){
    return function(stream){
        return new EventStream(stream._observable.pipe(rMergeMap(projectionFn)));
    }
}
/**
 * 
 * @param {Function} projectionFn 
 * @return {EventStream} a new event stream instance.
 */
function concatMap(projectionFn){
    return function(stream){
        return new EventStream(stream._observable.pipe(rConcatMap(projectionFn)));
    }
}
/**
 * 
 * @param {Function} projectionFn 
 * @return {EventStream} a new event stream instance.
 */
function switchMap(projectionFn){
    return function(stream){
        return new EventStream(stream._observable.pipe(rSwitchMap(projectionFn)));
    }
}

//windows
/**
 * 
 * @param {number} n
 * @return {EventStream} a new event stream instance.
 */
function tumblingCountWindow(n){
    return function(stream){
        return new EventStream(stream._observable.pipe(customTumblingCountWindow(n)));
    }
}
/**
 * 
 * @param {number} n
 * @return {EventStream} a new event stream instance.
 */
function slidingCountWindow(n){
    return function(stream){
        return new EventStream(stream._observable.pipe(customSlidingCountWindow(n)));
    }
}
/**
 * 
 * @param {number} n 
 * @param {number} hopSize 
 * @return {EventStream} a new event stream instance.
 */
function hoppingCountWindow(n, hopSize){
    return function(stream){
        return new EventStream(stream._observable.pipe(customHoppingCountWindow(n, hopSize)));
    }
}
/**
 * 
 * @param {number} mSeconds 
 * @return {EventStream} a new event stream instance.
 */
function tumblingTemporalWindow(mSeconds){
    return function(stream){
        return new EventStream(stream._observable.pipe(customTumblingTemporalWindow(mSeconds)));
    }
}
/**
 * 
 * @param {number} mSeconds 
 * @param {number} hopSize 
 * @return {EventStream} a new event stream instance.
 */
function hoppingTemporalWindow(mSeconds, hopSize){
    return function(stream){
        return new EventStream(stream._observable.pipe(customHoppingTemporalWindow(mSeconds, hopSize)));
    }
}
/**
 * 
 * @param {date} start 
 * @param {date|number} end 
 * @param {recurrence} recurrence 
 * @param {ordering} order 
 * @return {EventStream} a new event stream instance.
 */
function fixedIntervalWindow(start, end, recurrence, order){
    return function(stream){
        return new EventStream(stream._observable.pipe(customFixedIntervalWindow(start, end, recurrence, order)));
    }
}
/**
 * 
 * @param {string[]} initiatorEvents - a list containing the event types ids of the instances that initiates the window.
 * @param {string[]} terminatorEvents - a list containing the event types ids of the instances that close the window.
 * @param {number} [expirationTime] - an optional time period used to close the window in case a terminator event
 * has not been detected so far.
 * @return {EventStream} a new event stream instance.
 */
function eventIntervalWindow(initiatorEvents, terminatorEvents, expirationTime){
    return function(stream){
        return new EventStream(stream._observable
            .pipe(customEventIntervalWindow(initiatorEvents, terminatorEvents, expirationTime)));
    }
}

//logical patterns
/**
 * Based on the logical conjunction operation, this pattern looks for one instance of each event type ids listed on {@code eventTypeList}.
 * Optionally, the pattern accepts an assertion that can be used to define a condition that the matching set should meet.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @param {Function} [assertion] - an assertion to be tested against the matching set.
 * @return {EventStream} a new event stream instance.
 */
function all(eventTypeList, newEvtTypeId, assertion){
    return function(stream){
        return new EventStream(stream._observable.pipe(customAll(eventTypeList, newEvtTypeId, assertion)));
    }
}
/**
 * Based on the logical disjunction operation, this pattern looks for one event instance of any of event type ids listed on {@code eventTypeList}.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
function any(eventTypeList, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable.pipe(customAny(eventTypeList, newEvtTypeId)));
    }
}
/**
 * Based on the logical negation operation, this pattern is satisfied when there are no event instances listed on {@code eventTypeList}.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
function abscence(eventTypeList, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable.pipe(customAbscence(eventTypeList, newEvtTypeId)));
    }
}

//modal patterns
/**
 * This pattern is satisfied when all participant events match a given assertion.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {Function} assertion - an assertion to be tested against all the participant events.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
function always(eventTypeList, assertion, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable.pipe(customAlways(eventTypeList, assertion, newEvtTypeId)));
    }
}
/**
 * This pattern is satisfied when at least one participant event matches a given assertion.
 * This operation works on chunks of the stream, so it must be preceded by some window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {Function} assertion - an assertion to be tested against all the participant events.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
function sometimes(eventTypeList, assertion, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable.pipe(customSometimes(eventTypeList, assertion, newEvtTypeId)));
    }
}

//subset selection
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
function nHighestValues(eventTypeList, n, attribute, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable.pipe(customNhighestValues(eventTypeList, n, attribute, newEvtTypeId)));
    }
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
function nLowestValues(eventTypeList, n, attribute, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable.pipe(customNlowestValues(eventTypeList, n, attribute, newEvtTypeId)));
    }
}

//threshold patterns
/**
 * This pattern counts the number of the participant events (those events whose ids are listed on eventTypeList) and
 * tests an assertion against this value. This operation works on chunks of the stream, so it must be preceded by some
 * window operation.
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {Function} assertion - a threshold assertion to be used against the number of instances.
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
function count(eventTypeList, assertion, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable.pipe(customCount(eventTypeList, assertion, newEvtTypeId)));
    }
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
function valueMax(eventTypeList, attribute, assertion, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable.pipe(customValueMax(eventTypeList, attribute, assertion, newEvtTypeId)));
    }
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
function valueMin(eventTypeList, attribute, assertion, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable.pipe(customValueMin(eventTypeList, attribute, assertion, newEvtTypeId)));
    }
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
function valueAvg(eventTypeList, attribute, assertion, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable.pipe(customValueAvg(eventTypeList, attribute, assertion, newEvtTypeId)));
    }
}

//trend patterns
/**
 * 
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {*} orderPolicy 
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
function increasing(eventTypeList, attribute, orderPolicy, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable.pipe(customIncreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId)));
    }
}
/**
 * 
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {*} orderPolicy 
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
function decreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable.pipe(customDecreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId)));
    }
}
/**
 * 
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {*} orderPolicy 
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
function stable(eventTypeList, attribute, orderPolicy, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable.pipe(customStable(eventTypeList, attribute, orderPolicy, newEvtTypeId)));
    }
}
/**
 * 
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {*} orderPolicy 
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
function nonIncreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable.pipe(customNonIncreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId)));
    }
}
/**
 * 
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {*} orderPolicy 
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
function nonDecreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable.pipe(customNonDecreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId)));
    }
}
/**
 * 
 * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
 * @param {(string|(string|number)[])} attribute - the instances' attribute to be examined. It can either be a simple string for a simple
 * attribute or an array of strings and/or numbers in the case of a nesting structure indicating the path to the attribute.
 * @param {*} orderPolicy 
 * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
 * @return {EventStream} a new event stream instance.
 */
function mixed(eventTypeList, attribute, orderPolicy, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable.pipe(customMixed(eventTypeList, attribute, orderPolicy, newEvtTypeId)));
    }
}

//spatial patterns
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
function minDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable
            .pipe(customMinDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));
    }
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
function maxDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable
            .pipe(customMaxDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));
    }
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
function avgDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable
            .pipe(customAvgDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));
    }
}
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
function relativeMinDistance(eventTypeList, attribute, assertion, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable
            .pipe(customRelativeMinDistance(eventTypeList, attribute, assertion, newEvtTypeId)));
    }
}
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
function relativeMaxDistance(eventTypeList, attribute, assertion, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable
            .pipe(customRelativeMaxDistance(eventTypeList, attribute, assertion, newEvtTypeId)));
    }
}
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
function relativeAvgDistance(eventTypeList, attribute, assertion, newEvtTypeId){
    return function(stream){
        return new EventStream(stream._observable
            .pipe(customRelativeAvgDistance(eventTypeList, attribute, assertion, newEvtTypeId)));
    }
}


module.exports = {
    tap,
    filter,
    merge, 
    project,
    map,
    concatMap,
    mergeMap,
    switchMap,
    tumblingCountWindow,
    slidingCountWindow,
    hoppingCountWindow,
    tumblingTemporalWindow,
    hoppingTemporalWindow,
    fixedIntervalWindow,
    eventIntervalWindow,
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