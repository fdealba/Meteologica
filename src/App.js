import React, { Component, Fragment } from 'react';

// Yaml for parsing
import YAML from 'yaml';

// Components
import Chart from './components/Chart/Chart';
import Spinner from './components/UI/Spinner/Spinner';
import LastMeasurements from './components/LastMeasurements/LastMeasurements';

class App extends Component {
  state = {
    data: {},
    lastTemp: null,
    lastPow: null,
    tempAvgs: [],
    powAvgs: [],
    times: [],
  }

  componentDidMount() {
    this.readYAML('data.yml');
    this.handleChart();
  }

  // Read Yaml and store it in state.
  readYAML = (fileName) => {
    fetch(fileName)
    .then(response => response.text())
    .then(content => this.setState({ data: YAML.parse(content) }));
  }

  handleChart = () => {
    // Update time and fetch data every 5 seconds
    setInterval(() => {
      this.setTime()
    },5000);
  }

    setTime = () => {
    const date = new Date();
    // Get hours, minutes and seconds from date
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // round seconds to the nearest 5
    let seconds = date.getSeconds();
    seconds = Math.ceil(seconds / 5) * 5

    // add a 0 behind if less than 10
    const time = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

    this.setData(time);
  }

  setData = (timenow) => {
    // Destructuring the data from state, and setting a variable for temperature data and power data.
    const { data } = this.state;
    const tempData = [...data.temperature.values];
    const powData = [...data.power.values];

    // Find index of time now in temperature dataset
    const tempIndex = tempData.findIndex(dataSet => {
      return dataSet.time === timenow
    });

    // Find Index of time now in power dataset
    const powerIndex = powData.findIndex(dataSet => {
      return dataSet.time === timenow
    })

    // Extract 80 values the datasets
    const newTempData = tempData.slice(tempIndex - 80, tempIndex);
    const newPowData = powData.slice(powerIndex - 80, powerIndex);

    // Pass the filtered data to a data handler
    this.handleData(newTempData, newPowData);
  }



  handleData = (tempData, powData) => {
    // Calculate temperature averages for every minute
    const tempAvgs = this.setTemperatureAvgs(tempData);
    // Calculate power averages for every minute
    const powAvgs = this.setPowerAvgs(powData);
    // Get time for given data to put in the X axis of the chart
    const timeX = this.setXAxis(powData);

    // Get last temperature/power values to pass into last measurements components
    const temp = tempData.pop();
    const power = powData.pop();
    const lastTemp = (temp.value/10 - 273.15).toFixed(2);
    const lastPow = (parseFloat(power.value) * 1000).toFixed(0);

    // Save all the relevant data in state, to pass into components later on
    this.setState({
      powAvgs: powAvgs,
      tempAvgs: tempAvgs,
      times: timeX,
      lastTemp: lastTemp,
      lastPow: lastPow
    })
  }

  setTemperatureAvgs = (tempData) => {
    let tempAvgs = [];
    // Iterate over every dataset with its index
    tempData.forEach((obj, index) => {
      // If its the first value exit, we want at least 12 datasets for a minute
      if (index === 0) return;
      // Check if its a round minute
      if (obj.time.endsWith('00')) {
      // store 12 elements before it in an array
        const minuteArray = tempData.slice(index - 12, index);
      // Calculate the sum of every value of the array of Objects
        const tempSum = minuteArray.reduce((acc, obj) => {
          return acc + (obj.value/10 - 273.15);
        }, 0);
      // divide the sum by the array length to get the average
        const avg = tempSum/minuteArray.length;
      // push the avg value into an array created beforehand
        tempAvgs = [...tempAvgs, avg];
      }
    })
    // return the array of averages
    return tempAvgs;
  }

  setPowerAvgs = (powData) => {
    let powAvgs = [];
    // Iterate over every dataset with its index
    powData.forEach((obj, index) => {
      // If its the first value exit, we want at least 12 datasets for a minute
      if (index === 0 ) return;
      // Check if its a round minute
      if (obj.time.endsWith('00')) {
        // store 12 elements before it in an array
        const newArray = powData.slice(index - 12, index);
        // Calculate the sum of every value of the array of Objects
        const powerSum = newArray.reduce((acc, obj) => {
          return acc + parseFloat(obj.value) * 1000
        }, 0);
        // divide the sum by the array length to get the average
        const average = powerSum/newArray.length;
        // push the avg value into an array created beforehand
        powAvgs = [...powAvgs, average]
      }
    })
    // return the array of averages
    return powAvgs;
  }

  setXAxis = (powData) => {
    let timeValues = [];
    // Iterate over every dataset
    powData.forEach((obj) => {
    // Check if its a round minute
      if (obj.time.endsWith('00')) {
      // push the time values into an array created beforehand
      // append random yyyy-mm-dd for chart library to read it
        timeValues = [...timeValues, `2020-01-30 ${obj.time}`];
      }
    })
    // return the array of times
    return timeValues;
  }


  render() {
    // destructuring state to avoid chunks of code
    const { lastTemp, lastPow, powAvgs, tempAvgs, times } = this.state;
    return(
    // Using Fragment for Adjacent JSX
    // Checking if last values 'lastTemp && lastPow' exist yet, if not, display Spinner
      <Fragment>
        { lastTemp && lastPow ?
          <Fragment>
          {/* Chart */}
            <div>
              <Chart tempData={tempAvgs} time={times} />
              <Chart powData={powAvgs} time={times} />
            </div>
          {/* Last Measurements */}
            <LastMeasurements temperature={lastTemp} power={lastPow}/>
          </Fragment> : <Spinner/>
        }
      </Fragment>
    );
  }
}

export default App;
