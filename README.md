# React Crash Course!

## Intro

Sup! Welcome to a quick workshop where the ultimate goal is implement a typeahead (think the Google search bar) in React. But, we'll get there by first doing the same thing with plain old JavaScript. The goal here is to learn React, but we're taking this approach for a few reasons:
* It's good to get a sense for what it means to build UIs regardless of framework or technology. We want to train ourselves as React developers, but we also want to train ourselves as problem solvers. 
* React was invented to make our lives easier as developers. To help us move faster, to help us not want to lightly bang our heads against the desk when we think about our code. What better way to explore this than to see both sides of the fence?

The most important questions we'll explore:
> What is my state?

> When does it change?

Most of the time when I do workshops like these I lose sight of the underlying ideas in the midst of trying to get things to work, so the next few sections are partially for posterity. Take a look now to get the wheels moving and such, but this  should also be useful to check back in on later. 

### Goals
* strong understanding of the DOM and how to interact with it (creating and appending elements, reading data, etc]
* a sense of what "state" is, regardless of the technology used to implement a feature]
* react fundamentals
   * props, state
   * setState and state management
   * component driven design
   * one-way data flow, top-down rendering
   * imperative vs. declarative, react takes care of DOM
   * benefits of full re-render on every state change
 * More generally, see the steps of a generalized problem-solving process
 
## Installation
If you haven't already, install Node via [node.js.org](https://nodejs.org/en/)

Clone this repo and navigate to the project directory:
```
git clone git@github.com:wfro/typeahead-extravaganza.git
cd typeahead-extravaganza
```

Install the dependencies via npm or yarn:
```
npm install
# or
# yarn install
```

Start the development server:
```
npm start
# or
# yarn start
```

Install and Start the REST API
```
yarn global add json-server
# or
# npm install -g json-server
json-server db.json -p 3001
```

If you visit http://localhost:3000 and see the React homepage, then you're good to go.

## Vanilla JavaScript, mmmmmmmmmm

For both iterations (plain JS and React) we'll follow this general problem-solving process:

* Get a feel for requirements
* Break down the probably into managemable, actionable steps
* Make the thing

To quickly sketch things out:

Goal: build a typeahead where search results are populated based off of keystrokes.
Workflow:
* User enters a search term into a text input
* Send a request to the search API
* If results are found
  - render the results
* if no results are found
  - render an empty state
  
Notice how we haven't made any mention to React, or JavaScript, or Angular, or Ember, or any specific technology at all? This one of the most important things I learned early on, and I swear by this approach of outlining problems generally (more abstract), and slowly getting more specific until we finally end up with an actual implementation in code (less abstract). As human beings, we don't think in code, we think in terms of language. Start with a high-level verbal/written description, and then begin translating steps into code.

We technically have a bootstrapped React application, but the first thing we'll do is head to `src/index.js` and delete everything. Now, we can rebuild anew.

Let's start with the markup first, and then we can fill in each of the dynamic pieces.

First, checkout a new branch:

```
git checkout -b plain-js-take-one
```

Because we're rendering everything client-side, we'll need to make a whole bunch of HTML elements. Start with a helper function to make the rest of the process a little bit more pleasant:

```js
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
```

Now we can do the initial render:
```js
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
```
> End checkpoint 1 (`git checkout 39770d4`)

And hook up the search handler:
```js
function onSearchChange(e) {
  // Get the search query we should filter by
  const query = e.target.value;

  // Don't make a request without a search term
  if (!query.length) {
    const $searchResults = document.querySelector('.search-results');
    $searchResults.innerHTML = '';

    return;
  }

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
```

Because we like our users, we'll also render a loading indicator while results are being fetched:
```
function onSearchChange(e) {
  ...
  // Add a loading indicator while the request is in progress
  const $searchResults = document.querySelector('.search-results');
  // Clear out the old list before we re-render
  $searchResults.innerHTML = 'Loading...';
  ...
}
```

> End checkpoint 2 (`git checkout 0f89c36`)

* What is our state?
* When does it change?
* What was tough about this implementation?
  * Lots of manual DOM interaction, ugh
  * Hard to know what the page will look like in any given state

## React

OK, here's where the "crash course" bit comes in:

