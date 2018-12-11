const EventType = require('./eventtype.js');
const {Point, hemisphere} = require('./rlib');
const operators = require('./operators');
const {of, from, fromEvent, timer, interval} = require('./factory.js');

module.exports = {
    EventType,
    Point,
    hemisphere,
    operators,
    of,
    from,
    fromEvent,
    timer,
    interval
}