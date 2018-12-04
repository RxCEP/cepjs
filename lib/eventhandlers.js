const {filter, map, merge, tap} = require('rxjs/operators');
const R = require('ramda');
const {rxTumblingCountWindow, rxSlidingCountWindow, rxHoppingCountWindow,
    rxTumblingTemporalWindow, rxHoppingTemporalWindow, rxFixedIntervalWindow, rxEventIntervalWindow
    rxAll, rxAny, rxAbscence, rxAlways, rxSometimes, rxNhighestValues, rxNlowestValues,
    rxCount, rxValueMax, rxValueMin, rxValueAvg, rxIncreasing, rxDecreasing, rxStable,
    rxNonIncreasing, rxNonDecreasing, rxMixed,
    rxMinDistance, rxMaxDistance, rxAvgDistance, rxRelativeMinDistance, rxRelativeMaxDistance,
    rxRelativeAvgDistance, project} = require('./lib');


const init = (observable, fn) => R.isNil(fn)? observable: observable.pipe(map(fn));

/** Class responsable for instantiating an {@link EventStream} object.
 * @mixin
*/
class EventManager{
    /**
     * Create a EventStream instance from a Rx Observable.
     * @param {Observable} observable - the observable.
     * @param {Function} [mapFn] - a mapping function to map Observable's values to an EventType instance.
     * @return {EventStream} an EventStream object.
     */
    static create(observable, mapFn){
        return new EventStream(init(observable, mapFn));
    }
}

/** Class representing an event stream.
 * It provides CEP functionalities by encapsulating and manipulating a given Rx Observable.
 * All methods return a new stream instance.
 * @mixin
*/
class EventStream {

    /** @hideconstructor */
    constructor(observable){
        this._observable = observable;
    }

    tap(fn){
        return EventManager.create(this._observable.pipe(tap(fn)));
    }

    //filtering
    /**
     * 
     * @param {Function} fn 
     * @return {EventStream} a new event stream instance.
     */
    filter(fn){
        return EventManager.create(this._observable.pipe(filter(fn)));
    }

    //transformation
    /**
     * 
     * @param {EventStream} stream
     * @return {EventStream} the new stream created from the merge operation.
     */
    merge(stream){
        return EventManager.create(this._observable.pipe(merge(stream._observable)));
    }

    /**
     * 
     * @param {string[]} list
     * @param {string} newEvtTypeId
     * @return {EventStream} a new event stream instance.
     */
    project(list, newEvtTypeId){
        return EventManager.create(this._observable.pipe(project(list, newEvtTypeId)));
    }
    
