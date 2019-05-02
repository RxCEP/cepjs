class StreamSubscription {

  constructor(subscription) {
    this._subscription = subscription;
    this._closed = false;
  }

  get closed() {
    return this._closed;
  }

}

module.exports = StreamSubscription;