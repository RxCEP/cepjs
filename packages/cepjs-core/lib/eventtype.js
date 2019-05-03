/** Class used to represent an event type. */
class EventType {
  /**
  * Create an event occurrence.
  * @param {string} eventTypeId 
  * @param {string} eventSource 
  * @param {number} [occurrenceTime]
  */
  constructor(eventTypeId, eventSource, occurrenceTime = null) {
    this._eventTypeId = eventTypeId;
    this._eventSource = eventSource;
    this._occurrenceTime = occurrenceTime;
    this._detectionTime = null;
  }

  static eventType(eventTypeId, eventSource, occurrenceTime = null) {
    return new EventType(eventTypeId, eventSource, occurrenceTime);
  }

  /**
  * Gets the event type identifier value.
  * @return {string} The event type identifier value.
  */
  get eventTypeId() {
    return this._eventTypeId;
  }

  /**
  * Gets the event source value.
  * @return {string} The event source value.
  */
  get eventSource() {
    return this._eventSource;
  }

  /**
  * Gets the occurrence time value.
  * @return {number} The occurrence time value.
  */
  get occurrenceTime() {
    return this._occurrenceTime;
  }

  /**
  * Gets the detection time value.
  * @return {number} The detection time value.
  */
  get detectionTime() {
    return this._detectionTime;
  }

  /**
  * Sets the event type identifier.
  * @param {string} value - the event type identifier value to be set.
  */
  set eventTypeId(value) {
    this._eventTypeId = value;
  }

  /**
  * Sets the event source.
  * @param {string} value - the event source value to be set.
  */
  set eventSource(value) {
    this._eventSource = value;
  }

  /**
  * Sets the occurrence time.
  * @param {string} value - the occurrence time value to be set.
  */
  set occurrenceTime(value) {
    this._occurrenceTime = value;
  }

  /**
  * Returns a string representing the event instance.
  * @return {string} a string representing the current object.
  */
  toString() {
    return `event(${this.eventTypeId}, ${this.eventSource}, ${this.occurrenceTime}, ${this.detectionTime})`;
  }

  /**
  * Clones the current object.
  * @return {Point} a cloned new object.
  */
  clone() {
    let proto = Object.getPrototypeOf(this);
    let cloned = Object.create(proto);

    cloned.eventTypeId = this.eventTypeId;
    cloned.eventSource = this.eventSource;
    cloned.occurrenceTime = this.occurrenceTime;
    cloned._detectionTime = this.detectionTime;

    return cloned;
  }
}

module.exports = EventType;