<p align="center">
    <img src="https://user-images.githubusercontent.com/4553211/57256072-1255de00-702c-11e9-9e38-479d4f4ac34f.png" alt="cepjs logo">
</p>

<p align="center">
    A JavaScript library for coding complex event processing reactively
</p>

<p align="center">
    <a href="https://lerna.js.org/"><img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" alt="lerna"></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
</p>

## About
CEP.js is a JavaScript library for coding complex event processing (CEP) reactively. It works as a big adapter, accepting different reactive libraries to express event processing operations while leveraging a sintax model close to the widely used ReactiveX for JavaScript ([RxJS](https://github.com/ReactiveX/rxjs)). Besides usual RxJS operations regarding stream manipulation, it also bundles common complex event processing (CEP) operations revolving around filtering, transformation, and **specially pattern detection**.

## Install
Before continuing with installation, one must choose among the supported reactive libraries. In order to better manage those reactive libraries, they are organized in distinct packages bundling all necessary dependencies. See the [reactive libraries](REACTIVE-LIBRARIES.md) file to find more information on the reactive libraries and the respective packages.

npm:
```ssh
# either
npm install --save cepjs-core cepjs-rx
# or
npm install --save cepjs-core cepjs-most
```
browser:
```html
<script src="...path_to_cepjs-core/dist/cepjsCore.min.js"></script>
<!-- In case RxJS will be used -->
<script src="...path_to_cepjs-rx/dist/cepjsRx.min.js"></script>
<!-- In case Most.js will be used instead -->
<script src="...path_to_cepjs-most/dist/cepjsMost.min.js"></script>
```
### Build
The packages, available through npm, already include distribution files (for browser usage) under the `dist` folder. Alternatively, one can execute the command `npm run build` within the root folder of any package to build the code and generate the distribution files.

#### ES5 Note
If needed, a ES5 build can be generated for every package. Just run the script `npm run build:es5` inside one of the packages. After that, the built file will be available in the `dist.es5` folder.

## Usage
The first step to take is to import the [core](./packages/cepjs-core) package. The package exports a factory function expecting to be passed in any of the custom reactive [packages](REACTIVE-LIBRARIES.md) chose during installation. All of the operations are then available under the same namespace. The following snippets exemplify those steps.

### CommonJS
```JavaScript
const coreFactory = require('cepjs-core'); //factory function
const { merge, fromEvent, tumblingTimeWindow, all, EventType } = coreFactory(require('cepjs-rx')); //access some operations
```
### IIFE (browser)
```JavaScript
const coreFactory = cepjsCore; //factory function
const { merge, fromEvent, tumblingTimeWindow, all, EventType } = coreFactory(cepjsRx); //access some operations
```
### Example
TODO

> Note that the syntax is almost identical to RxJS's, using the _pipe_ operator to derive business logic. As an alternative, a _compose_ operator is also available to compose functions from right to left, following a more natural compositional order.

## Acknowledgment
We'd like to thank the following important source for the contribution to the development of the implemented patterns.

* *Etzion, O., & Niblett, P. (2011). Event processing in action. Manning.*

## License
CEP.js is available under the MIT license. See the [LICENSE](https://github.com/RxCEP/cepjs/blob/master/LICENSE) file for more info.
