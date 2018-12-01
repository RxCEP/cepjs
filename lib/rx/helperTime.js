const R = require('ramda');
const addDays = require('date-fns/add_days');
const addWeeks = require('date-fns/add_weeks');
const addMonths = require('date-fns/add_months');
const addYears = require('date-fns/add_years');

const orderPolicy = require('./policies.js');


//lenses for occurrence and detection time
const occTimeLens = R.lensProp('occurrenceTime');
const detcTimeLens = R.lensProp('detectionTime');

const occProp = R.prop('occurrenceTime');
const detcProp = R.prop('detectionTime');

/**
 * Enum for types of recurrence
 * @readonly
 * @enum {string}
 */
const recurrence = {
    NONE: 'N',
    /** Dayly recurrence */ 
    DAYLY: 'D',
    /** Weekly recurrence */ 
    WEEKLY: 'W',
    /** Monthly recurrence */ 
    MONTHLY: 'M',
    /** Yearly recurrence */ 
    YEARLY: 'Y'
}

/**
 * Enum for ordering options
 * @readonly
 * @enum {string}
 */
const ordering = {
    OCCURRENCE_TIME: 'O',
    DETECTION_TIME: 'D'
}

const getMillisecondsDifference = (start, recurr) => R.cond([
    [R.equals(recurrence.DAYLY), R.always(differenceInMilliseconds(addDays(start, 1), start))],
    [R.equals(recurrence.WEEKLY), R.always(differenceInMilliseconds(addWeeks(start, 1), start))],
    [R.equals(recurrence.MONTHLY), R.always(differenceInMilliseconds(addMonths(start, 1), start))],
    [R.equals(recurrence.YEARLY), R.always(differenceInMilliseconds(addYears(start, 1), start))],
    [R.T, R.always(0)]
])(recurr);


const getPropOrderPolicy = (orderP) => R.cond([
    [R.equals(orderPolicy.OCCURRENCE_TIME), R.always(occProp)],
    [R.equals(orderPolicy.DETECTION_TIME), R.always(detcProp)],
    [R.equals(orderPolicy.STREAM_POSITION), R.always(null)]
])(orderP);

module.exports = {
    occTimeLens: occTimeLens,
    detcTimeLens: detcTimeLens,
    recurrence: recurrence,
    ordering: ordering,
    getMillisecondsDifference: getMillisecondsDifference,
    getPropOrderPolicy: getPropOrderPolicy
};