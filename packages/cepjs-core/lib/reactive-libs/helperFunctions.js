const _ = require('lodash/fp');
const eachCons = require('each-cons');
const EventType = require('../eventtype');
const { order } = require('../policies/pattern-policies');
const { recurrence } = require('./common/context');

const aperture = n => array => eachCons(array, n);

const groupWith = path => _.compose(_.values, _.groupBy(_.get(path)));

const compareEvtType = _.curry((eventType, event) =>
  eventType === _.get('eventTypeId', event));

const condition = evt => [compareEvtType(evt), _.T];

// returns a list of predicates according to the given eventTypeList
const predEvtTypeList = _.map(condition);

// applies the list of predicates constructed by predEvtTypeList
const filterEvtsByEvtTypes = _.compose(_.filter, _.cond);


const deriveEvt = _.curry((eventSource, newEvtTypeId, elms) => {
  const currDate = Date.now();
  let newEvt = new EventType(newEvtTypeId, eventSource, currDate, currDate);
  return _.assoc('matchingSet', elms, newEvt);
});

const isWindow = val => { // checks if it's an window(array)
  if (_.isArray(val)) {
    return true;
  }
  throw new Error('This operation must be preceded by a window operator');
};

const evtTypeListLengthOne = evtTypeList => { // checks if the length of the event type list is greater than 1
  if (evtTypeList.length > 1) {
    return true;
  }
  throw new Error('The event type list must have more than one element')
}

const AccHelper = function (result, set) {
  this.result = result;
  this.set = set;
};

const getPropOrderPolicy = _.cond([
  [_.equals(order.OCCURRENCE_TIME), _.always(_.get('occurrenceTime'))],
  [_.equals(order.DETECTION_TIME), _.always(_.get('detectionTime'))]
]);//default stream position == undefined

const DAYLY = 1000 * 60 * 60 * 24;
const WEEKLY = DAYLY * 7;

const getRecurrenceMilliseconds = start => _.cond([
  [_.equals(recurrence.DAYLY), _.always(DAYLY)],
  [_.equals(recurrence.WEEKLY), _.always(WEEKLY)],
  [_.equals(recurrence.MONTHLY), _.always(getDaysInMonth(start) * DAYLY)],
  [_.equals(recurrence.YEARLY), _.always(getDaysInYear(start) * DAYLY)],
  [_.T, _.always(0)]
]);

const flatStream = _.curry((streamType, stream) => eventStream instanceof streamType ? stream._stream : stream);

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