const {filter, map} = require('rxjs/operators');
const R = require('ramda');
const {predEvtTypeList, deriveEvt, isArray} = require('./helperFuntions.js');

const rxAlways = (eventTypeList, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const derivation = deriveEvt('always', newEvtTypeId);

    return source.pipe(filter(isArray), //checks if it's an array (window)
                        map(R.filter(R.cond(preds))),
                        filter(R.all(assertion)),
                        map(derivation));
}

const rxSometimes = (eventTypeList, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const derivation = deriveEvt('sometimes', newEvtTypeId);

    return source.pipe(filter(isArray), //checks if it's an array (window)
            map(R.filter(R.cond(preds))),
            filter(R.any(assertion)),
            map(derivation));
}


module.exports = {
    rxAlways: rxAlways,
    rxSometimes: rxSometimes
};