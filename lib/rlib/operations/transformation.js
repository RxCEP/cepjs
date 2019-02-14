const { map } = require('rxjs/operators');
const R = require('ramda');
const EventType = require('../../eventtype');
const { occTimeLens } = require('../helperTime');

const deriveEvt = (list, evtTypeId, evt) => {
    let newEvt = new EventType(evtTypeId, 'project', R.view(occTimeLens, evt), Date.now());
    R.forEach(att => newEvt = R.assoc(att, R.view(R.lensProp(att), evt), newEvt), list);
    return newEvt;
}

/**
 * 
 * @param {string[]} attributeList
 * @param {string} newEventTypeId
 * @return {EventStream} a new event stream instance.
 */
const project = (attributeList, newEventTypeId) => stream =>
    stream.pipe(map(x => deriveEvt(attributeList, newEventTypeId, x)));

module.exports = {
    project
};