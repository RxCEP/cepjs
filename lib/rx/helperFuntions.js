const R = require('ramda');

const occTimeLens = R.lensProp('_occurrenceTime');
const detcTimeLens = R.lensProp('_detectionTime');

const comp = R.curry((eventType, event) => 
                            eventType === R.view(R.lensProp('eventTypeId'), event));

const condition = evt => [comp(evt), R.T];

const predEvtTypeList = eventTypeList => R.map(condition, eventTypeList);

const getLens = (prop) => R.ifElse(R.is(String), R.lensProp, R.lensPath)(prop);

module.exports = {
    predEvtTypeList: predEvtTypeList,
    getLens: getLens,
    occTimeLens: occTimeLens,
    detcTimeLens: detcTimeLens
};