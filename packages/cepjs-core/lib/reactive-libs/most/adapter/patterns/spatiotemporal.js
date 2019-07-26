const _ = require('lodash/fp');
const { predEvtTypeList, deriveEvt, isWindow,
  filterEvtsByEvtTypes, getPropOrderPolicy } = require("../../../helperFunctions");
const { curriedDistanceFn } = require("../../../common/spatial");

module.exports = function createSpatioTemporalOperators(cepjsMost) {
  const { filter, map } = cepjsMost.lib.core;

  const movingToward = (eventTypeList, givenPoint, attribute,
    newEvtTypeId, policies = {}) => stream => {
      const preds = predEvtTypeList(eventTypeList);
      const calcDistance = curriedDistanceFn(givenPoint, attribute);
      const derivation = deriveEvt('moving toward', newEvtTypeId);
      const orderProp = getPropOrderPolicy(policies.order);

      return map(derivation,
        filter(buffer => calcDistance(_.last(buffer)) < calcDistance(_.head(buffer)),
          map(buffer => !orderProp ? buffer : _.sortBy([orderProp], buffer),
            filter(buffer => buffer.length > 0,
              map(filterEvtsByEvtTypes(preds),
                filter(isWindow,
                  stream))))));
    }

  return {
    movingToward
  };
}