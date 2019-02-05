const { Point, hemisphere } = require('./location.js');

const composeLeft = (eventStream, operations) => eventStream.stream.pipe(...operations);

const run = (eventStream, observer) => eventStream.stream.subscribe(observer);

const unsubscribe = (streamSubscription) => streamSubscription.subscription.unsubscribe();

module.exports = {
    Point,
    hemisphere,
    composeLeft,
    run,
    unsubscribe
}