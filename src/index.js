// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';
//
// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

// const $root = document.getElementById('root');

const $ul = document.querySelector('.items');
const $searchInput = document.querySelector('.search-input');

// Global variable that will hold items when they're fetched
// from the server
let allItems = [];

function init() {
  // Add the event listener
  $searchInput.addEventListener('keyup', onSearchChange);

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

// Runs every time a user types something new into the search input
function onSearchChange(e) {
  // Get the search query we should filter by
  const query = e.target.value;

  // Filter the list
  const filteredItems = allItems.filter(
    item =>
      item.name.substr(0, query.length).toLocaleLowerCase() ===
      query.toLowerCase(),
  );

  // Re-render with only the items that match
  renderItems(filteredItems);
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
  init();
});

// Helpers

function renderItems(items) {
  // Clear out the old list before we re-render
  $ul.innerHTML = '';

  // Interacting with the DOM (usually by selecting/removing/appending
  // an element) is expensive, so we ideally want to minimize how
  // much we interact directly with the DOM. Using a document fragment
  // ensures we only have to paint once, when the final list of elements
  // has been built up.
  const documentFragment = document.createDocumentFragment();

  items.forEach(item => {
    const li = elt('li', item.name);
    documentFragment.appendChild(li);
  });

  $ul.appendChild(documentFragment);
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
