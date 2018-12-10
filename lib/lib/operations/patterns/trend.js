const {filter, map} = require('rxjs/operators');
const R = require('ramda');
const {isArray, filterEvtsByEvtTypes, getProp, deriveEvt, AccHelper} = require('../../helperFuntions.js')
const {getPropOrderPolicy} = require('../../helperTime.js');

class Trend{
    constructor(previous = undefined, stable = true, increasing = true, decreasing = true, mixed = true){
        this.previous = previous;
        this.stable = stable;
        this.increasing = increasing;
        this.decreasing = decreasing;
        this.mixed = mixed;
    }
}
const trendConstructor = R.construct(Trend);

const accHelperConstructor = R.construct(AccHelper);

const compareStable = (objAcc, val) => 
    !objAcc ? //first element
        trendConstructor(val) : trendConstructor(val, stableCheck(objAcc, val));

const compareIncreasing = (objAcc, val) =>
    !objAcc ? //first element
        trendConstructor(val) : trendConstructor(val, true, increasingCheck(objAcc, val));

const compareDecreasing = (objAcc, val) =>
    !objAcc ? //first element
        trendConstructor(val) : trendConstructor(val, true, true, decreasingCheck(objAcc, val));

const compareMixed = (objAcc, val) =>
    !objAcc ? //first element
        trendConstructor(val) : 
        trendConstructor(val, stableCheck(objAcc, val), 
            increasingCheck(objAcc, val),
                decreasingCheck(objAcc, val),
                    mixedCheck(objAcc));

const stableCheck = (stableStatus, previous, curr) => stableStatus && (previous == curr);

const increasingCheck = (increasingStatus, previous, curr) => increasingStatus && (previous < curr);

const decreasingCheck = (decreasingStatus, previous, curr) => decreasingStatus && (previous > curr);

const mixedCheck = (objAcc) => !objAcc.stable && !objAcc.increasing && !objAcc.decreasing;


const increasing = (eventTypeList, attribute, orderPolicy, newEvtTypeId) => (source) => {
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const attributeProp = getProp(attribute);
    const orderProp = getPropOrderPolicy(orderPolicy);

    const derivation = deriveEvt('increasing', newEvtTypeId);

    return source.pipe(filter(isArray), //checks if it's an array(window)
                        map(filterEvtsByEvtTypes(preds)), //filters events according to a list of predicates
                        map(buffer => !orderProp ? buffer : R.sortBy(orderProp, buffer)), //order events according to order policy
                        map(buffer => accHelperConstructor(
                            R.reduce((acc, val) => compareIncreasing(acc, val), null, buffer.map(attributeProp)),
                            buffer)), 
                        filter(R.path(['result','increasing'])), //checks the increasing flag
                        map(R.compose(derivation, R.prop('set')))); 
}

const decreasing = (eventTypeList, attribute, orderPolicy, newEvtTypeId) => (source) => {
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const attributeProp = getProp(attribute);
    const orderProp = getPropOrderPolicy(orderPolicy);

    const derivation = deriveEvt('decreasing', newEvtTypeId);

    return source.pipe(filter(isArray), //checks if it's an array(window)
                        map(filterEvtsByEvtTypes(preds)), //filters events according to a list of predicates
                        map(buffer => !orderProp ? buffer : R.sortBy(orderProp, buffer)), //order events according to order policy
                        map(buffer => accHelperConstructor(
                            R.reduce((acc, val) => compareDecreasing(acc, val), null, buffer.map(attributeProp)),
                            buffer)), 
                        filter(R.path(['result','decreasing'])), //checks the decreasing flag
                        map(R.compose(derivation, R.prop('set'))));  
}

const stable = (eventTypeList, attribute, orderPolicy, newEvtTypeId) => (source) => {
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const attributeProp = getProp(attribute);
    const orderProp = getPropOrderPolicy(orderPolicy);

    const derivation = deriveEvt('stable', newEvtTypeId);

    return source.pipe(filter(isArray), //checks if it's an array(window)
                        map(filterEvtsByEvtTypes(preds)), //filters events according to a list of predicates
                        map(buffer => !orderProp ? buffer : R.sortBy(orderProp, buffer)), //order events according to order policy
                        map(buffer => accHelperConstructor(
                            R.reduce((acc, val) => compareStable(acc, val), null, buffer.map(attributeProp)),
                            buffer)), 
                        filter(R.path(['result','stable'])), //checks the stable flag
                        map(R.compose(derivation, R.prop('set')))); 
}

const nonIncreasing = (eventTypeList, attribute, orderPolicy, newEvtTypeId) => (source) => {
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const attributeProp = getProp(attribute);
    const orderProp = getPropOrderPolicy(orderPolicy);

    const derivation = deriveEvt('non increasing', newEvtTypeId);
    
    return source.pipe(filter(isArray), //checks if it's an array(window)
                        map(filterEvtsByEvtTypes(preds)), //filters events according to a list of predicates
                        map(buffer => !orderProp ? buffer : R.sortBy(orderProp, buffer)), //order events according to order policy
                        map(buffer => accHelperConstructor(
                            R.reduce((acc, val) => compareIncreasing(acc, val), null, buffer.map(attributeProp)),
                            buffer)), 
                        filter(R.compose(R.not, R.path(['result','increasing']))), //checks the complement of the increasing flag
                        map(R.compose(derivation, R.prop('set')))); 
}

const nonDecreasing = (eventTypeList, attribute, orderPolicy, newEvtTypeId) => (source) => {
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const attributeProp = getProp(attribute);
    const orderProp = getPropOrderPolicy(orderPolicy);

    const derivation = deriveEvt('non decreasing', newEvtTypeId);

    return source.pipe(filter(isArray), //checks if it's an array(window)
                        map(filterEvtsByEvtTypes(preds)), //filters events according to a list of predicates
                        map(buffer => !orderProp ? buffer : R.sortBy(orderProp, buffer)), //order events according to order policy
                        map(buffer => accHelperConstructor(
                            R.reduce((acc, val) => compareDecreasing(acc, val), null, buffer.map(attributeProp)),
                            buffer)), 
                        filter(R.compose(R.not, R.path(['result','decreasing']))), //checks the complement of the decreasing flag
                        map(R.compose(derivation, R.prop('set')))); 
}

const mixed = (eventTypeList, attribute, orderPolicy, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const attributeProp = getProp(attribute);
    const orderProp = getPropOrderPolicy(orderPolicy);

    const derivation = deriveEvt('mixed', newEvtTypeId);

    return source.pipe(filter(isArray), //checks if it's an array(window)
                        map(filterEvtsByEvtTypes(preds)), //filters events according to a list of predicates
                        map(buffer => !orderProp ? buffer : R.sortBy(orderProp, buffer)), //order events according to order policy
                        map(buffer => accHelperConstructor(
                            R.reduce((acc, val) => compareMixed(acc, val), null, buffer.map(attributeProp)),
                            buffer)), 
                        filter(R.path(['result','mixed'])), //checks the mixed flag
                        map(R.compose(derivation, R.prop('set')))); 
}

module.exports = {
    increasing,
    decreasing,
    stable,
    nonIncreasing,
    nonDecreasing,
    mixed: rxMixed
};