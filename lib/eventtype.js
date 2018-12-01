class EventType {
    constructor(eventTypeId, occurrenceTime = null,  eventSource) {
        this.eventTypeId = eventTypeId;
        this.occurrenceTime = occurrenceTime;
        this.detectionTime = null;
        this.eventSource = eventSource;
    }
}

module.exports = {
    EventType: EventType
};