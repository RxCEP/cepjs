const {ordering} = require('./helperTime.js');

/**
 * Enum for order policy
 * @readonly
 * @enum {string}
 */
const orderPolicy = {
    OCCURRENCE_TIME: ordering.OCCURRENCE_TIME,
    DETECTION_TIME: ordering.DETECTION_TIME,
    STREAM_POSITION: 'S'
};

module.exports = {
    orderPolicy: orderPolicy
}