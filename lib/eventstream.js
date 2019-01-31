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
     * 
     * @param  {Function[]} args 
     * @return {EventStream} a new event stream instance.
     */
    pipe(...operations){
        return new EventStream(composeLeft(this, operations));
    }

    /**
     * Subscribes to an event stream.
     * @param {Object} observer - an {@link http://reactivex.io/rxjs/class/es6/MiscJSDoc.js~ObserverDoc.html|Observer} object containing at least a next method.
     * @return {StreamSubscription} a StreamSubscription instance that allows further unsubscription.
     */
    subscribe(observer){
        return new StreamSubscription(run(this, observer));
    }
}

module.exports = EventStream;
