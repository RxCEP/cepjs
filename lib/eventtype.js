class EventType {
    constructor(eventTypeId, eventSource, occurrenceTime = null, detectionTime = null) {
        this.eventTypeId = eventTypeId;
        this.eventSource = eventSource;
        this.occurrenceTime = occurrenceTime;
        this.detectionTime = detectionTime;
    }
}

module.exports = {
    EventType
};