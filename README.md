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
npm stsrt
# or
# yarn start
```

Start the REST API
```
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

Because we're rendering everything client-side, we'll need to make a whole bunch of HTML elements. Start with a helper function to make the rest of the process a little bit more pleasant:

```
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
```
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


### React
