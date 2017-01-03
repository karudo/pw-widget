// import 'promise-polyfill';
// import 'isomorphic-fetch';
import { h, render } from 'preact';
import './style';

let root;
let div;
function init() {
  if (!div) {
    div = document.createElement('div');
    document.body.appendChild(div);
  }
  let App = require('./components/app').default;
  root = render(<App />, div, root);
}

// in development, set up HMR:
if (module.hot) {
  //require('preact/devtools');   // turn this on if you want to enable React DevTools!
  module.hot.accept('./components/app', () => requestAnimationFrame(init) );
}

init();
