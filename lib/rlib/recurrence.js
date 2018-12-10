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

module.exports = recurrence;