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
}

export default App;
