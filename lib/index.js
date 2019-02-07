const EventType = require('./eventtype');
const { Point, hemisphere } = require('./rlib');
const operators = require('../operators');
const factory = require('./rlib/factory');
const ordering = require('./rlib/ordering');
const recurrence = require('./rlib/recurrence');

var defaultExports = {
    EventType,
    Point,
    hemisphere,
    ordering,
    recurrence,
    ...factory
}
if(typeof window !== 'undefined')
    defaultExports.operators = operators;

module.exports = defaultExports;