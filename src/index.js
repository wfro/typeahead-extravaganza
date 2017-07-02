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
  const filteredItems = allItems.filter(
    item => item.name.substr(0, query.length) === query,
  );

  // Re-render with only the items that match
  renderItems(filteredItems);
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
  init();
});

// Helpers

const Benchmark = require('benchmark');

var suite = new Benchmark.Suite();

function runSuite() {
  suite
    .add('appendChild in a loop', function() {
      $ul.innerHTML = '';
      const elts = allItems.forEach(item => {
        const el = elt('li', item.name);
        $ul.appendChild(el);
      });
    })
    .add('outerHTML', function() {
      $ul.innerHTML = '';
      const arr = [];
      const elts = allItems.forEach(item => {
        const el = elt('li', item.name);
        arr.push(el);
      });
      $ul.innerHTML = arr.map(el => el.outerHTML).join('');
    })
    .add('documentFragments', function() {
      $ul.innerHTML = '';

      const documentFragment = document.createDocumentFragment();

      const elts = allItems.forEach(item => {
        const li = elt('li', item.name);
        documentFragment.appendChild(li);
      });

      $ul.appendChild(documentFragment);
    })
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({ async: true });
}

function renderItems(items) {
  // $ul.innerHTML = '';
  // const arr = [];
  // const elts = items.forEach(item => {
  //   const el = elt('li', item.name);
  //   arr.push(el);
  //   $ul.appendChild(el);
  // });
  // arr.map(elt => elt.outerHTML).join('');
  $ul.innerHTML = '';

  const documentFragment = document.createDocumentFragment();

  const elts = allItems.forEach(item => {
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
