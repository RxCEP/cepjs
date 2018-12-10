const R = require('ramda');
const {EventType} = require('../eventtype.js');


const compareEvtType = R.curry((eventType, event) => 
                            eventType === R.view(R.lensProp('eventTypeId'), event));

const condition = evt => [compareEvtType(evt), R.T];

const predEvtTypeList = eventTypeList => R.map(condition, eventTypeList);

const filterEvtsByEvtTypes = R.compose(R.filter, R.cond);

//get the appropriate lens according to whether it is a string or an array(path)
const getLens = (prop) => R.ifElse(R.is(String), R.lensProp, R.lensPath)(prop);
const getProp = R.ifElse(R.is(String), R.prop, R.path);

const deriveEvt = R.curry((eventSource, newEvtTypeId, elms) => {
    const currDate = new Date();
    let newEvt = new EventType(newEvtTypeId, eventSource, currDate, currDate);
    newEvt = R.assoc('matchingSet', elms, newEvt);
    return newEvt;
});

const isArray = R.is(Array); //checks if it's an array
const evtTypeListCheck = length => 
                            R.compose(R.equals(length), R.length);//checks if the length of the event type list is greater than 1

const AccHelper = function(result, set){
    this.result = result;
    this.set = set;
};

module.exports = {
    compareEvtType: compareEvtType,
    predEvtTypeList: predEvtTypeList,
    filterEvtsByEvtTypes: filterEvtsByEvtTypes,
    getLens: getLens,
    getProp: getProp,
    deriveEvt: deriveEvt,
    isArray: isArray,
    evtTypeListCheck: evtTypeListCheck,
    AccHelper: AccHelper
};