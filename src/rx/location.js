const haversine = require('haversine-js');

var SphereRadius;
(function (SphereRadius) {
    SphereRadius[SphereRadius["MILE"] = haversine.EARTH.MILE] = "MILE";
    SphereRadius[SphereRadius["KILOMETER"] = haversine.EARTH.KM] = "KILOMETER";
    SphereRadius[SphereRadius["METER"] = haversine.EARTH.M] = "METER";
    SphereRadius[SphereRadius["NAUTICALMILE"] = haversine.EARTH.NMI] = "NAUTICALMILE";
})(SphereRadius || (SphereRadius = {}));


class Point{

    constructor(latitude, longitude){
        this._latitude = latitude;
        this._longitude = longitude;
    }

    get latitude() {
        return this._latitude;
    }
    set latitude(value) {
        this._latitude = value;
    }

    get longitude() {
        return this._longitude;
    }
    set longitude(value) {
        this._longitude = value;
    }
    
    static distance(firstLocation, secondLocation, sphereRadius = SphereRadius.KILOMETER, radians = false){
        return haversine({
            latitude: firstLocation.latitude,
            longitude: firstLocation.longitude
        },{
            latitude: secondLocation.latitude,
            longitude: secondLocation.longitude
        },{
            radius: sphereRadius,
            isRadians: radians
        });
    }
}

module.exports = {
    Point : Point,
    SphereRadius: SphereRadius
};