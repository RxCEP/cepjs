const {filter, map, mergeMap} = require('rxjs/operators');
const R = require('ramda');
const {predEvtTypeList, compareEvtType, deriveEvt, isArray, evtTypeListCheck} = require('./helperFuntions.js');


const rxAll = (eventTypeList, newEvtTypeId, assertion) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);//a list of predicates with the event type list
    const evtTypeListCounted = R.countBy(R.identity, eventTypeList);

    const xprodN = R.liftN(evtTypeListCounted.length, (...args) => args);//calculates the product of n sets

    const derivation = deriveEvt('all', newEvtTypeId);

    return source.pipe(filter(elems => evtTypeListCheck(1)(eventTypeList)),
            filter(isArray),//checks if it's an array(window)
            map(R.filter(R.cond(preds))),//filters out the events that aren't in the event type list
            map(elems => R.uniq(eventTypeList).reduce((acc, evtType) =>
                    acc.push(
                        evtTypeListCounted[evtType] === 1 ? elems.filter(compareEvtType(evtType)): 
                        R.splitEvery(evtTypeListCounted[evtType], elems.filter(compareEvtType(evtType)))
                    ) ,[])
            ),
            map(elems => xprodN.apply(null, elems)),//calculates the cartesian product
            map(R.map(R.flatten)),//flattens the inner sets
            filter(R.filter(R.both(R.compose(R.not, R.isEmpty), R.compose(R.equals(eventTypeList.length), R.length)))),//checks if the sets aren't empty and have the required size
            map(product => product.filter(set => assertion ? assertion.apply(null, set) : true)),//applies the assertion if it exists
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