const LatLon = require('geodesy/latlon-ellipsoidal');
const Utm = require('geodesy/utm');

/** Class used to represent a given point location. */
class Point {
  /**
  * Creates a point.
  * @param {number} latitude - The latitude value.
  * @param {number} longitude - The longitude value.
  */
  constructor(latitude, longitude) {
    this._latitude = latitude;
    this._longitude = longitude;
  }

  /**
  * Gets the latitude value.
  * @return {number} The latitude value.
  */
  get latitude() {
    return this._latitude;
  }

  /**
  * Gets the longitude value.
  * @return {number} The longitude value.
  */
  get longitude() {
    return this._longitude;
  }

  /**
  * Sets the longitude value.
  * @param {number} value - the latitude value to be set.
  */
  set latitude(value) {
    this._latitude = value;
  }

  /**
  * Sets the longitude value.
  * @param {number} value - the longitude value to be set.
  */
  set longitude(value) {
    this._longitude = value;
  }

  /**
  * Calculates the distance between this instance and a second point.
  * @param {Point} point2 - the second point.
  * @param {number} fixed - the precision of the result.
  * @return {number} the distance in meters (metres).
  */
  distance(point2, fixed) {
    let dist = new LatLon(this.latitude, this.longitude)
      .distanceTo(new LatLon(point2.latitude, point2.longitude));
    return fixed ? dist.toFixed(fixed) : dist;
  }

  /**
  * Calculates the distance between two given points.
  * @param {Point} point1 - the first point.
  * @param {Point} point2 - the second point.
  * @param {number} fixed - the precision of the result.
  * @return {number} the distance in meters (metres).
  */
  static distance(point1, point2, fixed) {
    let dist = new LatLon(point1.latitude, point1.longitude)
      .distanceTo(new LatLon(point2.latitude, point2.longitude));
    return fixed ? dist.toFixed(fixed) : dist;
  }

  /**
  * Instatiates a point from UTM coordinates.
  * @param {number} zone - the UTM zone.
  * @param {string} hemisphere - the hemisphere north or south. Use {@link hemisphere.NORTH} or {@link hemisphere.SOUTH}.
  * @param {number} easting - the easting coordinate.
  * @param {number} northing - the northing coordinate.
  * @return {Point} a point instance.
  */
  static fromUTM(zone, hemisphere, easting, northing) {
    const utmCoords = new Utm(zone, hemisphere, easting, northing).toLatLonE();
    return new Point(utmCoords.lat, utmCoords.lon);
  }

  /**
  * Returns a string representing the point location.
  * @return {string} a string representing the current object.
  */
  toString() {
    return `(${this.latitude}, ${this.longitude})`;
  }

  /**
  * Clones the current object.
  * @return {Point} a cloned new object.
  */
  clone() {
    let proto = Object.getPrototypeOf(this);
    let cloned = Object.create(proto);

    cloned.latitude = this.latitude;
    cloned.longitude = this.longitude;

    return cloned;
  }
}

module.exports = Point;