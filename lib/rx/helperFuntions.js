const R = require('ramda');
const {EventType} = require('../eventtype.js');

//lenses for occurrence and detection time
const occTimeLens = R.lensProp('_occurrenceTime');
const detcTimeLens = R.lensProp('_detectionTime');

const compareEvtType = R.curry((eventType, event) => 
                            eventType === R.view(R.lensProp('eventTypeId'), event));

const condition = evt => [compareEvtType(evt), R.T];

const predEvtTypeList = eventTypeList => R.map(condition, eventTypeList);

//get the appropriate lens according to whether it is a string or an array(path)
const getLens = (prop) => R.ifElse(R.is(String), R.lensProp, R.lensPath)(prop);

const deriveEvt = R.curry((eventSource, newEvtTypeId, elms)=>{
    let newEvt = new EventType(newEvtTypeId, new Date(), '', eventSource);
    newEvt = R.set(detcTimeLens, R.view(occTimeLens, newEvt), newEvt);
    newEvt = R.assoc('matchingSet', elms, newEvt);
    return newEvt;
});

const isArray = R.is(Array); //checks if it's an array
const evtTypeListCheck = length => R.compose(R.equals(length), R.length);//checks if the length of the event type list is greater than 1

module.exports = {
    compareEvtType: compareEvtType,
    predEvtTypeList: predEvtTypeList,
    getLens: getLens,
    occTimeLens: occTimeLens,
    detcTimeLens: detcTimeLens,
    deriveEvt: deriveEvt,
    isArray: isArray,
    evtTypeListCheck: evtTypeListCheck
};