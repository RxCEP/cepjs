const {map} = require('rxjs/operators');
const R = require('ramda');
const EventType = require('../../eventtype.js');
const {occTimeLens} = require('../helperTime.js');

const deriveEvt = (list, evtTypeId, evt) =>{
    let newEvt = new EventType(evtTypeId, 'project', R.view(occTimeLens, evt), new Date());
    R.forEach(att => newEvt = R.assoc(att, R.view(R.lensProp(att), evt), newEvt), list);
    return newEvt;
}

const project = (attributeList, newEventTypeId) => (source) =>{
    return source.pipe(map(x => deriveEvt(attributeList, newEventTypeId, x)));
}

module.exports = {
    project
};