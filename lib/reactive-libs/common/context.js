/**
* Enum for temporal ordering options.
* @readonly
* @enum {number}
*/
const temporalOrdering = {
  /** Occurrence time ordering */
  OCCURRENCE_TIME: 0,
  /** Detection time ordering */
  DETECTION_TIME: 1
}

/**
 * Enum for types of recurrence.
 * @readonly
 * @enum {string}
 */
const recurrence = {
  /** No recurrence */
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

const getOrderingAccessor = order =>
  order === ordering.OCCURRENCE_TIME ? _.get('occurrenceTime') : _.get('detectionTime');

module.exports = {
  recurrence,
  temporalOrdering,
  getOrderingAccessor
};