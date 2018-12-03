const {rxTumblingCountWindow, rxSlidingCountWindow,
    rxHoppingCountWindow, rxTumblingTemporalWindow, rxHoppingTemporalWindow,
    rxFixedIntervalWindow} = require('./windows.js');
const {rxAll, rxAny, rxAbscence} = require('./logicalpatterns.js');
const {rxMinDistance, rxMaxDistance, rxAvgDistance,
    rxRelativeMinDistance, rxRelativeMaxDistance,
    rxRelativeAvgDistance} = require('./spatialpatterns.js');
const {rxProject} = require('./transformation.js');
const {rxAlways, rxSometimes} = require('./modalpatterns.js');
const {rxNhighestValues, rxNlowestValues} = require('./subset.js');
const {rxCount, rxValueMax, rxValueMin, rxValueAvg} = require('./threshold.js');
const {rxIncreasing, rxDecreasing, rxStable, rxNonIncreasing, rxNonDecreasing, rxMixed} = require('./trendpatterns.js');

const {Point, hemisphere} = require('./location.js');

module.exports = {
    Point: Point,
    hemisphere: hemisphere,

    rxTumblingCountWindow: rxTumblingCountWindow,
    rxSlidingCountWindow: rxSlidingCountWindow,
    rxHoppingCountWindow: rxHoppingCountWindow,
    rxTumblingTemporalWindow: rxTumblingTemporalWindow,
    rxHoppingTemporalWindow: rxHoppingTemporalWindow,
    rxFixedIntervalWindow: rxFixedIntervalWindow,

    rxAll: rxAll,
    rxAny: rxAny, 
    rxAbscence: rxAbscence,

    rxAlways: rxAlways,
    rxSometimes: rxSometimes,

    rxNhighestValues: rxNhighestValues,
    rxNlowestValues: rxNlowestValues,

    rxCount: rxCount,
    rxValueMax: rxValueMax,
    rxValueMin: rxValueMin,
    rxValueAvg: rxValueAvg,

    rxIncreasing: rxIncreasing,
    rxDecreasing: rxDecreasing,
    rxStable: rxStable,
    rxNonIncreasing: rxNonIncreasing,
    rxNonDecreasing: rxNonDecreasing,
    rxMixed: rxMixed,

    rxMinDistance: rxMinDistance,
    rxMaxDistance: rxMaxDistance,
    rxAvgDistance: rxAvgDistance,
    rxRelativeMinDistance: rxRelativeMinDistance,
    rxRelativeMaxDistance: rxRelativeMaxDistance,
    rxRelativeAvgDistance: rxRelativeAvgDistance,
    
    rxProject: rxProject
}