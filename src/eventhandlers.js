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

class VanNearBy{
    constructor(location){
        this._location = location;
    }

    get location() {
        return this._location;
    }
    set location(value) {
        this._location = value;
    }
}

/* console.dir(Point);
let stream = EventManager.create(of(new VanNearBy(new Point(-8.04689086, -34.92822534)), 
new VanNearBy(new Point(-8.03109541, -34.98213442)),
new VanNearBy(new Point(-7.93997686, -35.00342681)),
new VanNearBy(new Point(-7.9748842, -34.87315293))));
console.log(stream.filter(x => x !==undefined)); */