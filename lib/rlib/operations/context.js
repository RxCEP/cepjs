const {timer, race} = require('rxjs');
const {filter, bufferCount, bufferTime, bufferToggle, share, map} = require('rxjs/operators');
const R = require('ramda');
const {getMillisecondsDifference, ordering} = require('../helperTime.js');
const {occProp, detcProp, predEvtTypeList, getProp} = require('../helperFuntions.js');

const isToday = require('date-fns/is_today');
const isAfter = require('date-fns/is_after');
const differenceInMilliseconds = require('date-fns/difference_in_milliseconds');

//windows
const tumblingCountWindow = n => bufferCount(n);

const slidingCountWindow = (n) => (source) => {
    return source.pipe(bufferCount(n, 1),filter(x => x.length == n));
}

const hoppingCountWindow = (n, hopSize) => bufferCount(n, hopSize);

const tumblingTemporalWindow = ms => bufferTime(ms);

const hoppingTemporalWindow = (ms, hopSize) => bufferTime(ms, hopSize);

const fixedIntervalWindow = (start, end,  recurrence, order) => (source) => {
    const diffStart = getMillisecondsDifference(start, recurrence);
    
    const diffEnd = R.is(Number, end) ? end : differenceInMilliseconds(end, start);

    const orderingProp = order === ordering.OCCURRENCE_TIME ? occProp : detcProp;

    return source.pipe(bufferToggle(timer(start, diffStart), () => timer(diffEnd)),
                filter(R.filter(R.either(R.compose(isToday, orderingProp),
                                    R.compose(isAfter(start), orderingProp)))));
}

const eventIntervalWindow = (initiatorEvents, terminatorEvents, expirationTime) => (source) => {
    const predsInit = predEvtTypeList(initiatorEvents);
    const predsTerm = predEvtTypeList(terminatorEvents);

    const source0 = source.pipe(share());

    const source1 = source0.pipe(filter(R.cond(predsInit)));
    const source2 = source0.pipe(filter(R.cond(predsTerm)));

    return expirationTime
        ? source0.pipe(bufferToggle(source1, () => race(source2, timer(expirationTime))))
        : source0.pipe(bufferToggle(source1, () => source2));
}


const groupBy = (attribute) => (source) => 
            source.pipe(map(R.groupWith(getProp(attribute))));


module.exports = {
    tumblingCountWindow,
    slidingCountWindow,
    hoppingCountWindow,
    tumblingTemporalWindow,
    hoppingTemporalWindow,
    fixedIntervalWindow,
    eventIntervalWindow,
    groupBy
};