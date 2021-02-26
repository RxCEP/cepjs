const _ = require('lodash');
const _FP = require('lodash/fp');
const eachCons = require('each-cons');
const getDaysInMonth = require('date-fns/getDaysInMonth');
const getDaysInYear = require('date-fns/getDaysInYear');

const EventType = require('../eventtype');
const { order } = require('../policies');
const { recurrence } = require('./common/context');

// groups elements according to n
// it has the same effect as Ramda's aperture https://ramdajs.com/docs/#aperture
const aperture = n => array => eachCons(array, n);

// compose is equivalent to lodash flowRight
const groupWith = path => _FP.compose(_FP.values, _FP.groupBy(_FP.get(path)));

// used to help comparing events according to their eventTypeId
const compareEvtType = _FP.curry((eventType, event) =>
  eventType === _FP.get('eventTypeId', event));

const condition = evt => [compareEvtType(evt), _FP.T];

// returns a list of predicates according to the given eventTypeList
const predEvtTypeList = _FP.map(condition);

// applies the list of predicates constructed by predEvtTypeList
const filterEvtsByEvtTypes = _FP.compose(_FP.filter, _FP.cond);

// used to help creating a new (derived) event
// inserts a matchingSet property in the object to store the events/matching set
const deriveEvt = _FP.curry((eventSource, newEvtTypeId, elms) => {
  return _.set(
    new EventType(newEvtTypeId, eventSource, Date.now()),
    'matchingSet',
    elms);
});

// checks if it's an window(array)
const isWindow = val => {
  if (_.isArray(val)) {
    return true;
  }
  throw new Error('Pattern operations must be preceded by a window operator');
};

// checks if the length of the event type list is greater than 1
const evtTypeListLengthOne = evtTypeList => {
  if (evtTypeList.length > 1) {
    return true;
  }
  throw new Error(`One of the used operations requires an event
  type list with a length greater than one!`);
}

/* used as a helper object to store both the result of some
 operation applied to an event set and the event set */
// it's currently used by spatial, threshold, and trend patterns
const AccHelper = function (result, set) {
  this.result = result;
  this.set = set;
};

const getPropOrderPolicy = _FP.cond([
  [_FP.equals(order.OCCURRENCE_TIME), _FP.always(_FP.get('occurrenceTime'))],
  [_FP.equals(order.DETECTION_TIME), _FP.always(_FP.get('detectionTime'))]
]); //default stream position == undefined

//milliseconds in a day
const DAYLY = 1000 * 60 * 60 * 24;
//milliseconds in a week
const WEEKLY = DAYLY * 7;

const getRecurrenceMilliseconds = start => _FP.cond([
  [_FP.equals(recurrence.DAYLY), _FP.always(DAYLY)],
  [_FP.equals(recurrence.WEEKLY), _FP.always(WEEKLY)],
  [_FP.equals(recurrence.MONTHLY), _FP.always(getDaysInMonth(start) * DAYLY)],
  [_FP.equals(recurrence.YEARLY), _FP.always(getDaysInYear(start) * DAYLY)],
  [_FP.T, _FP.always(0)]
]);

// flats the stream to bring up the inner stream
const flatStream = _FP.curry((streamType, stream) => stream instanceof streamType ? stream._stream : stream);

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