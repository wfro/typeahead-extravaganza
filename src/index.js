// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';
//
// ReactDOM.render(<App />, document.getElementById('root'));
// registerServiceWorker();

const $root = document.getElementById('root');
const $searchInput = document.querySelector('.search-input');

// Global variable that will hold items when they're fetched
// from the server
let state = {
  items: [],
  searchText: '',
};

function setState(updates) {
  const nextState = {
    ...state,
    ...updates,
  };
  state = nextState;
  render();
}

function init() {
  $searchInput.addEventListener('keyup', onSearchChange);

  render();

  // Fetch the initial list of tasks
  window
    .fetch('http://localhost:3001/items')
    .then(resp => resp.json())
    .then(resp => {
      // Finally to the initial render of the items list
      setState({ items: resp });
    });
}

// Runs every time a user types something new into the search input
function onSearchChange(e) {
  // Get the search query we should filter by
  setState({ searchText: e.target.value });
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
  init();
});

// Helpers

function render() {
  renderItems();
  renderCounter();
}

// <ul class="items">
// </ul>
function renderSearchInput() {
  const input = elt('input', '', {
    type: 'text',
    placeholder: 'Search...',
    class: 'search-input',
    value: state.searchText,
  });
  input.addEventListener('keyup', onSearchChange);
  $root.appendChild(input);
}

function renderItems() {
  const $items = document.querySelector('.items');
  let ul;
  if ($items) {
    $items.innerHTML = '';
    ul = $items;
  } else {
    const $ul = elt('ul', '', { class: 'items' });
    ul = $ul;
  }

  const query = state.searchText;
  const filteredItems = state.items.filter(item => {
    return (
      item.name.substr(0, query.length).toLowerCase() === query.toLowerCase()
    );
  });

  // Interacting with the DOM (usually by selecting/removing/appending
  // an element) is expensive, so we ideally want to minimize how
  // much we interact directly with the DOM. Using a document fragment
  // ensures we only have to paint once, when the final list of elements
  // has been built up.
  const documentFragment = document.createDocumentFragment();

  filteredItems.forEach(item => {
    const li = elt('li', '', { class: 'item' });
    const header = elt('h3', item.name, { 'data-text': item.name });
    const body = elt('div', `Rating: ${item.rating}`);
    li.appendChild(header);
    li.appendChild(body);
    documentFragment.appendChild(li);
  });

  $root.appendChild(documentFragment);
}

function renderCounter() {
  const value = `Results: ${state.items.length}`;
  const $results = document.querySelector('.results');
  if ($results) {
    $results.textContent = value;
  } else {
    const div = elt('div', `Results: ${state.items.length}`, {
      class: 'results',
    });

    $searchInput.insertAdjacentHTML('afterend', div.outerHTML);
  }
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
