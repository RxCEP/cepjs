const StreamSubscription = require('./streamsubscription');

class EventStream {

  constructor(stream) {
    this._stream = stream;
  }

  static eventStream(stream) {
    return new EventStream(stream);
  }

  /**
   * Composes a set of operations from left-to-right to be executed as soon as the stream is subscribed
   */
  pipe(...operations) {
    return new EventStream(this._stream.pipe(...operations));
  }

  /**
   * Composes a set of operations from right-to-left to be executed as soon as the stream is subscribed
   */
  compose(...operations) {
    this.pipe(...operations.reverse());
  }

  /**
   * Subscribes to an event stream
   */
  subscribe(...observer) {
    if (observer.length > 0) {
      if (typeof observer[0] === 'object') {
        return new StreamSubscription(this._stream.subscribe(observer[0]));
      } else {
        return new StreamSubscription(this._stream.subscribe(...observer));
      }
    }
  }
}

module.exports = EventStream;