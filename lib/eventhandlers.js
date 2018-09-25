const {filter, map, tap} = require('rxjs/operators');
const R = require('ramda');
const {rxTumblingCountWindow, rxSlidingCountWindow,
    rxHoppingCountWindow, rxTumblingTemporalWindow, rxHoppingTemporalWindow,
    rxAllPattern, rxAnyPattern, rxAbscencePattern, rxMinDistancePattern, rxMaxDistancePattern,
    rxAvgDistancePattern, rxRelativeMinDistancePattern, rxRelativeMaxDistancePattern,
    rxRelativeAvgDistancePattern, project} = require('./rx');


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
     * @param {Function} param
     * @return {EventStream} a new event stream instance.
     */
    allPattern(eventTypeList, param){
        return EventManager.create(this._observable.pipe(rxAllPattern(eventTypeList, param)));
    }
    /**
     * 
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @return {EventStream} a new event stream instance.
     */
    anyPattern(eventTypeList){
        return EventManager.create(this._observable.pipe(rxAnyPattern(eventTypeList)));
    }
    /**
     * 
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @return {EventStream} a new event stream instance.
     */
    abscencePattern(eventTypeList){
        return EventManager.create(this._observable.pipe(rxAbscencePattern(eventTypeList)));
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
    minDistancePattern(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxMinDistancePattern(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));
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
    maxDistancePattern(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxMaxDistancePattern(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));
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
    avgDistancePattern(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxAvgDistancePattern(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));
    }
    /**
     * 
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @param {(string|string[])} attribute - the common attribute carried by all event occurrences that is used to calculate the distance between the events' locations and the given point.
     * @param {Function} assertion - a threshold assertion to be used against the relative minimal distance.
     * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
     * @return {EventStream} a new event stream instance.
     */
    relativeMinDistancePattern(eventTypeList, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxRelativeMinDistancePattern(eventTypeList, attribute, assertion, newEvtTypeId)));
    }
    /**
     * 
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @param {(string|string[])} attribute - the common attribute carried by all event occurrences that is used to calculate the distance between the events' locations and the given point.
     * @param {Function} assertion - a threshold assertion to be used against the relative maximal distance.
     * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
     * @return {EventStream} a new event stream instance.
     */
    relativeMaxDistancePattern(eventTypeList, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxRelativeMaxDistancePattern(eventTypeList, attribute, assertion, newEvtTypeId)));
    }
    /**
     * 
     * @param {string[]} eventTypeList - a list containing the event types that are to be considered in the pattern operation.
     * @param {(string|string[])} attribute - the common attribute carried by all event occurrences that is used to calculate the distance between the events' locations and the given point.
     * @param {Function} assertion - a threshold assertion to be used against the relative average distance.
     * @param {string} newEvtTypeId - the event type id of new event generated when the pattern is satisfied.
     * @return {EventStream} a new event stream instance.
     */
    relativeAvgDistancePattern(eventTypeList, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxRelativeAvgDistancePattern(eventTypeList, attribute, assertion, newEvtTypeId)));
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