    //windows
    /**
     * 
     * @param {number} n
     * @return {EventStream} a new event stream instance.
     */
    tumblingCountWindow(n){
        return EventManager
                .create(this._observable.pipe(rxTumblingCountWindow(n)));
    }
    /**
     * 
     * @param {number} n
     * @return {EventStream} a new event stream instance.
     */
    slidingCountWindow(n){
        return EventManager
                .create(this._observable.pipe(rxSlidingCountWindow(n)));
    }
    /**
     * 
     * @param {number} n 
     * @param {number} hopSize 
     * @return {EventStream} a new event stream instance.
     */
    hoppingCountWindow(n, hopSize){
        return EventManager
                .create(this._observable.pipe(rxHoppingCountWindow(n, hopSize)));
    }
    /**
     * 
     * @param {number} mSeconds 
     * @return {EventStream} a new event stream instance.
     */
    tumblingTemporalWindow(mSeconds){
        return EventManager
                .create(this._observable.pipe(rxTumblingTemporalWindow(mSeconds)));
    }
    /**
     * 
     * @param {number} mSeconds 
     * @param {number} hopSize 
     * @return {EventStream} a new event stream instance.
     */
    hoppingTemporalWindow(mSeconds, hopSize){
        return EventManager
                .create(this._observable.pipe(rxHoppingTemporalWindow(mSeconds, hopSize)));
    }
    /**
     * 
     * @param {date} start 
     * @param {date|number} end 
     * @param {recurrence} recurrence 
     * @param {ordering} order 
     * @return {EventStream} a new event stream instance.
     */
    fixedIntervalWindow(start, end, recurrence, order){
        return EventManager
                .create(this._observable.pipe(rxFixedIntervalWindow(start, end, recurrence, order)));
    }
    /**
     * 
     * @param {string[]} initiatorEvents - a list containing the event types ids of the instances that initiates the window.
     * @param {string[]} terminatorEvents - a list containing the event types ids of the instances that close the window.
     * @param {number} [expirationTime] - an optional time period used to close the window in case a terminator event
     * has not been detected so far.
     * @return {EventStream} a new event stream instance.
     */
    eventIntervalWindow(initiatorEvents, terminatorEvents, expirationTime){
        return EventManager
                .create(this._observable.pipe(rxEventIntervalWindow(initiatorEvents, terminatorEvents, expirationTime)));
        
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
    all(eventTypeList, newEvtTypeId, assertion){
        return EventManager.create(this._observable.pipe(rxAll(eventTypeList, newEvtTypeId, assertion)));
    }
    /**
     * Based on the logical disjunction operation, this pattern looks for one event instance of any of event type ids listed on {@code eventTypeList}.
     * This operation works on chunks of the stream, so it must be preceded by some window operation.
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
     * @return {EventStream} a new event stream instance.
     */
    any(eventTypeList, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxAny(eventTypeList, newEvtTypeId)));
    }
    /**
     * Based on the logical negation operation, this pattern is satisfied when there are no event instances listed on {@code eventTypeList}.
     * This operation works on chunks of the stream, so it must be preceded by some window operation.
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
     * @return {EventStream} a new event stream instance.
     */
    abscence(eventTypeList, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxAbscence(eventTypeList, newEvtTypeId)));
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
    always(eventTypeList, assertion, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxAlways(eventTypeList, assertion, newEvtTypeId)));
    }
    /**
     * This pattern is satisfied when at least one participant event matches a given assertion.
     * This operation works on chunks of the stream, so it must be preceded by some window operation.
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @param {Function} assertion - an assertion to be tested against all the participant events.
     * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
     * @return {EventStream} a new event stream instance.
     */
    sometimes(eventTypeList, assertion, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxSometimes(eventTypeList, assertion, newEvtTypeId)));
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
    nHighestValues(eventTypeList, n, attribute, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxNhighestValues(eventTypeList, n, attribute, newEvtTypeId)));
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
    nLowestValues(eventTypeList, n, attribute, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxNlowestValues(eventTypeList, n, attribute, newEvtTypeId)));
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
    count(eventTypeList, assertion, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxCount(eventTypeList, assertion, newEvtTypeId)));
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
    valueMax(eventTypeList, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxValueMax(eventTypeList, attribute, assertion, newEvtTypeId)));
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
    valueMin(eventTypeList, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxValueMin(eventTypeList, attribute, assertion, newEvtTypeId)));
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
    valueAvg(eventTypeList, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxValueAvg(eventTypeList, attribute, assertion, newEvtTypeId)));
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
    increasing(eventTypeList, attribute, orderPolicy, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxIncreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId)));
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
    decreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxDecreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId)));
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
    stable(eventTypeList, attribute, orderPolicy, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxStable(eventTypeList, attribute, orderPolicy, newEvtTypeId)));
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
    nonIncreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxNonIncreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId)));
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
    nonDecreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxNonDecreasing(eventTypeList, attribute, orderPolicy, newEvtTypeId)));
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
    mixed(eventTypeList, attribute, orderPolicy, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxMixed(eventTypeList, attribute, orderPolicy, newEvtTypeId)));
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
    minDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxMinDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));
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
    maxDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxMaxDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));
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
    avgDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxAvgDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));
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
    relativeMinDistance(eventTypeList, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxRelativeMinDistance(eventTypeList, attribute, assertion, newEvtTypeId)));
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
    relativeMaxDistance(eventTypeList, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxRelativeMaxDistance(eventTypeList, attribute, assertion, newEvtTypeId)));
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
    relativeAvgDistance(eventTypeList, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxRelativeAvgDistance(eventTypeList, attribute, assertion, newEvtTypeId)));
    }

    /**
     * Subscribes to an event stream.
     * @param {Object} observer - an {@link http://reactivex.io/rxjs/class/es6/MiscJSDoc.js~ObserverDoc.html|Observer} object containing at least a next method.
     * @return {StreamSubscription} a StreamSubscription instance that allows further unsubscription.
     */
    subscribe(observer){
        return new StreamSubscription(this._observable.subscribe(observer));
    }
}
/**
 * Class that encapsulates the underlying observable subscription.
 * @mixin
 */
class StreamSubscription{
    /** @hideconstructor */
    constructor(subscription){
        this._subscription = subscription;
    }

    unsubscribe(){
        this._subscription.unsubscribe();
    }
}

module.exports = {
    EventManager: EventManager,
    EventStream: EventStream
};