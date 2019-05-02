const deriveEvt = require('../../common/transformation');

module.exports = function createContextOperators(cepjsRx) {
  const { map } = cepjsRx.lib.operators;

  const operators = {};

  /**
  * 
  * @param {string[]} attributeList
  * @param {string} newEventTypeId
  * @return {Observable} a new event stream instance.
  */
  operators.project = (attributeList, newEventTypeId) => stream =>
    stream.pipe(map(deriveEvt(attributeList, newEventTypeId)));

  return operators;
}