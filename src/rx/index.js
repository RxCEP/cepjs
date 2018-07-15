const {rxTumblingCountWindow, rxSlidingCountWindow,
    rxHoppingCountWindow, rxTumblingTemporalWindow, rxHoppingTemporalWindow} = require('./windows.js');
const {rxAllPattern, rxAnyPattern, rxAbscencePattern} = require('./logicalpatterns.js');
const {rxMinDistancePattern, rxMaxDistancePattern, rxAvgDistancePattern,
    rxRelativeMinDistancePattern, rxRelativeMaxDistancePattern,
    rxRelativeAvgDistancePattern} = require('./spatialpatterns.js');

const {Point, SphereRadius} = require('./location.js');

module.exports = {
    rxTumblingCountWindow: rxTumblingCountWindow,
    rxSlidingCountWindow: rxSlidingCountWindow,
    rxHoppingCountWindow: rxHoppingCountWindow,
    rxTumblingTemporalWindow: rxTumblingTemporalWindow,
    rxHoppingTemporalWindow: rxHoppingTemporalWindow,
    Point: Point,
    SphereRadius: SphereRadius,
    rxAllPattern: rxAllPattern,
    rxAnyPattern: rxAnyPattern, 
    rxAbscencePattern: rxAbscencePattern,
    rxMinDistancePattern: rxMinDistancePattern,
    rxMaxDistancePattern: rxMaxDistancePattern,
    rxAvgDistancePattern: rxAvgDistancePattern,
    rxRelativeMinDistancePattern: rxRelativeMinDistancePattern,
    rxRelativeMaxDistancePattern: rxRelativeMaxDistancePattern,
    rxRelativeAvgDistancePattern: rxRelativeAvgDistancePattern
}