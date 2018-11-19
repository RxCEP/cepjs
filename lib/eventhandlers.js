const {filter, map, merge, tap} = require('rxjs/operators');
const R = require('ramda');
const {rxTumblingCountWindow, rxSlidingCountWindow,
    rxHoppingCountWindow, rxTumblingTemporalWindow, rxHoppingTemporalWindow,
    rxAll, rxAny, rxAbscence, rxAlways, rxSometimes, rxMinDistance, rxMaxDistance,
    rxAvgDistance, rxRelativeMinDistance, rxRelativeMaxDistance,
    rxRelativeAvgDistance, project} = require('./rx');


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

    //logical patterns
    /**
     * 
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
     * @param {Function} [assertion] -
     * @return {EventStream} a new event stream instance.
     */
    all(eventTypeList, newEvtTypeId, assertion){
        return EventManager.create(this._observable.pipe(rxAll(eventTypeList, newEvtTypeId, assertion)));
    }
    /**
     * 
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
     * @return {EventStream} a new event stream instance.
     */
    any(eventTypeList, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxAny(eventTypeList, newEvtTypeId)));
    }
    /**
     * 
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
     * @return {EventStream} a new event stream instance.
     */
    abscence(eventTypeList, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxAbscence(eventTypeList, newEvtTypeId)));
    }

    //modal patterns
    /**
     * 
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @param {Function} assertion - an assertion to be tested against all the participant events.
     * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
     * @return {EventStream} a new event stream instance.
     */
    always(eventTypeList, assertion, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxAlways(eventTypeList, assertion, newEvtTypeId)));
    }
    /**
     * 
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @param {Function} assertion - an assertion to be tested against all the participant events.
     * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
     * @return {EventStream} a new event stream instance.
     */
    sometimes(eventTypeList, assertion, newEvtTypeId){
        return EventManager.create(this._observable.pipe(rxSometimes(eventTypeList, assertion, newEvtTypeId)));
    }

    //spatial patterns
    /**
     * 
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @param {Point} givenPoint - a fixed point location used to calculate the absolute distance.
     * @param {(string|string[])} attribute - the common attribute carried by all event occurrences that is used to calculate the distance between the events' locations and the given point.
     * @param {Function} assertion - a threshold assertion to be used against the minimal distance.
     * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
     * @return {EventStream} a new event stream instance.
     */
    minDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxMinDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));
    }
    /**
     * 
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @param {Point} givenPoint - a fixed point location used to calculate the absolute distance.
     * @param {(string|string[])} attribute - the common attribute carried by all event occurrences that is used to calculate the distance between the events' locations and the given point.
     * @param {Function} assertion - a threshold assertion to be used against the maximal distance.
     * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
     * @return {EventStream} a new event stream instance.
     */
    maxDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxMaxDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));
    }
    /**
     * 
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @param {Point} givenPoint - a fixed point location used to calculate the absolute distance.
     * @param {(string|string[])} attribute - the common attribute carried by all event occurrences that is used to calculate the distance between the events' locations and the given point.
     * @param {Function} assertion - a threshold assertion to be used against the average distance.
     * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
     * @return {EventStream} a new event stream instance.
     */
    avgDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxAvgDistance(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));
    }
    /**
     * 
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @param {(string|string[])} attribute - the common attribute carried by all event occurrences that is used to calculate the distance among the events' locations.
     * @param {Function} assertion - a threshold assertion to be used against the relative minimal distance.
     * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
     * @return {EventStream} a new event stream instance.
     */
    relativeMinDistance(eventTypeList, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxRelativeMinDistance(eventTypeList, attribute, assertion, newEvtTypeId)));
    }
    /**
     * 
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @param {(string|string[])} attribute - the common attribute carried by all event occurrences that is used to calculate the distance among the events' locations.
     * @param {Function} assertion - a threshold assertion to be used against the relative maximal distance.
     * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
     * @return {EventStream} a new event stream instance.
     */
    relativeMaxDistance(eventTypeList, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxRelativeMaxDistance(eventTypeList, attribute, assertion, newEvtTypeId)));
    }
    /**
     * 
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @param {(string|string[])} attribute - the common attribute carried by all event occurrences that is used to calculate the distance among the events' locations.
     * @param {Function} assertion - a threshold assertion to be used against the relative average distance.
     * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
     * @return {EventStream} a new event stream instance.
     */
    relativeAvgDistance(eventTypeList, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxRelativeAvgDistance(eventTypeList, attribute, assertion, newEvtTypeId)));
    }
    /**
     * 
     * @param {Observer} - an Observer object containing at least a next method.
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