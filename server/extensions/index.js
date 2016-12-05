import Component from './component';
import Icon from './icon';

// We could do this automatically with `fs`, but that's unnecessary I/O
// And doesn't allow us to exclude some.
module.exports = new Map([
  ['Component', Component],
  ['Icon', Icon]
]);
