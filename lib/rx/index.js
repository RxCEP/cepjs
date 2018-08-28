const {rxTumblingCountWindow, rxSlidingCountWindow,
    rxHoppingCountWindow, rxTumblingTemporalWindow, rxHoppingTemporalWindow} = require('./windows.js');
const {rxAllPattern, rxAnyPattern, rxAbscencePattern} = require('./logicalpatterns.js');
const {rxMinDistancePattern, rxMaxDistancePattern, rxAvgDistancePattern,
    rxRelativeMinDistancePattern, rxRelativeMaxDistancePattern,
    rxRelativeAvgDistancePattern} = require('./spatialpatterns.js');
const {rxProject} = require('./transformation.js');

const {Point, Hemisphere} = require('./location.js');

module.exports = {
    Point: Point,
    Hemisphere: Hemisphere,

    rxTumblingCountWindow: rxTumblingCountWindow,
    rxSlidingCountWindow: rxSlidingCountWindow,
    rxHoppingCountWindow: rxHoppingCountWindow,
    rxTumblingTemporalWindow: rxTumblingTemporalWindow,
    rxHoppingTemporalWindow: rxHoppingTemporalWindow,

    rxAllPattern: rxAllPattern,
    rxAnyPattern: rxAnyPattern, 
    rxAbscencePattern: rxAbscencePattern,

    rxMinDistancePattern: rxMinDistancePattern,
    rxMaxDistancePattern: rxMaxDistancePattern,
    rxAvgDistancePattern: rxAvgDistancePattern,
    rxRelativeMinDistancePattern: rxRelativeMinDistancePattern,
    rxRelativeMaxDistancePattern: rxRelativeMaxDistancePattern,
    rxRelativeAvgDistancePattern: rxRelativeAvgDistancePattern,
    
    rxProject: rxProject
}