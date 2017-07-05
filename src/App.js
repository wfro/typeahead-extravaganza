import React, { Component } from 'react';

// Steps: set up the initial markup
// set up the event listener on the search input
// make the call with the search query
// Add a loading indicator
// which method makes it easier to see the different stats for this particular element?
// call setState with the response and render a list of items
// add an empty state

// Data vs. UI - break out data fetching/handling from presentation
//   instacart examples

class App extends Component {
  constructor(props) {
    super(props);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.state = {
      items: [],
    };
  }

  onSearchChange(e) {
    const query = e.target.value;

    if (!query.length) {
      this.setState({ items: [] });
      return;
    }

    this.setState({ isLoading: true });

    window
      .fetch(`http://localhost:3001/items?name_like=${query}`)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({ items: resp, isLoading: false });
      });
  }

  renderSearchResults() {
    return this.state.items.map(item => (
      <li className="item" key={item.id}>
        <h3>{item.name}</h3>
        <div>Rating: {item.rating}</div>
      </li>
    ));
  }

  renderResults() {
    if (!this.state.items.length) {
      if (this.state.isLoading) {
        return <div>Loading...</div>;
      }

      return <div>No results!</div>;
    }

    return this.renderSearchResults();
  }

  render() {
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
