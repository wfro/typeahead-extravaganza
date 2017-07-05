// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
//import registerServiceWorker from './registerServiceWorker';
//
// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

const $root = document.getElementById('root');

function init() {
  initialRender();
}

function initialRender() {
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

  window
    .fetch(`http://localhost:3001/items?name_like=${query}`)
    .then(resp => resp.json())
    .then(resp => {
      renderItems(resp);
    });
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
  init();
});

// Helpers

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

  $searchResults.appendChild(documentFragment);
}

function elt(eltType, text, options = {}) {
  const elt = document.createElement(eltType);
  var textNode = document.createTextNode(text);
  elt.appendChild(textNode);
  Object.keys(options).forEach(k => {
    const v = options[k];
    elt.setAttribute(k, v);
  });
  return elt;
}
