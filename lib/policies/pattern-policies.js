/**
 * Enum for cardinality policy.
 * @readonly
 * @enum {number}
 */
const cardinality = {
  /** Single policy */
  SINGLE: 0,
  /** Unrestricted policy */
  UNRESTRICTED: 1
}

/**
 * Enum for repeated type policy.
 * @readonly
 * @enum {number}
 */
const repeatedType = {
  /** Override policy */
  OVERRIDE: 0,
  /** Every policy */
  EVERY: 1,
  /** First policy */
  FIRST: 2,
  /** Last policy */
  LAST: 3
}

/**
 * Enum for consumption policy.
 * @readonly
 * @enum {number}
 */
const consumption = {
  /** Consume policy */
  CONSUME: 0,
  /** Reuse policy */
  REUSE: 1
}

/**
 * Enum for order policy.
 * @readonly
 * @enum {number}
 */
const order = {
  /** Occurrence time policy */
  OCCURRENCE_TIME: 0,
  /** Detection time policy */
  DETECTION_TIME: 2,
  /** Stream position policy */
  STREAM_POSITION: 3
};

module.exports = {
  cardinality,
  repeatedType,
  consumption,
  order
};