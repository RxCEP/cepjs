# cepjs-rx

> Most.js dependencies.

## Install

npm:
```sh
npm install --save cepjs-rx
```

browser:
```html
<script src="path_to_cepjs-core/dist/cepjsRx.min.js"></script>
```

### Build
This package, available through npm, already includes distribution files under the dist folder. Alternatively, one can execute the command `npm run build` within the root folder to build the code and generate the distribution files.

### ES5 Note
This is a package that heavily uses ES2015(ES6) syntax. However, there is an additional script that allows to generate distribution files targeting ES5. The command to run the script is `npm run build:es5`. After executing the script, the files will be available in the `dist.es5` folder.