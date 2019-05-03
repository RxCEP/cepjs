const core = require('@most/core');
const domEvent = require('@most/dom-event');
const scheduler = require('@most/scheduler');
const mostFromArray = require('most-from-array');
const mostFromEvent = require('most-from-event');
const mostRxUtils = require('most-rx-utils');

module.exports = {
    type: 'most',
    lib: {
        core,
        domEvent,
        scheduler,
        mostFromArray,
        mostFromEvent,
        mostRxUtils
    }
};