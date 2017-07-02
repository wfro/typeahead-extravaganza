import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

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
  const filteredItems = allItems.filter(item => item.name.includes(query));

  // TODO: how to re-use the dom elements instead of creating new ones
  renderItems(filteredItems);
}

// Starts the app
document.addEventListener('DOMContentLoaded', () => {
  init();
});

// Helpers
function renderItems(items) {
  $ul.innerHTML = '';
  items.forEach(item => {
    const el = elt('li', item.name);
    $ul.appendChild(el);
  });
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
