import React, { Component } from 'react';
import YAML from 'yaml';

class App extends Component {
  state = { json: {} }

  componentDidMount() {
    this.readYAML('data.yml');
  }

  readYAML = (fileName) => {
    fetch(fileName)
    .then(response => response.text())
    .then(content => this.setState({ json: YAML.parse(content) }));
  }

  render() {
    const { json } = this.state;

    return(
      <p>
        {JSON.stringify(json, null, 2)}
      </p>
    );
  }
}

export default App;
