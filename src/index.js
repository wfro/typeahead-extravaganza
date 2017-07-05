// import React from 'react';
// import ReactDOM from 'react-dom';
import './index.css';
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

function onSearchChange(e) {
  // Get the search query we should filter by
  const query = e.target.value;

  // Don't make a request without a search term
  if (!query.length) {
    const $searchResults = document.querySelector('.search-results');
    $searchResults.innerHTML = '';

    return;
  }

  // Add a loading indicator while the request is in progress
  const $searchResults = document.querySelector('.search-results');
  // Clear out the old list before we re-render
  $searchResults.innerHTML = 'Loading...';

  // Use the window.fetch API to make an AJAX request
  window
    // Use ES6 template literals to create the string (Languages like Ruby have had this feature for, like, forever, but JavaScript just recently got to the party :))
    .fetch(`http://localhost:3001/items?name_like=${query}`)
    // Get the JSON out of the response body
    .then(resp => resp.json())
    .then(resp => {
      // `resp` will be an array of items, our search results
      renderItems(resp);
    });
}

function renderItems(items) {
  // Get the DOM node
  const $searchResults = document.querySelector('.search-results');

  // Clear out the old list before we re-render
  $searchResults.innerHTML = '';

  if (!items.length) {
    $searchResults.innerHTML = 'No results!';
  }

  // Interacting with the DOM (usually by selecting/removing/appending
  // an element) is expensive, so we ideally want to minimize how
  // much we interact directly with the DOM. Using a document fragment
  // ensures we only have to paint once, when the final list of elements
  // has been built up.
  const documentFragment = document.createDocumentFragment();

  // Create a new DOM node for each item
  items.forEach(item => {
    const li = elt('li', '', { class: 'item' });
    const header = elt('h3', item.name, { 'data-text': item.name });
    const body = elt('div', `Rating: ${item.rating}`);
    li.appendChild(header);
    li.appendChild(body);
    documentFragment.appendChild(li);
  });

  // Finally append everything to the DOM
  $searchResults.appendChild(documentFragment);
}

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
