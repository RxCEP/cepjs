const { unsubscribe } = require('./rlib');

/**
 * Class that encapsulates the underlying observable subscription.
 * @mixin
 */
class StreamSubscription{
    /** @hideconstructor */
    constructor(subscription){
        this.subscription = subscription;
    }

    unsubscribe(){
        unsubscribe(this);
    }
}

module.exports = StreamSubscription;