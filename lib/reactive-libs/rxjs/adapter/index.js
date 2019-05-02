const createLogicalOperators = require('./patterns/logical');
const createModalOperators = require('./patterns/modal');
const createSpatialOperators = require('./patterns/spatial');
const createSubsetOperators = require('./patterns/subset');
const createThresholdOperators = require('./patterns/threshold');
const createTrendOperators = require('./patterns/trend');

const createContextOperators = require('./context');
const createFactoryOperators = require('./factory');
const createGeneralOperators = require('./general');
const createTransformationOperators = require('./transformation');

module.exports = function createRxAdapter(cepjsRx){
    return {
        ...createLogicalOperators(cepjsRx),
        ...createModalOperators(cepjsRx),
        ...createSpatialOperators(cepjsRx),
        ...createSubsetOperators(cepjsRx),
        ...createThresholdOperators(cepjsRx),
        ...createTrendOperators(cepjsRx),
        ...createContextOperators(cepjsRx),
        ...createFactoryOperators(cepjsRx),
        ...createGeneralOperators(cepjsRx),
        ...createTransformationOperators(cepjsRx)
    };
}