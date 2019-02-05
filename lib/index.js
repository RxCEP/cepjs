const EventType = require('./eventtype');
const { Point, hemisphere } = require('./rlib');
const operators = require('../operators');
const factory = require('./rlib/factory');

var defaultExports = {
    EventType,
    Point,
    hemisphere,   
    ...factory
}
if(typeof window !== 'undefined')
    defaultExports.operators = operators;

module.exports = defaultExports;