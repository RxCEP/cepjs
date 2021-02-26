const StreamSubscription = require('../../streamsubscription');

class MostStreamSubscription extends StreamSubscription {

  constructor(subscription) {
    super(subscription);
  }

  /**
  * Closes (or unsubscribe) the stream
  */
  unsubscribe() {
    if (!this._closed) {
      this._subscription.dispose();
      this._closed = true;
    }
  }
}

module.exports = MostStreamSubscription;