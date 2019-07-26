const _ = require('lodash/fp');
const { predEvtTypeList, deriveEvt, isWindow,
  filterEvtsByEvtTypes, getPropOrderPolicy } = require("../../../helperFunctions");
const { curriedDistanceFn } = require("../../../common/spatial");

module.exports = function createSpatioTemporalOperators(cepjsRx) {
  const { filter, map } = cepjsRx.lib.operators;

  const movingToward = (eventTypeList, givenPoint, attribute,
    newEvtTypeId, policies = {}) => stream => {
      const preds = predEvtTypeList(eventTypeList);
      const calcDistance = curriedDistanceFn(givenPoint, attribute);
      const derivation = deriveEvt('moving toward', newEvtTypeId);
      const orderProp = getPropOrderPolicy(policies.order);

      return stream.pipe(filter(isWindow), //checks if it's a window
        map(filterEvtsByEvtTypes(preds)), //filters events according to a list of predicates
        filter(buffer => buffer.length > 0),
        map(buffer => !orderProp ? buffer : _.sortBy([orderProp], buffer)), //order events according to order policy
        filter(buffer => calcDistance(_.last(buffer)) < calcDistance(_.head(buffer))),
        map(derivation)
      );
    }

  return {
    movingToward
  };
}