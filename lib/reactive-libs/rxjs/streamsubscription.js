const StreamSubscription = require('../../streamsubscription');

class RxStreamSubscription extends StreamSubscription {

  constructor(subscription) {
    super(subscription);
  }

  unsubscribe() {
    if (!this._closed) {
      this._subscription.unsubscribe();
      this._closed = true;
    }
  }
}

module.exports = RxStreamSubscription;