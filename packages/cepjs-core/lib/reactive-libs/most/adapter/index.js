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

module.exports = function createMostAdapter(cepjsMost){
    return {
        ...createLogicalOperators(cepjsMost),
        ...createModalOperators(cepjsMost),
        ...createSpatialOperators(cepjsMost),
        ...createSubsetOperators(cepjsMost),
        ...createThresholdOperators(cepjsMost),
        ...createTrendOperators(cepjsMost),
        ...createContextOperators(cepjsMost),
        ...createFactoryOperators(cepjsMost),
        ...createGeneralOperators(cepjsMost),
        ...createTransformationOperators(cepjsMost)
    };
}