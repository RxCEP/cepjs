## Project Structure
Most of the project(operations) has been based on Etzion & Niblett (2011) as pointed out in the [Acknowledgment](https://github.com/RxCEP/cepjs#acknowledgment) section of the main readme file. The reason for this was not only because it offers a complete guide around event processing, but also it has a rich set of patterns (a key topic for CEP existence) and includes model where the inner workings of a event processing engine is modeled as an event processing network. This model, in turn, represents each operation as an event processing agent, where a set of those agents are connected forming a direct graph from event producers to consumers (see figure bellow). This way of representing an event processing engine maps nicely to the dataflow style used in RxJS (first reactive library used in the project and the one that influenced the currently syntax of CEP.js).

<p align="center">
  <img src="https://user-images.githubusercontent.com/4553211/110870069-7db50a80-82aa-11eb-9a89-800801de3823.PNG" alt="Event Processing Network">
</p>

Currenty the project is divided in three packages, all managed with the help of [lerna](https://lerna.js.org/) package. One of the advantages of lerna is that it bootstrap (so it calls) dependencies among the managed subpackages. This means that it analyses the packages and install the common dependencies on the root of the project, avoid duplication of dependencies among the subpackages. To run the bootstrap operation, just run the script `npm run bootstrap` on the root of the project.

The packages cepjs-most and cepjs-rx represent the current supported reactive libraries as noted on the [reactive-libraries](https://github.com/RxCEP/cepjs/blob/master/REACTIVE-LIBRARIES.md) file. Those packages gathers the reactive libraries with all the needed dependencies. The [cepjs-core](https://github.com/RxCEP/cepjs/tree/master/packages/cepjs-core) is the most important package of CEP.js since it concentrates the core functionalities. The current structure of cepjs-core is the following:

 ```javascript
cepjs-core
 ├── .npmignore
 ├─> lib
 │   ├── eventtype.js  //an event type representation
 │   ├── index.js
 │   ├─> location  //gathers useful classes/functions used with spatial patterns
 │   │   ├── hemisphere.js
 │   │   ├── index.js
 │   │   └── point.js
 │   ├─> policies  //gathers policies (enums) used with some operations
 │   │   └── index.js
 │   ├─> reactive-libs
 │   │   ├─> common  //common functionalities used by the operations (separated according to their categories)
 │   │   │   ├── context.js
 │   │   │   ├── factory.js
 │   │   │   ├── logical.js
 │   │   │   ├── spatial.js
 │   │   │   ├── transformation.js
 │   │   │   └── trend.js
 │   │   ├── helperFunctions.js  //helper functions/classes/enums used accross the operations
 │   │   ├─> most
 │   │   │   ├─> adapter //gathers the operations according to their categories
 │   │   │   │   ├── context.js
 │   │   │   │   ├── factory.js
 │   │   │   │   ├── general.js
 │   │   │   │   ├── index.js
 │   │   │   │   ├─> patterns
 │   │   │   │   │   ├── logical.js
 │   │   │   │   │   ├── modal.js
 │   │   │   │   │   ├── spatial.js
 │   │   │   │   │   ├── spatiotemporal.js
 │   │   │   │   │   ├── subset.js
 │   │   │   │   │   ├── threshold.js
 │   │   │   │   │   └── trend.js
 │   │   │   │   └── transformation.js
 │   │   │   ├── eventstream.js
 │   │   │   └── streamsubscription.js
 │   │   └─> rxjs
 │   │       ├─> adapter //gathers the operations according to their categories
 │   │       │   ├── context.js
 │   │       │   ├── factory.js
 │   │       │   ├── general.js
 │   │       │   ├── index.js
 │   │       │   ├─> patterns
 │   │       │   │   ├── logical.js
 │   │       │   │   ├── modal.js
 │   │       │   │   ├── spatial.js
 │   │       │   │   ├── spatiotemporal.js
 │   │       │   │   ├── subset.js
 │   │       │   │   ├── threshold.js
 │   │       │   │   └── trend.js
 │   │       │   └── transformation.js
 │   │       ├── eventstream.js
 │   │       └── streamsubscription.js
 │   └── streamsubscription.js  //base class for representing a stream subscription
 ├── package.json
 ├── README.md
 └── webpack.config.js
 ```

## Commit Guidelines
Before committing to the source, try to use the following conventions:

- http://karma-runner.github.io/6.1/dev/git-commit-msg.html
- https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716

The first link includes some arguments about why using those conventions.

Additionally, attempt not to commit directly to the master branch unless you are 100% sure your change won't add any bug/problem. Instead, prefer to follow a feature-branch schema.
