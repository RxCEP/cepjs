const {filter, map} = require('rxjs/operators');
const R = require('ramda');
const {predEvtTypeList, deriveEvt, isArray, getProp,
    filterEvtsByEvtTypes, AccHelper} = require('../../helperFuntions.js');

const accHelperConstructor = R.construct(AccHelper);

const rxCount = (eventTypeList, assertion, newEvtTypeId) => (source) => {
    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const derivation = deriveEvt('count', newEvtTypeId);

    return source.pipe(filter(isArray),//checks if it's an array(window)
            map(filterEvtsByEvtTypes(preds)),//filters events according to a list of predicates
            filter(R.compose(assertion, R.length)),
            map(derivation));
}
const rxValueMax = (eventTypeList, attribute, assertion, newEvtTypeId) => (source) => {
    const testAssertion = R.compose(assertion, R.reduce(R.max, -Infinity), R.map(getProp(attribute)));

    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const derivation = deriveEvt('value max', newEvtTypeId);

    return source.pipe(filter(isArray), //checks if it's an array(window)
            map(filterEvtsByEvtTypes(preds)), //filters events according to a list of predicates
            map(buffer => accHelperConstructor(testAssertion(buffer), buffer)),
            filter(R.prop('result')),
            map(R.compose(derivation, R.prop('set'))));
}

const rxValueMin = (eventTypeList, attribute, assertion, newEvtTypeId) => (source) => {
    const testAssertion = R.compose(assertion, R.reduce(R.min, Infinity), R.map(getProp(attribute)));

    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const derivation = deriveEvt('value min', newEvtTypeId);

    return source.pipe(filter(isArray), //checks if it's an array(window)
            map(filterEvtsByEvtTypes(preds)), //filters events according to a list of predicates
            map(buffer => accHelperConstructor(testAssertion(buffer), buffer)),
            filter(R.prop('result')),
            map(R.compose(derivation, R.prop('set'))));
}

const rxValueAvg = (eventTypeList, attribute, assertion, newEvtTypeId) => (source) => {
    const testAssertion = R.compose(assertion, R.mean, R.map(getProp(attribute)));

    const preds = predEvtTypeList(eventTypeList); //a list of predicates with the event type list

    const derivation = deriveEvt('value average', newEvtTypeId);

    return source.pipe(filter(isArray), //checks if it's an array(window)
            map(filterEvtsByEvtTypes(preds)), //filters events according to a list of predicates
            map(buffer => accHelperConstructor(testAssertion(buffer), buffer)),
            filter(R.prop('result')),
            map(R.compose(derivation, R.prop('set'))));
}

module.exports = {
    rxCount: rxCount,
    rxValueMax: rxValueMax,
    rxValueMin: rxValueMin,
    rxValueAvg: rxValueAvg
};