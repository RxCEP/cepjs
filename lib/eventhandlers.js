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
     */
    filter(fn){
        return EventManager.create(this._observable.pipe(filter(fn)));
    }

    //transformation
    project(list, newEvtTypeId){
        return EventManager.create(this._observable.pipe(project(list, newEvtTypeId)));
    }
    
    //windows
    tumblingCountWindow(n){
        return EventManager
                .create(this._observable.pipe(rxTumblingCountWindow(n)));
    }
    slidingCountWindow(n){
        return EventManager
                .create(this._observable.pipe(rxSlidingCountWindow(n)));
    }
    hoppingCountWindow(n, hopSize){
        return EventManager
                .create(this._observable.pipe(rxHoppingCountWindow(n, hopSize)));
    }
    tumblingTemporalWindow(mSeconds){
        return EventManager
                .create(this._observable.pipe(rxTumblingTemporalWindow(mSeconds)));
    }
    hoppingTemporalWindow(mSeconds, hopSize){
        return EventManager
                .create(this._observable.pipe(rxHoppingTemporalWindow(mSeconds, hopSize)));
    }

    //logical patterns
    /**
     * 
     * @param {string[]} eventTypeList 
     * @param {*} param 
     */
    allPattern(eventTypeList, param){
        return EventManager.create(this._observable.pipe(rxAllPattern(eventTypeList, param)));
    }
    /**
     * 
     * @param {string[]} eventTypeList 
     */
    anyPattern(eventTypeList){
        return EventManager.create(this._observable.pipe(rxAnyPattern(eventTypeList)));
    }
    /**
     * 
     * @param {string[]} eventTypeList 
     */
    abscencePattern(eventTypeList){
        return EventManager.create(this._observable.pipe(rxAbscencePattern(eventTypeList)));
    }

    //spatial patterns
    /**
     * 
     * @param {string[]} eventTypeList 
     * @param {Point} givenPoint 
     * @param {(string|string[])} attribute 
     * @param {Function} assertion 
     * @param {string} newEvtTypeId 
     */
    minDistancePattern(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxMinDistancePattern(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));
    }
    /**
     * 
     * @param {string[]} eventTypeList 
     * @param {Point} givenPoint 
     * @param {(string|string[])} attribute 
     * @param {Function} assertion 
     * @param {string} newEvtTypeId 
     */
    maxDistancePattern(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxMaxDistancePattern(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));
    }
    /**
     * 
     * @param {string[]} eventTypeList 
     * @param {Point} givenPoint 
     * @param {(string|string[])} attribute 
     * @param {Function} assertion 
     * @param {string} newEvtTypeId 
     */
    avgDistancePattern(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxAvgDistancePattern(eventTypeList, givenPoint, attribute, assertion, newEvtTypeId)));
    }
    /**
     * 
     * @param {string[]} eventTypeList 
     * @param {(string|string[])} attribute 
     * @param {Function} assertion 
     * @param {string} newEvtTypeId 
     */
    relativeMinDistancePattern(eventTypeList, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxRelativeMinDistancePattern(eventTypeList, attribute, assertion, newEvtTypeId)));
    }
    /**
     * 
     * @param {string[]} eventTypeList 
     * @param {(string|string[])} attribute 
     * @param {Function} assertion 
     * @param {string} newEvtTypeId 
     */
    relativeMaxDistancePattern(eventTypeList, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxRelativeMaxDistancePattern(eventTypeList, attribute, assertion, newEvtTypeId)));
    }
    /**
     * 
     * @param {string[]} eventTypeList 
     * @param {(string|string[])} attribute 
     * @param {Function} assertion 
     * @param {string} newEvtTypeId 
     */
    relativeAvgDistancePattern(eventTypeList, attribute, assertion, newEvtTypeId){
        return EventManager.create(this._observable
            .pipe(rxRelativeAvgDistancePattern(eventTypeList, attribute, assertion, newEvtTypeId)));
    }
    /**
     * 
     * @param {Observer} observer 
     * @return {StreamSubscription}
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