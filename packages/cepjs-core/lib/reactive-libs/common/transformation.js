const _ = require('lodash');
const EventType = require('../../eventtype');

const deriveEvt = (list, evtTypeId) => evt =>
  list.reduce(
    (acc, curr) => _.set(acc, curr, _.get(evt, curr)),
    _.set(new EventType(evtTypeId, 'project', _.get(evt, 'occurrenceTime')), '_detectionTime', Date.now())
  );

module.exports = deriveEvt;