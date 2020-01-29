import React, { Component } from 'react';
import YAML from 'yaml';
import Chart from './components/Chart/Chart';
import Spinner from './components/UI/Spinner/Spinner';
import LastMeasurements from './components/LastMeasurements/LastMeasurements';
// import classes from './App.module.css';

class App extends Component {
  state = { data: {} }

  componentDidMount() {
    this.readYAML('data.yml');
  }

  // Read Yaml and store it in state.
  readYAML = (fileName) => {
    fetch(fileName)
    .then(response => response.text())
    .then(content => this.setState({ data: YAML.parse(content) }));
  }

  render() {
    const { data } = this.state;
    return(
      <div>
        {/* checking if data has loaded, if not, display Spinner/spinner */}
        {data.temperature ? <Chart temperature={data.temperature} power={data.power}/> : <Spinner/>}
        {/* Last Measurements */}
        {data.temperature ? <LastMeasurements data={ data }/> : <Spinner /> }
      </div>
    );
  }
}

export default App;