### What is react?

A UI library built by Facebook. It's key features:
- component driven. Create components like <Button />, <Navbar />, <ItemCard />, and combine/reuse them however you want. Component driven design is awesome and has totally stuck.
- JSX, a friendly syntax for creating markup
- declarative rendering. Define what the UI should look like in certain states, and updates are now a pure data thing, not a dom thing.
  If you know the state, you know the rendered output.
- state management, specifically setState and top-down rendering.
- virtual DOM

### What do I need to know to use it?

- Creating and combining components
- JSX
- props and state
- setState
- creating event listeners

Start a new branch based off of master:
```
git checkout master
git checkout -b react-take-one
```

Similar to the last go-round, let's start with a static version. Modify `src/App.js` to look like the following:
```js
import React, { Component } from 'react';

// Newer versions of React prefer ES6 classes to create new React components
class App extends Component {
  // Every component must have a `render` method, which returns either a 
  // string or a valid virtual DOM structure
  render() {
    // This is JSX. The syntax is very close to HTML itself, with a few key differences
    // like `class` becoming `className`. 
    return (
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search..."
        />
        <ul className="search-results">
        </ul>
      </div>
    );
  }
}

export default App;
```
> End checkpoint 1 (`git checkout  6def9a3`)

Next we can set up the event listener for the search input, and render the search results.

```js
import React, { Component } from 'react';

// Newer versions of React prefer ES6 classes to create new React components
class App extends Component {
  // `constructor` is an ES6 class concept, not a React concept
  constructor(props) {
    super(props);

    // If you reference this inside an event handler, you'll need to bind
    // the handler in the constructor like we're doing here
    this.onSearchChange = this.onSearchChange.bind(this);

    // Because we'll now be getting some items back from the server, we need
    // to track them in local component state. If your component has state, it's
    // good to define an initial value here.
    this.state = {
      items: [],
    };
  }

  onSearchChange(e) {
    // Get the search term
    const query = e.target.value;

    // If the term is empty it means a user hit backspace and cleared out the
    // typeahead, so we can clear out the results and return early.
    if (!query.length) {
      this.setState({ items: [] });
      return;
    }

    // Update state so we can render a loading indicator
    this.setState({ isLoading: true });

    window
      .fetch(`http://localhost:3001/items?name_like=${query}`)
      .then(resp => resp.json())
      .then(resp => {
        // Update the items we're tracking in this component's state
        // via setState, and also mark the request as having completed.
        this.setState({ items: resp, isLoading: false });
      });
  }

  // Every component must have a `render` method, which returns either a
  // string or a valid virtual DOM structure
  render() {
    // This is JSX. The syntax is very close to HTML itself, with a few key differences
    // like `class` becoming `className`.
    return (
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search..."
          onChange={this.onSearchChange}
        />
        <ul className="search-results">
          {/* USing brackets are how we switch between JSX and normal JS */}
          {/* Every jsx element rendered in a loop needs a unique `key` property */}
          {this.state.items.map(item => (
            <li className="item" key={item.id}>
              <h3>{item.title}</h3>
              <div>Rating: {item.rating}</div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
```
> End checkpoint 2 (`git checkout 9591550`)

For bonus points, lets refactor `render` and add an empty state.

```js
...
  isEmpty() {
    return !this.state.items.length;
  }

  renderResults() {
    if (this.isEmpty()) {
      if (this.state.isLoading) {
        return <div>Loading...</div>;
      }

      return <div>No results!</div>;
    }

    // Using brackets are how we switch between JSX and normal JS
    // Every jsx element rendered in a loop needs a unique `key` property
    return this.state.items.map(item => (
      <li className="item" key={item.id}>
        <h3>{item.name}</h3>
        <div>Rating: {item.rating}</div>
      </li>
    ));
  }

  // Every component must have a `render` method, which returns either a
  // string or a valid virtual DOM structure
  render() {
    // This is JSX. The syntax is very close to HTML itself, with a few key differences
    // like `class` becoming `className`.
    return (
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search..."
          onChange={this.onSearchChange}
        />
        <ul className="search-results">
          {this.renderResults()}
        </ul>
      </div>
    );
  }
...
```

> End checkpoint 3


