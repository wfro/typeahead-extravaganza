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
        <input className="search-input" type="text" placeholder="Search..." />
        <ul className="search-results" />
      </div>
    );
  }
}

export default App;
