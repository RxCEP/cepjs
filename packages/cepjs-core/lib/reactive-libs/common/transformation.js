const _ = require('lodash');
const EventType = require('../../eventtype');

const deriveEvt = (list, evtTypeId) => evt => {
  return list.reduce(
    (acc, curr) => _.set(acc, curr, _.get(evt, curr)),
    new EventType(evtTypeId, 'project', _.get(evt, 'occurrenceTime'), Date.now())
  );
}

module.exports = deriveEvt;