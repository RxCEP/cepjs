const {rxTumblingCountWindow, rxSlidingCountWindow,
    rxHoppingCountWindow, rxTumblingTemporalWindow, rxHoppingTemporalWindow,
    rxFixedIntervalWindow, rxEventIntervalWindow} = require('./operations/windows.js');
const {rxProject} = require('./operations/transformation.js');
const {rxAll, rxAny, rxAbscence} = require('./operations/patterns/logical.js');
const {rxMinDistance, rxMaxDistance, rxAvgDistance,
    rxRelativeMinDistance, rxRelativeMaxDistance,
    rxRelativeAvgDistance} = require('./operations/patterns/spatial.js');
const {rxAlways, rxSometimes} = require('./operations/patterns/modal.js');
const {rxNhighestValues, rxNlowestValues} = require('./operations/patterns/subset.js');
const {rxCount, rxValueMax, rxValueMin, rxValueAvg} = require('./operations/patterns/threshold.js');
const {rxIncreasing, rxDecreasing, rxStable, rxNonIncreasing,
    rxNonDecreasing, rxMixed} = require('./operations/patterns/trend.js');

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
    rxEventIntervalWindow: rxEventIntervalWindow,

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