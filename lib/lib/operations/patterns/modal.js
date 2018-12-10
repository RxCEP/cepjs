const {filter, map} = require('rxjs/operators');
const R = require('ramda');
const {predEvtTypeList, deriveEvt, isArray} = require('../../helperFuntions.js');

const always = (eventTypeList, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);//a list of predicates with the event type list

    const derivation = deriveEvt('always', newEvtTypeId);

    return source.pipe(filter(isArray),//checks if it's an array (window)
                        map(filterEvtsByEvtTypes(preds)),//filters out the events that aren't in the event type list
                        filter(R.all(assertion)),
                        map(derivation));
}

const sometimes = (eventTypeList, assertion, newEvtTypeId) => (source) =>{
    const preds = predEvtTypeList(eventTypeList);//a list of predicates with the event type list

    const derivation = deriveEvt('sometimes', newEvtTypeId);

    return source.pipe(filter(isArray),//checks if it's an array (window)
            map(filterEvtsByEvtTypes(preds)),//filters out the events that aren't in the event type list
            filter(R.any(assertion)),
            map(derivation));
}


module.exports = {
    always,
    sometimes
};