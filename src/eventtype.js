class EventType {
    constructor(eventTypeId, occurrenceTime = null,
        eventAnnotation,  eventSource) {
        this._eventTypeId = eventTypeId;
        this._occurrenceTime = occurrenceTime;
        this._detectionTime = null;
        this._eventAnnotation = eventAnnotation;
        this._eventSource = eventSource;
    }
    //getter
    get eventTypeId() {
        return this._eventTypeId;
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
    get eventSource() {
        return this._eventSource;
    }
    //setter
    set eventTypeId(value) {
        this._eventTypeId = value;
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
    set eventSource(value) {
        this._eventSource = value;
    }

    toJSON() {
        const jsonObj = Object.assign({}, this);;

        const proto = Object.getPrototypeOf(this);
        for (const key of Object.getOwnPropertyNames(proto)) {      
          const desc = Object.getOwnPropertyDescriptor(proto, key);
          const hasGetter = desc && typeof desc.get === 'function';
          if (hasGetter) {
            jsonObj[key] = desc.get();
          }
        }
    
        return jsonObj;
      }
}

module.exports = {
    EventType: EventType
};