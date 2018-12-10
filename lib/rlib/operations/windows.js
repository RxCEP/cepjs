const {timer, race} = require('rxjs');
const {filter, bufferCount, bufferTime, bufferToggle, share} = require('rxjs/operators');
const R = require('ramda');
const {getMillisecondsDifference, ordering} = require('../helperTime.js');
const {occProp, detcProp, predEvtTypeList} = require('../helperFuntions.js');

const isToday = require('date-fns/is_today');
const isAfter = require('date-fns/is_after');
const differenceInMilliseconds = require('date-fns/difference_in_milliseconds');


const rxTumblingCountWindow = n => bufferCount(n);

const rxSlidingCountWindow = (n) => (source) => {
    return source.pipe(bufferCount(n, 1),filter(x => x.length == n));
}

const rxHoppingCountWindow = (n, hopSize) => bufferCount(n, hopSize);

const rxTumblingTemporalWindow = ms => bufferTime(ms);

const rxHoppingTemporalWindow = (ms, hopSize) => bufferTime(ms, hopSize);

const rxFixedIntervalWindow = (start, end,  recurrence, order) => (source) => {
    const diffStart = getMillisecondsDifference(start, recurrence);
    
    const diffEnd = R.is(Number, end) ? end : differenceInMilliseconds(end, start);

    const orderingProp = order === ordering.OCCURRENCE_TIME ? occProp : detcProp;

    return source.pipe(bufferToggle(timer(start, diffStart), () => timer(diffEnd)),
                filter(R.filter(R.either(R.compose(isToday, orderingProp),
                                    R.compose(isAfter(start), orderingProp)))));
}

const rxEventIntervalWindow = (initiatorEvents, terminatorEvents, expirationTime) => (source) => {
    const predsInit = predEvtTypeList(initiatorEvents);
    const predsTerm = predEvtTypeList(terminatorEvents);

    const source0 = source.pipe(share());

    const source1 = source0.pipe(filter(R.cond(predsInit)));
    const source2 = source0.pipe(filter(R.cond(predsTerm)));

    return expirationTime
        ? source0.pipe(bufferToggle(source1, () => race(source2, timer(expirationTime))))
        : source0.pipe(bufferToggle(source1, () => source2));

}

module.exports = {
    rxTumblingCountWindow: rxTumblingCountWindow,
    rxSlidingCountWindow: rxSlidingCountWindow,
    rxHoppingCountWindow: rxHoppingCountWindow,
    rxTumblingTemporalWindow: rxTumblingTemporalWindow,
    rxHoppingTemporalWindow: rxHoppingTemporalWindow,
    rxFixedIntervalWindow: rxFixedIntervalWindow,
    rxEventIntervalWindow: rxEventIntervalWindow
};