const {Observable} = require('rxjs');
const {filter, map} = require('rxjs/operators');
const R = require('ramda');
const {Point} = require("../../location.js");
const {predEvtTypeList, getLens, deriveEvt} = require("../../helperFuntions.js");


const distanceFn = (lens) => ([a, b]) => Point.distance(R.view(lens, a), R.view(lens, b));
const curriedDistanceFn = R.curry((a, lensB, b) => Point.distance(a, R.view(lensB, b)));

const minFn = R.reduce(R.min, +Infinity);
const maxFn = R.reduce(R.max, -Infinity);

//absolute patterns
const minDistance = (eventTypeList, givenPoint, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = curriedDistanceFn(givenPoint)(attributeLens);
    const participantEvts = source.pipe(map(R.filter(R.cond(preds))));
    const derivation = deriveEvt('Min Distance Pattern', newEvtTypeId);

    return new Observable(observer => 
        participantEvts.subscribe({
            next(x) {
                const minDistance = R.pipe(R.map, minFn)(calcDistance, x);
                
                R.ifElse(R.equals(+Infinity), R.F, assertion)(minDistance)? observer.next(derivation(x)): undefined;
            },
            error(err) { observer.error(err); },
            complete() { observer.complete(); }
        }))
}

const maxDistance = (eventTypeList, givenPoint, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = curriedDistanceFn(givenPoint)(attributeLens);
    const participantEvts = source.pipe(map(R.filter(R.cond(preds))));
    const derivation = deriveEvt('Max Distance Pattern', newEvtTypeId);

    return new Observable(observer => 
        participantEvts.subscribe({
            next(x) {
                const maxDistance = R.pipe(R.map, maxFn)(calcDistance, x);
                
                R.ifElse(R.equals(-Infinity), R.F, assertion)(maxDistance)? observer.next(derivation(x)) : undefined;
            },
            error(err) { observer.error(err); },
            complete() { observer.complete(); }
        }))
}

const avgDistance = (eventTypeList, givenPoint, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = curriedDistanceFn(givenPoint)(attributeLens);
    const participantEvts = source.pipe(map(R.filter(R.cond(preds))));
    const derivation = deriveEvt('Average Distance Pattern', newEvtTypeId);

    return new Observable(observer => 
        participantEvts.subscribe({
            next(x) {
                const meanDistance = R.pipe(R.map, R.mean)(calcDistance, x);
                
                assertion(meanDistance) ? observer.next(derivation(x)): undefined;
            },
            error(err) { observer.error(err); },
            complete() { observer.complete(); }
        }))
}

//relative patterns
const relativeMinDistance = (eventTypeList, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = distanceFn(attributeLens);
    const participantEvts = source.pipe(filter(R.filter(R.cond(preds))));
    const derivation = deriveEvt('Relative Min Distance Pattern', newEvtTypeId);

    return new Observable(observer => 
        participantEvts.subscribe({
            next(x) {
                const minDistance = R.pipe(R.aperture(2), R.map(calcDistance), minFn)(x);

                R.ifElse(R.equals(+Infinity), R.F, assertion)(minDistance)? observer.next(derivation(x)): undefined;
            },
            error(err) { observer.error(err); },
            complete() { observer.complete(); }
        })
    )
}
const relativeMaxDistance = (eventTypeList, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = distanceFn(attributeLens);
    const participantEvts = source.pipe(filter(R.filter(R.cond(preds))));
    const derivation = deriveEvt('Relative Max Distance Pattern', newEvtTypeId);
    
    return new Observable(observer => 
        participantEvts.subscribe({
            next(x) {
                const maxDistance = R.pipe(R.aperture(2), R.map(calcDistance), maxFn)(x);

                R.ifElse(R.equals(+Infinity), R.F, assertion)(maxDistance)? observer.next(derivation(x)): undefined;
            },
            error(err) { observer.error(err); },
            complete() { observer.complete(); }
        })
    )
}

const relativeAvgDistance = (eventTypeList, attribute, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);
    const attributeLens = getLens(attribute);
    const calcDistance = distanceFn(attributeLens);
    const participantEvts = source.pipe(filter(R.filter(R.cond(preds))));
    const derivation = deriveEvt('Relative Average Distance Pattern', newEvtTypeId);

    return new Observable(observer => 
        participantEvts.subscribe({
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
    minDistance,
    maxDistance,
    avgDistance,
    relativeMinDistance,
    relativeMaxDistance,
    relativeAvgDistance
};