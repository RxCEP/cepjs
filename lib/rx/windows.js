const {filter, bufferCount, bufferTime} = require('rxjs/operators');


const rxTumblingCountWindow = n => bufferCount(n);

const rxSlidingCountWindow = (n) => (source) => {
    return source.pipe(bufferCount(n, 1),filter(x => x.length == n));
}

const rxHoppingCountWindow = (n, hopSize) => bufferCount(n, hopSize);

const rxTumblingTemporalWindow = ms => bufferTime(ms);

const rxHoppingTemporalWindow = (ms, hopSize) => bufferTime(ms, hopSize);

module.exports = {
    rxTumblingCountWindow: rxTumblingCountWindow,
    rxSlidingCountWindow: rxSlidingCountWindow,
    rxHoppingCountWindow: rxHoppingCountWindow,
    rxTumblingTemporalWindow: rxTumblingTemporalWindow,
    rxHoppingTemporalWindow: rxHoppingTemporalWindow
};