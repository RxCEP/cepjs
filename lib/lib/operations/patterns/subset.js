const {filter, map} = require('rxjs/operators');
const R = require('ramda');
const {predEvtTypeList, deriveEvt, isArray, getProp, filterEvtsByEvtTypes} = require('../../helperFuntions.js');

const notNullNotEmpty = R.allPass([R.compose(R.not, R.isEmpty), R.compose(R.not, R.isNil)]);

const nHighestValues = (eventTypeList, n, attribute, newEvtTypeId) => (source) => {
    const property = getProp(attribute);
    
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const derivation = deriveEvt('n highest values', newEvtTypeId);

    return source.pipe(filter(isArray),//checks if it's an array(window)
            map(filterEvtsByEvtTypes(preds)),//filters events according to a list of predicates
            map(R.compose(R.take(n),R.sortBy(property))),
            filter(notNullNotEmpty),
            map(derivation));
}
const nLowestValues = (eventTypeList, n, attribute, newEvtTypeId) => (source) => {
    const property = getProp(attribute);

    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const derivation = deriveEvt('n lowest values', newEvtTypeId);

    return source.pipe(filter(isArray),//checks if it's an array(window)
            map(filterEvtsByEvtTypes(preds)),//filters events according to a list of predicates
            map(R.compose(R.takeLast(n),R.sortBy(property))),
            filter(notNullNotEmpty)),
            map(derivation);
}

module.exports = {
    nHighestValues,
    nLowestValues
};