const _ = require('lodash');
const _FP = require('lodash/fp');
const eachCons = require('each-cons');
const EventType = require('../eventtype');
const { order } = require('../policies/pattern-policies');
const { recurrence } = require('./common/context');

const aperture = n => array => eachCons(array, n);

const groupWith = path => _FP.compose(_FP.values, _FP.groupBy(_FP.get(path)));

const compareEvtType = _FP.curry((eventType, event) =>
  eventType === _FP.get('eventTypeId', event));

const condition = evt => [compareEvtType(evt), _FP.T];

// returns a list of predicates according to the given eventTypeList
const predEvtTypeList = _FP.map(condition);

// applies the list of predicates constructed by predEvtTypeList
const filterEvtsByEvtTypes = _FP.compose(_FP.filter, _FP.cond);


const deriveEvt = _FP.curry((eventSource, newEvtTypeId, elms) => {
  const currDate = Date.now();

  return _.set(
    new EventType(newEvtTypeId, eventSource, currDate, currDate),
    'matchingSet',
    elms);
});

const isWindow = val => { // checks if it's an window(array)
  if (_.isArray(val)) {
    return true;
  }
  throw new Error('Pattern operations must be preceded by a window operator');
};

const evtTypeListLengthOne = evtTypeList => { // checks if the length of the event type list is greater than 1
  if (evtTypeList.length > 1) {
    return true;
  }
  throw new Error('One of the used operations requires an event type list with a length greater than one!');
}

const AccHelper = function (result, set) {
  this.result = result;
  this.set = set;
};

const getPropOrderPolicy = _FP.cond([
  [_FP.equals(order.OCCURRENCE_TIME), _FP.always(_FP.get('occurrenceTime'))],
  [_FP.equals(order.DETECTION_TIME), _FP.always(_FP.get('detectionTime'))]
]);//default stream position == undefined

const DAYLY = 1000 * 60 * 60 * 24;
const WEEKLY = DAYLY * 7;

const getRecurrenceMilliseconds = start => _FP.cond([
  [_FP.equals(recurrence.DAYLY), _FP.always(DAYLY)],
  [_FP.equals(recurrence.WEEKLY), _FP.always(WEEKLY)],
  [_FP.equals(recurrence.MONTHLY), _FP.always(getDaysInMonth(start) * DAYLY)],
  [_FP.equals(recurrence.YEARLY), _FP.always(getDaysInYear(start) * DAYLY)],
  [_FP.T, _FP.always(0)]
]);

const flatStream = _FP.curry((streamType, stream) => eventStream instanceof streamType ? stream._stream : stream);

module.exports = {
  aperture,
  groupWith,

  compareEvtType,
  predEvtTypeList,
  filterEvtsByEvtTypes,
  deriveEvt,
  isWindow,
  evtTypeListLengthOne,
  AccHelper,
  getPropOrderPolicy,
  getRecurrenceMilliseconds,
  flatStream
};