const _ = require('lodash/fp');
const { compareEvtType } = require('../helperFunctions');

const separateEvtsByType = _.curry((evtTypeList, evtTypeListCounted, elems) => {
  return _.uniq(evtTypeList).reduce((acc, evtType) => {
    acc.push(evtTypeListCounted[evtType] === 1 ?
      elems.filter(compareEvtType(evtType)) :
      _.chunk(evtTypeListCounted[evtType], elems.filter(compareEvtType(evtType))));
    return acc;
  }, []);
});

const countList = _.countBy(_.identity);

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