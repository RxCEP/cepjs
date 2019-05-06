<p align="center">
    <img src="https://user-images.githubusercontent.com/4553211/57202520-aff1d480-6f7c-11e9-9504-9ae216d7dc12.png" alt="cepjs logo">
</p>

<p align="center">
    A JavaScript library for coding complex event processing reactively.
</p>

<p align="center">
    <a href="https://lerna.js.org/"><img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" alt="lerna"></a>
</p>

- [About](#about)
- [Install](#install)
- [Usage](#usage)

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
<script src="path_to_cepjs-core/dist/cepjsCore.js"></script>
<!-- In case RxJS will be used -->
<script src="path_to_cepjs-rx/dist/cepjsRx.js"></script>
<!-- In case Most.js will be used instead -->
<script src="path_to_cepjs-most/dist/cepjsMost.js"></script>
```
### Build
The packages available through npm already include distribution files under the dist folder. Alternatively, one can execute the command `npm run build` within the root folder of any package to build the code and generate the distribution files.

## Usage
The first step to take is to import the [core](./packages/cepjs-core) package. The package exports a factory function expecting to be passed in any of the custom reactive [packages](REACTIVE-LIBRARIES.md) chose during installation. All of the operations are then available under the same namespace. The following **_simple_** snippet exemplify those steps and usage.

### CommonJS
```JavaScript
const coreFactory = require('cepjs-core');
const { merge, fromEvent, tumblingTimeWindow, all, EventType } = coreFactory(require('cepjs-rx'));

let clickStream = fromEvent(document, 'click',
    domEvent => new EventType('click event', 'DOM', Date.now()));

let keyPressStream = fromEvent(document, 'keypress',
    domEvent => new EventType('key press event', 'DOM', Date.now()));

let subscription =
      merge(clickStream, keyPressStream)
        .pipe(tumblingTimeWindow(1000),
          all(['click event', 'key press event'], 'click & press'))
        .subscribe({
          next: derivedEvent =>
            console.log(`Detected at ${new Date(derivedEvent.detectionTime)}`)
        });
```
### IIFE (browser)
```JavaScript
const coreFactory = cepjsCore;
const { merge, fromEvent, tumblingTimeWindow, all, EventType } = coreFactory(cepjsRx);

let clickStream = fromEvent(document, 'click',
    domEvent => new EventType('click event', 'DOM', Date.now()));

let keyPressStream = fromEvent(document, 'keypress',
    domEvent => new EventType('key press event', 'DOM', Date.now()));

let subscription =
      merge(clickStream, keyPressStream)
        .pipe(tumblingTimeWindow(1000),
          all(['click event', 'key press event'], 'click & press'))
        .subscribe({
          next: derivedEvent =>
            console.log(`Detected at ${new Date(derivedEvent.detectionTime)}`)
        });
```


Note that the syntax is almost identical to RxJS's, using the _pipe_ operator to derive business logic. As an alternative, a _compose_ operator is also available to compose functions from right to left, following a more natural compositional order.

## License
CEP.js is available under the MIT license. See the [LICENSE](https://github.com/RxCEP/cepjs/blob/master/LICENSE) file for more info.
