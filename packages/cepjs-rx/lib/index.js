const rxjs = require('rxjs');
const rxjsOperators = require('rxjs/operators');

module.exports = {
    type: 'rx',
    lib: {
        core: rxjs,
        operators: rxjsOperators
    }
};