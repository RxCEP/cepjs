const {rxTumblingCountWindow, rxSlidingCountWindow,
    rxHoppingCountWindow, rxTumblingTemporalWindow, rxHoppingTemporalWindow} = require('./windows.js');
const {rxAll, rxAny, rxAbscence} = require('./logicalpatterns.js');
const {rxMinDistance, rxMaxDistance, rxAvgDistance,
    rxRelativeMinDistance, rxRelativeMaxDistance,
    rxRelativeAvgDistance} = require('./spatialpatterns.js');
const {rxProject} = require('./transformation.js');
const {rxAlways, rxSometimes} = require('./modalpatterns.js');
const {rxNhighestValues, rxNlowestValues} = require('./subset.js');

const {Point, Hemisphere} = require('./location.js');

module.exports = {
    Point: Point,
    Hemisphere: Hemisphere,

    rxTumblingCountWindow: rxTumblingCountWindow,
    rxSlidingCountWindow: rxSlidingCountWindow,
    rxHoppingCountWindow: rxHoppingCountWindow,
    rxTumblingTemporalWindow: rxTumblingTemporalWindow,
    rxHoppingTemporalWindow: rxHoppingTemporalWindow,

    rxAll: rxAll,
    rxAny: rxAny, 
    rxAbscence: rxAbscence,

    rxAlways: rxAlways,
    rxSometimes: rxSometimes,

    rxNhighestValues: rxNhighestValues,
    rxNlowestValues: rxNlowestValues,

    rxMinDistance: rxMinDistance,
    rxMaxDistance: rxMaxDistance,
    rxAvgDistance: rxAvgDistance,
    rxRelativeMinDistance: rxRelativeMinDistance,
    rxRelativeMaxDistance: rxRelativeMaxDistance,
    rxRelativeAvgDistance: rxRelativeAvgDistance,
    
    rxProject: rxProject
}