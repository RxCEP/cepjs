const {Observable} = require('rxjs');
const {filter, map} = require('rxjs/operators');
const R = require('ramda');
const {predEvtTypeList, comp} = require('./helperFuntions.js');


const rxAllPattern = (eventTypeList, param) => (source) => 
    new Observable(observer => 
        source.subscribe({
            next(x) {
                const addList = (pred, acc, val) => pred ? R.append(val, acc): acc;

                let elements = [];
                R.forEach(
                    elem => elements = R.append(x.filter(comp(elem)), elements), eventTypeList
                );

                let xprodN = R.liftN(eventTypeList.length, (...args) => args);
                const prod = xprodN.apply(null, elements);

                let results = [];
                
                R.forEach( (val) =>{
                    results = addList(param.apply(null, val), results, val)}, prod
                );
                
                observer.next(results);
            },
            error(err) { observer.error(err); },
            complete() { observer.complete(); }
        })
    );
const rxAnyPattern = (eventTypeList) => (source) => {
    const preds = predEvtTypeList(eventTypeList);
    return source.pipe(map(x => x.filter(z => R.cond(preds)(z))[0]), 
            filter(x => !R.isEmpty(x) && !R.isNil(x)));
}
const rxAbscencePattern = (eventTypeList) => (source) => {
    const preds = predEvtTypeList(eventTypeList);
    return source.pipe(map(x => x.filter(z => R.cond(preds)(z))),
            filter(x => !R.isNil(x)));
}

module.exports = {
    rxAllPattern: rxAllPattern,
    rxAnyPattern: rxAnyPattern,
    rxAbscencePattern: rxAbscencePattern
};