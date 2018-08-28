const {Observable} = require('rxjs');
const {filter, map} = require('rxjs/operators');
const R = require('ramda');
const {Point} = require("./location.js");
const {predEvtTypeList, getLens, occTimeLens, detcTimeLens} = require("./helperFuntions.js");
const {EventType} = require('../eventtype.js');


const distanceFn = (lens) => ([a, b]) => Point.distance(R.view(lens, a), R.view(lens, b));
const curriedDistanceFn = R.curry((a, lensB, b) => Point.distance(a, R.view(lensB, b)));

const minFn = R.reduce(R.min, +Infinity);
const maxFn = R.reduce(R.max, -Infinity);

const deriveEvt = R.curry((eventSource, newEvtTypeId, elms)=>{
    let newEvt = new EventType(newEvtTypeId, new Date(), '', eventSource);
    newEvt = R.set(detcTimeLens, R.view(occTimeLens, newEvt), newEvt);
    newEvt = R.assoc('matchingSet', elms, newEvt);
    return newEvt;
});

//absolute patterns
const rxMinDistancePattern = (eventTypeList, givenPoint, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = curriedDistanceFn(givenPoint)(attributeLens);
    const partEvents = source.pipe(map(R.filter(R.cond(preds))));
    const derivation = deriveEvt('Min Distance Pattern', newEvtTypeId);

    return new Observable(observer => 
        partEvents.subscribe({
            next(x) {
                const minDistance = R.pipe(R.map, minFn)(calcDistance, x);
                
                R.ifElse(R.equals(+Infinity), R.F, assertion)(minDistance)? observer.next(derivation(x)): undefined;
            },
            error(err) { observer.error(err); },
            complete() { observer.complete(); }
        }))
}

const rxMaxDistancePattern = (eventTypeList, givenPoint, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = curriedDistanceFn(givenPoint)(attributeLens);
    const partEvents = source.pipe(map(R.filter(R.cond(preds))));
    const derivation = deriveEvt('Max Distance Pattern', newEvtTypeId);

    return new Observable(observer => 
        partEvents.subscribe({
            next(x) {
                const maxDistance = R.pipe(R.map, maxFn)(calcDistance, x);
                
                R.ifElse(R.equals(-Infinity), R.F, assertion)(maxDistance)? observer.next(derivation(x)) : undefined;
            },
            error(err) { observer.error(err); },
            complete() { observer.complete(); }
        }))
}

const rxAvgDistancePattern = (eventTypeList, givenPoint, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = curriedDistanceFn(givenPoint)(attributeLens);
    const partEvents = source.pipe(map(R.filter(R.cond(preds))));
    const derivation = deriveEvt('Average Distance Pattern', newEvtTypeId);

    return new Observable(observer => 
        partEvents.subscribe({
            next(x) {
                const meanDistance = R.pipe(R.map, R.mean)(calcDistance, x);
                
                assertion(meanDistance) ? observer.next(derivation(x)): undefined;
            },
            error(err) { observer.error(err); },
            complete() { observer.complete(); }
        }))
}

//relative patterns
const rxRelativeMinDistancePattern = (eventTypeList, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = distanceFn(attributeLens);
    const partEvents = source.pipe(filter(R.filter(R.cond(preds))));
    const derivation = deriveEvt('Relative Min Distance Pattern', newEvtTypeId);

    return new Observable(observer => 
        partEvents.subscribe({
            next(x) {
                const minDistance = R.pipe(R.aperture(2), R.map(calcDistance), minFn)(x);

                R.ifElse(R.equals(+Infinity), R.F, assertion)(minDistance)? observer.next(derivation(x)): undefined;
            },
            error(err) { observer.error(err); },
            complete() { observer.complete(); }
        })
    )
}
const rxRelativeMaxDistancePattern = (eventTypeList, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = distanceFn(attributeLens);
    const partEvents = source.pipe(filter(R.filter(R.cond(preds))));
    const derivation = deriveEvt('Relative Max Distance Pattern', newEvtTypeId);
    
    return new Observable(observer => 
        partEvents.subscribe({
            next(x) {
                const maxDistance = R.pipe(R.aperture(2), R.map(calcDistance), maxFn)(x);

                R.ifElse(R.equals(+Infinity), R.F, assertion)(maxDistance)? observer.next(derivation(x)): undefined;
            },
            error(err) { observer.error(err); },
            complete() { observer.complete(); }
        })
    )
}

const rxRelativeAvgDistancePattern = (eventTypeList, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = distanceFn(attributeLens);
    const partEvents = source.pipe(filter(R.filter(R.cond(preds))));
    const derivation = deriveEvt('Relative Average Distance Pattern', newEvtTypeId);

    return new Observable(observer => 
        partEvents.subscribe({
            next(x) {
                const meanDistance = R.pipe(R.aperture(2), R.map(calcDistance), R.mean)(x);

                assertion(meanDistance) ? observer.next(derivation(x)): undefined;
            },
            error(err) { observer.error(err); },
            complete() { observer.complete(); }
        })
    )
}

module.exports = {
    rxMinDistancePattern: rxMinDistancePattern,
    rxMaxDistancePattern: rxMaxDistancePattern,
    rxAvgDistancePattern: rxAvgDistancePattern,
    rxRelativeMinDistancePattern: rxRelativeMinDistancePattern,
    rxRelativeMaxDistancePattern: rxRelativeMaxDistancePattern,
    rxRelativeAvgDistancePattern: rxRelativeAvgDistancePattern
};