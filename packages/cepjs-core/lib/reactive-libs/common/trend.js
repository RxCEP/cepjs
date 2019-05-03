// helper class
class Trend {
  constructor(previous, stable = true, increasing = true, decreasing = true, mixed = true) {
    this.previous = previous;
    this.stable = stable;
    this.increasing = increasing;
    this.decreasing = decreasing;
    this.mixed = mixed;
  }
}

const compareStable = (objAcc, val) =>
  !objAcc ? //first element
    new Trend(val) : new Trend(val, stableCheck(objAcc, val));

const compareIncreasing = (objAcc, val) =>
  !objAcc ? //first element
    new Trend(val) : new Trend(val, true, increasingCheck(objAcc, val));

const compareDecreasing = (objAcc, val) =>
  !objAcc ? //first element
    new Trend(val) : new Trend(val, true, true, decreasingCheck(objAcc, val));

const compareMixed = (objAcc, val) =>
  !objAcc ? //first element
    new Trend(val) :
    new Trend(val, stableCheck(objAcc, val),
      increasingCheck(objAcc, val),
      decreasingCheck(objAcc, val),
      mixedCheck(objAcc));

const stableCheck = (stableStatus, previous, curr) => stableStatus && (previous == curr);
const increasingCheck = (increasingStatus, previous, curr) => increasingStatus && (previous < curr);
const decreasingCheck = (decreasingStatus, previous, curr) => decreasingStatus && (previous > curr);
const mixedCheck = (objAcc) => !objAcc.stable && !objAcc.increasing && !objAcc.decreasing;

module.exports = {
  compareStable,
  compareIncreasing,
  compareDecreasing,
  compareMixed
};