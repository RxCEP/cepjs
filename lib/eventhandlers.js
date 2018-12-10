const {map} = require('rxjs/operators');
const R = require('ramda');

/** Class representing an event stream.
 * It provides CEP functionalities by encapsulating and manipulating a given Rx Observable.
 * All methods return a new stream instance.
 * @mixin
*/
class EventStream {

    /** @hideconstructor */
    constructor(observable){
        this._observable = observable;
    }

    /**
     * 
     * @param  {Function[]} args 
     * @return {EventStream} a new event stream instance.
     */
    pipe(...args){
        let i = 0, currentStream = this;
        while(i < args.length){
            currentStream = args[i](currentStream);
            i++;
        }
        return currentStream;
    }

    /**
     * Subscribes to an event stream.
     * @param {Object} observer - an {@link http://reactivex.io/rxjs/class/es6/MiscJSDoc.js~ObserverDoc.html|Observer} object containing at least a next method.
     * @return {StreamSubscription} a StreamSubscription instance that allows further unsubscription.
     */
    subscribe(observer){
        return new StreamSubscription(this._observable.subscribe(observer));
    }
}
/**
 * Class that encapsulates the underlying observable subscription.
 * @mixin
 */
class StreamSubscription{
    /** @hideconstructor */
    constructor(subscription){
        this._subscription = subscription;
    }

    unsubscribe(){
        this._subscription.unsubscribe();
    }
}

module.exports = {
    EventStream
};