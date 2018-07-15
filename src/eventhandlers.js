const {of} = require("rxjs");
const {filter, map} = require('rxjs/operators');
const {Point} = require('./index.js');
const {rxTumblingCountWindow, rxSlidingCountWindow,
    rxHoppingCountWindow, rxTumblingTemporalWindow, rxHoppingTemporalWindow,
    rxAllPattern, rxAnyPattern, rxAbscencePattern, rxMinDistancePattern, rxMaxDistancePattern,
    rxAvgDistancePattern, rxRelativeMinDistancePattern, rxRelativeMaxDistancePattern,
    rxRelativeAvgDistancePattern} = require('./rx');
const R = require('ramda');

const init = (observable, fn) => R.isNil(fn)? observable: observable.pipe(map(mapFn));

class EventManager{
    static create(observable, mapFn){
        return new EventStream(init(observable, mapFn));
    }
}

class EventStream {
    constructor(observable){
        this._observable = observable;
    }

    filter(fn){
        return EventManager.create(this._observable.pipe(filter(fn)));
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
    allPattern(eventTypeList, param){
        return EventManager.create(this._observable.pipe(rxAllPattern(eventTypeList, param)));
    }
    anyPattern(eventTypeList){
        return EventManager.create(this._observable.pipe(rxAnyPattern(eventTypeList)));
    }
    abscencePattern(eventTypeList){
        return EventManager.create(this._observable.pipe(rxAbscencePattern(eventTypeList)));
    }

    //spatial patterns

    minDistancePattern(eventTypeList, givenPoint, attribute, assertion){
        return EventManager.create(this._observable
            .pipe(rxMinDistancePattern(eventTypeList, givenPoint, attribute, assertion)));
    }
    maxDistancePattern(eventTypeList, givenPoint, attribute, assertion){
        return EventManager.create(this._observable
            .pipe(rxMaxDistancePattern(eventTypeList, givenPoint, attribute, assertion)));
    }
    avgDistancePattern(eventTypeList, givenPoint, attribute, assertion){
        return EventManager.create(this._observable
            .pipe(rxAvgDistancePattern(eventTypeList, givenPoint, attribute, assertion)));
    }
    relativeMinDistancePattern(eventTypeList, attribute, assertion){
        return EventManager.create(this._observable
            .pipe(rxRelativeMinDistancePattern(eventTypeList, attribute, assertion)));
    }
    relativeMaxDistancePattern(eventTypeList, attribute, assertion){
        return EventManager.create(this._observable
            .pipe(rxRelativeMaxDistancePattern(eventTypeList, attribute, assertion)));
    }
    relativeAvgDistancePattern(eventTypeList, attribute, assertion){
        return EventManager.create(this._observable
            .pipe(rxRelativeAvgDistancePattern(eventTypeList, attribute, assertion)));
    }

    subscribe(observer){
        return new StreamSubscription(this._observable.subscribe(observer));
    }
}

class StreamSubscription{
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