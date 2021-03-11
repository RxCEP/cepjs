## Project Structure
Most of the project has been based on Etzion & Niblett (2011) as pointed out in the [Acknowledgment](https://github.com/RxCEP/cepjs#acknowledgment) section of the main readme file. The reason for this was not only because it offers a complete guide around event processing, but also it has a rich set of patterns (a key topic for CEP existence) and includes model where the inner workings of a event processing engine is modeled as an event processing network. This model, in turn, represents each operation as an event processing agent, where a set of those agents are connected forming a direct graph from event producers to consumers (see figure bellow). This way of representing an event processing engine maps nicely to the dataflow style used in RxJS (first reactive library used in the project and the one that influenced the currently syntax of CEP.js).

![Event Processing Network](https://user-images.githubusercontent.com/4553211/110870069-7db50a80-82aa-11eb-9a89-800801de3823.PNG "Simple Event Processing Network")

## Commit Guidelines
Before committing to the source, try to use the following conventions:

- http://karma-runner.github.io/6.1/dev/git-commit-msg.html
- https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716

The first link includes some arguments about why using those conventions.

Additionally, attempt not to commit directly to the master branch unless you are 100% sure your change won't add any bug/problem. Instead, prefer to follow a feature-branch schema.