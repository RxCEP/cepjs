const deriveEvt = require('../../common/transformation');

module.exports = function createContextOperators(cepjsMost) {
  const { map } = cepjsMost.lib.core;

  const operators = {};

  /**
  * 
  * @param {string[]} attributeList
  * @param {string} newEventTypeId
  * @return {Stream} a new event stream instance.
  */
  operators.project = (attributeList, newEventTypeId) =>
    map(deriveEvt(attributeList, newEventTypeId));

  return operators;
}