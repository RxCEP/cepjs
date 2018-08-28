const LatLon = require('geodesy').LatLonEllipsoidal;
const Utm = require('geodesy').Utm;

const _NORTH = 'N';
const _SOUTH = 'S';
class Hemisphere{
    static get NORTH(){
        return _NORTH;
    }
    static get SOUTH(){
        return _SOUTH;
    }
}


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
    
    distance(point2, fixed){
        let dist = new LatLon(this.latitude, this.longitude)
                .distanceTo(new LatLon(point2.latitude, point2.longitude));
        return fixed? dist.toFixed(fixed): dist;
    }
    
    static distance(point1, point2, fixed){
        let dist = (new LatLon(point1.latitude, point1.longitude)
                .distanceTo(new LatLon(point2.latitude, point2.longitude)))/1000;
        return fixed? dist.toFixed(fixed): dist;
    }

    static fromUTM(zone, hemisphere, easting, northing){
        const utmCoords = new Utm(zone, hemisphere, easting, northing).toLatLonE();
        return new Point(utmCoords.lat, utmCoords.lon);
    }
}

module.exports = {
    Point : Point,
    Hemisphere: Hemisphere
};