const {filter, map, mergeMap} = require('rxjs/operators');
const R = require('ramda');
const {predEvtTypeList, compareEvtType, deriveEvt, isArray} = require('./helperFuntions.js');


const rxAll = (eventTypeList, param, newEvtTypeId) => (source) =>{
    const evtTypeListCheck = R.compose(R.equals(1), R.length); //event type list length must be greater than 1
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const xprodN = R.liftN(eventTypeList.length, (...args) => args); //calculates the product of n sets

    const derivation = deriveEvt('all', newEvtTypeId);

    return source.pipe(filter(elems => evtTypeListCheck(eventTypeList)),
            filter(isArray),//checks if it's an array(window)
            map(R.filter(R.cond(preds))),
            map(elems => eventTypeList.reduce((acc, evtType) => acc.push(elems.filter(compareEvtType(evtType))) ,[])),
            filter(elems => elems.reduce((acc, current) => acc && !R.isEmpty(current), true)), //checks if the subsets aren't empty
            map(elems => xprodN.apply(null, elems)),
            map(product => product.filter(set => param ? param.apply(null, set) : true)), 
            mergeMap(product => from(product)),
            map(derivation));
    
}
const rxAny = (eventTypeList, newEvtTypeId) => (source) => {
    const notNullNotEmpty = R.allPass([R.compose(R.not, R.isEmpty), R.compose(R.not, R.isNil)]);
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const derivation = deriveEvt('any', newEvtTypeId);

    return source.pipe(filter(isArray),//checks if it's an array(window)
            map(R.filter(R.cond(preds))),
            map(elems => elems[0]),
            filter(notNullNotEmpty),
            map(derivation));
}
const rxAbscence = (eventTypeList, newEvtTypeId) => (source) => {
    const notNullisEmpty = R.allPass([R.compose(R.not, R.isNil), R.isEmpty]);
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const derivation = deriveEvt('abscence', newEvtTypeId);

    return source.pipe(filter(isArray),//checks if it's an array(window)
            map(R.filter(R.cond(preds))),
            filter(notNullisEmpty)),
            map(derivation);
}

module.exports = {
    rxAll: rxAll,
    rxAny: rxAny,
    rxAbscence: rxAbscence
};