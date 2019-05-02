const _ = require('lodash/fp');
const EventType = require('../../eventtype');

const deriveEvt = (list, evtTypeId) => evt => {
  let newEvt = new EventType(evtTypeId, 'project', _.get('occurrenceTime', evt), Date.now());
  return list.reduce((acc, curr) => _.set(curr, _.get(curr, evt), acc), newEvt);
}

module.exports = deriveEvt;