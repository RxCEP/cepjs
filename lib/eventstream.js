const { composeLeft, run } = require('./rlib');
const StreamSubscription = require('./streamsubscription');

/** Class representing an event stream.
 * It provides CEP functionalities by encapsulating and manipulating a given reactive stream.
 * All methods return a new stream instance.
 * @mixin
*/
class EventStream {

    /** @hideconstructor */
    constructor(stream){
        this.stream = stream;
    }

    /**
     * Compose a set of operations from left-to-right to be executed as soon as the stream is subscribed.
     * @param {Function[]} operations - a set of future operations.
     * @return {EventStream} a new event stream instance.
     */
    pipe(...operations){
        return new EventStream(composeLeft(this, operations));
    }

    /**
     * Subscribes to an event stream.
     * @param {Object} observer - an observer object that closely follows the observer proposed 
     * in {@link https://github.com/tc39/proposal-observable|observable proposal}.
     * The observer must have at least a next method to receive/deal with the stream values.
     * @return {StreamSubscription} a StreamSubscription instance that allows further unsubscription.
     */
    subscribe(observer){
        return new StreamSubscription(run(this, observer));
    }
}

module.exports = EventStream;
