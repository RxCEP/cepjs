const R = require('ramda');
const EventType = require('../eventtype');


const compareEvtType = R.curry((eventType, event) => 
                            eventType === R.view(R.lensProp('eventTypeId'), event));

const condition = evt => [compareEvtType(evt), R.T];

//returns a list of predicates according to the given eventTypeList
const predEvtTypeList = R.map(condition);
//applies the list of predicates constructed by predEvtTypeList
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

const isWindow = val => { //checks if it's an window(array)
    if(R.is(Array, val)){
        return true;
    }
    throw new Error('This operation must be preceded by a window operator');
};

const evtTypeListLengthOne = evtTypeList => { //checks if the length of the event type list is greater than 1
    if(evtTypeList.length > 1){
        return true;
    }
    throw new Error('The event type list must have more than one element')
}

const AccHelper = function(result, set){
    this.result = result;
    this.set = set;
};

const minFn = R.reduce(R.min, Infinity);
const maxFn = R.reduce(R.max, -Infinity);

module.exports = {
    compareEvtType,
    predEvtTypeList,
    filterEvtsByEvtTypes,
    getLens,
    getProp,
    deriveEvt,
    isWindow,
    evtTypeListLengthOne,
    AccHelper,
    minFn, 
    maxFn
};