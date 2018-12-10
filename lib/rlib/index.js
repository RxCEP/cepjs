const {tumblingCountWindow, slidingCountWindow, hoppingCountWindow, tumblingTemporalWindow,
    hoppingTemporalWindow, fixedIntervalWindow, eventIntervalWindow} = require('./operations/windows.js');
const {project} = require('./operations/transformation.js');
const {all, any, abscence} = require('./operations/patterns/logical.js');
const {minDistance, maxDistance, avgDistance, relativeMinDistance, relativeMaxDistance,
    relativeAvgDistance} = require('./operations/patterns/spatial.js');
const {always, sometimes} = require('./operations/patterns/modal.js');
const {nHighestValues, nLowestValues} = require('./operations/patterns/subset.js');
const {count, valueMax, valueMin, valueAvg} = require('./operations/patterns/threshold.js');
const {increasing, decreasing, stable, nonIncreasing, nonDecreasing, mixed} = require('./operations/patterns/trend.js');

const {Point, hemisphere} = require('./location.js');

const factoryOperators = require('rxjs');
const operators = require('rxjs/operators');

module.exports = {
    factoryOperators,
    operators,

    Point,
    hemisphere,

    tumblingCountWindow,
    slidingCountWindow,
    hoppingCountWindow,
    tumblingTemporalWindow,
    hoppingTemporalWindow,
    fixedIntervalWindow,
    eventIntervalWindow,

    all,
    any,
    abscence,

    always,
    sometimes,

    nHighestValues,
    nLowestValues,

    count,
    valueMax,
    valueMin,
    valueAvg,

    increasing,
    decreasing,
    stable,
    nonIncreasing,
    nonDecreasing,
    mixed,

    minDistance,
    maxDistance,
    avgDistance,
    relativeMinDistance,
    relativeMaxDistance,
    relativeAvgDistance,
    
    project
}