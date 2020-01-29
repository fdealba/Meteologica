import React, { Component, Fragment } from 'react';
import YAML from 'yaml';
import Chart from './components/Chart/Chart';
import Spinner from './components/UI/Spinner/Spinner';
import LastMeasurements from './components/LastMeasurements/LastMeasurements';

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
    const { temperature, power } = data;

    return(
    // Using Fragment for Adjacent JSX
    // checking if data has loaded, if not, display Spinner
      <Fragment>
        {data.temperature ?
          <Fragment>
          {/* Chart */}
          <Chart temperature={temperature} power={power}/>
          {/* Last Measurements */}
          <LastMeasurements data={ data }/>
          </Fragment> : <Spinner/>
        }
      </Fragment>
    );
  }
}

export default App;
