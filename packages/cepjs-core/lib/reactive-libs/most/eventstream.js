const most = require('cepjs-most');
const { run: mostRun } = most.lib.core;
const { newDefaultScheduler } = most.lib.scheduler;

const StreamSubscription = require('./streamsubscription');

const composeLeft = (operations, stream) => {
  let i = 0, currentStream = stream;

  while (i < operations.length) {
    currentStream = operations[i](currentStream);
    i++;
  }

  return currentStream;
}

const buildSinkFromObject = observer => ({
  event: function (time, value) {
    observer.next(value);
  }, error: function (time, err) {
    if (observer.error) {
      observer.error(err);
    }
  }, end: function (time) {
    if (observer.complete) {
      observer.complete();
    }
  }
});

const buildSinkFromFunctions = observer => ({
  event: function (time, value) {
    observer[0](value);
  }, error: function (time, err) {
    if (observer[1]) {
      observer[1](err);
    }
  }, end: function (time) {
    if (observer[2]) {
      observer[2]();
    }
  }
});

const run = (buildSink, observer, stream) =>
  mostRun(buildSink(observer), newDefaultScheduler(), stream);

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
    return new EventStream(composeLeft(operations, this._stream));
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
        return new StreamSubscription(run(buildSinkFromObject, observer[0]), this._stream);
      } else {
        return new StreamSubscription(run(buildSinkFromFunctions, observer, this._stream));
      }
    }
  }
}

module.exports = EventStream;