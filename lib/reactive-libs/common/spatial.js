const _ = require('lodash/fp');
const Point = require('../../location/point');

const distanceFn = path => ([a, b]) => Point.distance(_.get(path, a), _.get(path, b));
const curriedDistanceFn = _.curry((a, path, b) => Point.distance(a, _.get(path, b)));

module.exports = {
  distanceFn,
  curriedDistanceFn
};