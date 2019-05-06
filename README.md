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

Before continuing with installation, one must choose among the supported reactive libraries. In order to better manage those reactive libraries, they are organized in distinct packages bundling all necessary dependencies. See the [reactive libraries]() file to find more information on the reactive libraries and the respective packages.

npm:
```ssh
# either
npm install -save cepjs-core cepjs-rx
# or
npm install -save cepjs-core cepjs-most
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
run `npm run build` to build the code and generate the cep.js file under the dist folder

## Usage

## License
CEP.js is available under the MIT license. See the [LICENSE](https://github.com/RxCEP/cepjs/blob/master/LICENSE) file for more info.