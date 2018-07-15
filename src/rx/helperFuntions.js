const R = require('ramda');

const comp = R.curry((eventType, className) => 
                            eventType === className.constructor.name);

const condition = evt => [comp(evt), R.T];

const predEvtTypeList = eventTypeList => R.map(condition, eventTypeList);

module.exports = {
    predEvtTypeList: predEvtTypeList
};