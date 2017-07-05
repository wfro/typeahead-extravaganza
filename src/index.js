// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';
//
// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();
//
//
// ReactDOM.render(<App />, $root);
//
// registerServiceWorker();

const $root = document.getElementById('root');

function init() {
  // Render the container
  const $container = elt('div', '', { class: 'search-container' });

  // Render the search input
  const $input = elt('input', '', {
    class: 'search-input',
    type: 'text',
    placeholder: 'Search...',
  });
  $input.addEventListener('keyup', onSearchChange);

  // Render results container
  const $resultsContainer = elt('ul', '', { class: 'search-results' });

  $container.appendChild($input);
  $container.appendChild($resultsContainer);

  // Finally render everything to the page
  $root.appendChild($container);
}

// Yet to be implemented
function onSearchChange() {}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
  init();
});

// Usage:
//  elt('div', 'Hello World!', { class: 'text-center' })
function elt(eltType, text, options = {}) {
  // Create a new HTMLElement
  const elt = document.createElement(eltType);

  // Manually create and append a text node to the element (annyoing, I know)
  var textNode = document.createTextNode(text);
  elt.appendChild(textNode);

  // Add any attributes
  Object.keys(options).forEach(k => {
    const v = options[k];
    elt.setAttribute(k, v);
  });

  return elt;
}
