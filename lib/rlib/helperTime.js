const R = require('ramda');
const getDaysInMonth = require('date-fns/get_days_in_month');
const getDaysInYear = require('date-fns/get_days_in_year');

const orderPolicy = require('./policies');
const recurrence = require('./recurrence');
const ordering = require('./ordering');


//lenses for occurrence and detection time
const occTimeLens = R.lensProp('occurrenceTime');
const detcTimeLens = R.lensProp('detectionTime');

const occProp = R.prop('occurrenceTime');
const detcProp = R.prop('detectionTime');

const DAYLY = 1000 * 60 * 60 * 24;
const WEEKLY = DAYLY * 7;

const getRecurrenceMilliseconds = (start, recurr) => R.cond([
    [R.equals(recurrence.DAYLY), R.always(DAYLY)],
    [R.equals(recurrence.WEEKLY), R.always(WEEKLY)],
    [R.equals(recurrence.MONTHLY), R.always(getDaysInMonth(start) * DAYLY)],
    [R.equals(recurrence.YEARLY), R.always(getDaysInYear(start) * DAYLY)],
    [R.T, R.always(0)]
])(recurr);


const getPropOrderPolicy = (orderP) => R.cond([
    [R.equals(orderPolicy.OCCURRENCE_TIME), R.always(occProp)],
    [R.equals(orderPolicy.DETECTION_TIME), R.always(detcProp)],
    [R.equals(orderPolicy.STREAM_POSITION), R.always(null)]
])(orderP);

module.exports = {
    occTimeLens,
    detcTimeLens,
    occProp,
    detcProp,
    recurrence,
    ordering,
    getRecurrenceMilliseconds,
    getPropOrderPolicy
};