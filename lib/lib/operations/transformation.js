const {map} = require('rxjs/operators');
const R = require('ramda');
const {EventType} = require('../../eventtype.js');
const {occTimeLens, detcTimeLens} = require('../helperFuntions.js');

const deriveEvt = (list, evtTypeId, evt) =>{
    let newEvt = new EventType(evtTypeId, R.view(occTimeLens, evt), 'project');
    newEvt = R.set(detcTimeLens, new Date(), newEvt);
    R.forEach(att => newEvt = R.assoc(att, R.view(R.lensProp(att), evt), newEvt), list);
    return newEvt;
}

const rxProject = (attributeList, newEventTypeId) => (source) =>{
    return source.pipe(map(x => deriveEvt(attributeList, newEventTypeId, x)));
}

module.exports = {
    rxProject: rxProject
};