const { unsubscribe } = require('./rlib');

/**
 * Class that encapsulates the underlying observable subscription.
 * It closely follows the subscription of the {@link https://github.com/tc39/proposal-observable|observable proposal}.
 * @mixin
 */
class StreamSubscription{
    /** @hideconstructor */
    constructor(subscription){
        this.subscription = subscription;
        this.closed = false;
    }

    unsubscribe(){
        unsubscribe(this);
        this.closed = true;
    }
}

module.exports = StreamSubscription;