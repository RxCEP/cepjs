class EventType {
    constructor(eventTypeId, eventComposition, temporalGranularity,
        occurrenceTime = 0, eventAnnotation, eventIdentity,
        eventSource) {
        this.eventTypeId = eventTypeId;
        this._eventComposition = eventComposition;
        this._temporalGranularity = temporalGranularity;
        this._occurrenceTime = occurrenceTime;
        this._detectionTime = 0;
        this._eventAnnotation = eventAnnotation;
        this._eventIdentity = eventIdentity;
        this._eventSource = eventSource;
    }
    //getter
    get eventTypeId() {
        return this._eventTypeId;
    }
    get eventComposition() {
        return this._eventComposition;
    }
    get temporalGranularity() {
        return this._temporalGranularity;
    }
    get occurrenceTime() {
        return this._occurrenceTime;
    }
    get detectionTime() {
        return this._detectionTime;
    }
    get eventAnnotation() {
        return this._eventAnnotation;
    }
    get eventIdentity() {
        return this._eventIdentity;
    }
    get eventSource() {
        return this._eventSource;
    }
    //setter
    set eventTypeId(value) {
        this._eventTypeId = value;
    }
    set eventComposition(value) {
        this._eventComposition = value;
    }
    set temporalGranularity(value) {
        this._temporalGranularity = value;
    }
    set occurrenceTime(value) {
        this._occurrenceTime = value;
    }
    set detectionTime(value) {
        this._detectionTime = value;
    }
    set eventAnnotation(value) {
        this._eventAnnotation = value;
    }
    set eventIdentity(value) {
        this._eventIdentity = value;
    }
    set eventSource(value) {
        this._eventSource = value;
    }
}

module.exports = {
    EventType: EventType
};