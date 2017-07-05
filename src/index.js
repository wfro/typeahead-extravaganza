// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
//import registerServiceWorker from './registerServiceWorker';
//
// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

const $root = document.getElementById('root');

// Global variable that will hold items when they're fetched
// from the server
let allItems = [];

function init() {
  initialRender();

  // Fetch the initial list of tasks
  window
    .fetch('http://localhost:3001/items')
    .then(resp => resp.json())
    .then(resp => {
      allItems = resp;

      // Finally to the initial render of the items list
      renderItems(allItems);
    });
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

// Runs every time a user types something new into the search input
function onSearchChange(e) {
  // Get the search query we should filter by
  const query = e.target.value;

  const $lis = document.querySelectorAll('.item');

  // Filter the list
  Array.from($lis).forEach(li => {
    const value = li.querySelector('h3').textContent;
    if (
      value &&
      value.substr(0, query.length).toLowerCase() === query.toLowerCase()
    ) {
      li.style.display = '';
    } else {
      li.style.display = 'none';
    }
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
