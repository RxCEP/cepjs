const {ordering} = require('./helperTime.js');

/**
 * Enum for order policy.
 * @readonly
 * @enum {string}
 */
const orderPolicy = {
    /** Occurrence time policy */
    OCCURRENCE_TIME: ordering.OCCURRENCE_TIME,
    /** Detection time policy */
    DETECTION_TIME: ordering.DETECTION_TIME,
    /** Stream position policy */
    STREAM_POSITION: 'S'
};

module.exports = {
    orderPolicy: orderPolicy
}