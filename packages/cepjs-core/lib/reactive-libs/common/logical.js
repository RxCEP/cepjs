const _ = require('lodash/fp');

const { compareEvtType } = require('../helperFunctions');

// counts the elements of a set/array according to the given argument
// identity represents a function that returns the passed value
// this function is used to count the occurrences of event types
const countList = _.countBy(_.identity);

/**
 * 
 * @param {string[]} evtTypeList - original event type list.
 * @param {Object} evtTypeListCounted - an object containing the total of
 * event types in the event type list. This object is the result of the countList function.
 * @return {EventType[][]} a set of arrays, each grouped by the occurrences listed on the event type list.
 */
const separateEvtsByType = _.curry((evtTypeList, evtTypeListCounted, elems) => {
  return _.uniq(evtTypeList).reduce((acc, evtType) => {
    acc.push(evtTypeListCounted[evtType] === 1 ?
      elems.filter(compareEvtType(evtType)) :
      _.chunk(evtTypeListCounted[evtType], elems.filter(compareEvtType(evtType))));
    return acc;
  }, []);
});

// calculates the cartesian product of a set of informed arrays
// function taken from https://gist.github.com/ChrisJefferson/cb8db2a4c67a9506c56c
const cartesianProduct = (...rest) =>
  _.reduce((a, b) =>
    _.flatMap(x =>
      _.map(y =>
        x.concat([y])
      )(b)
    )(a)
  )([[]])(rest);

const applyAssertion = _.curry((assertion, product) =>
  product.filter(set => assertion && typeof assertion === 'function' ? assertion.apply(null, set) : true));

const elemsCheckLength = _.curry((length, elems) => elems.length === length);

module.exports = {
  separateEvtsByType,
  countList,
  cartesianProduct,
  applyAssertion,
  elemsCheckLength
};