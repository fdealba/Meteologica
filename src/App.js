import React, { Component, Fragment } from 'react';

// Yaml for parsing
import YAML from 'yaml';

// Components
import Charts from './components/Charts/Charts';
import Spinner from './components/UI/Spinner/Spinner';
import LastMeasurements from './components/LastMeasurements/LastMeasurements';

class App extends Component {
  state = {
    data: {},
    lastTemp: null,
    lastPow: null,
    tempAvgs: [],
    tempXAxis: [],
    powAvgs: [],
    powXAxis: [],
    // amount of records we want to read
    dataRecords: 80
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
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // round seconds to the nearest 5
    let seconds = date.getSeconds();
    if (seconds !== 0) seconds = Math.ceil(seconds / 5) * 5;
    if (seconds === 60) {
      seconds = 0;
      minutes += 1;
    }

    // add a 0 behind if less than 10
    const time = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    this.setData(time);
  }

  setData = (timenow) => {

    // Destructuring the data from state, and setting a variable for temperature data and power data.
    const { data, dataRecords } = this.state;
    const tempData = [...data.temperature.values];
    const powData = [...data.power.values];

    // Find index of time now in temperature dataset
    let tempIndex = tempData.findIndex(dataSet => {
      return dataSet.time === timenow
    });

    // if the index is undefined, execute a undefined handler for the Dataset to set index
    // to the most recent valid value previus to this one
    if (tempIndex === -1) tempIndex = this.handleUndefined(tempData);

    // Find Index of time now in power dataset
    let powerIndex = powData.findIndex(dataSet => {
      return dataSet.time === timenow
    })

    // if the index is undefined, execute a undefined handler for the Dataset to set index
    // to the most recent valid value previus to this one
    if (powerIndex === -1) powerIndex = this.handleUndefined(powData);


    // Extract 80 values the datasets
    const newTempData = tempData.slice(tempIndex - dataRecords, tempIndex);
    const newPowData = powData.slice(powerIndex - dataRecords, powerIndex);

    // Pass the filtered data to a data handler
    this.handleData(newTempData, newPowData);
  }

  handleUndefined = (data) => {
    let time = new Date();
    let lastIndex = null;

    // Search for the last valid value index to put in the graph before the undefined
    while (!lastIndex) {
      // removing 5 seconds from time until finding a valid value
      time = time - 5000;
      let newTime = new Date(time);
      let seconds = newTime.getSeconds();
      let minutes = newTime.getMinutes();
      let hours = newTime.getHours();

      //round seconds to nearest 5
      if (seconds !== 0) seconds = Math.ceil(seconds / 5) * 5;
      if (seconds === 60) {
        seconds = 0;
        minutes += 1;
      }

      // format time in order to be compareable with obj.time
      const formatedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`

      const found = data.findIndex(obj => {
        return obj.time === formatedTime
      })
      // if value is found, set it equal to last index, if not, keep looping
      if (found > 1) lastIndex = found;
    }
    //Return last valid Index
    return lastIndex;
  }



  handleData = (tempData, powData) => {
    const { dataRecords } = this.state;
    // Calculate temperature averages for every minute
    const tempAvgs = this.setTemperatureAvgs(tempData);
    // Calculate power averages for every minute
    const powAvgs = this.setPowerAvgs(powData);

    // Get time for given data to put in the X axis of the chart
    const tempXAxis = this.setXAxis(tempData);
    const powXAxis = this.setXAxis(powData);

    // Get last temperature/power values to pass into last measurements components
    const temp = tempData.pop();
    const power = powData.pop();
    const lastTemp = (temp.value/10 - 273.15).toFixed(2);
    const lastPow = (parseFloat(power.value.replace(',', '.')) * 1000).toFixed(0);

    // Save all the relevant data in state, to pass into components later on
    this.setState(state => {
      const newDataRecords = dataRecords + 1;
      return {
        powAvgs: powAvgs,
        powXAxis: powXAxis,
        tempAvgs: tempAvgs,
        tempXAxis: tempXAxis,
        lastTemp: lastTemp,
        lastPow: lastPow,
        dataRecords: newDataRecords
      };
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
        const minuteArray = tempData.slice(index - 13, index);
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
        const newArray = powData.slice(index - 13, index);
        // Calculate the sum of every value of the array of Objects
        const powerSum = newArray.reduce((acc, obj) => {
          return acc + parseFloat(obj.value.replace(',', '.')) * 1000
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

  setXAxis = (data) => {
    let timeValues = [];
    // Iterate over every dataset
    data.forEach((obj) => {
    // Check if its a round minute
      if (obj.time.endsWith('00')) {
      // push the time values into an array created beforehand
      // append random yyyy-mm-dd for chart library to be able to read it
        timeValues = [...timeValues, `2020-01-30 ${obj.time}`];
      }
    })
    // return the array of times
    return timeValues;
  }


  render() {
    // destructuring state to avoid chunks of code
    const { lastTemp, lastPow, powAvgs, tempAvgs, powXAxis, tempXAxis } = this.state;
    return(
    // Using Fragment for Adjacent JSX
    // Checking if last values 'lastTemp && lastPow' exist yet, if not, display Spinner
      <Fragment>
        { lastTemp && lastPow ?
          <Fragment>
            <div style={{ width: '100%'}}><svg id="logo-inverted" viewBox="0 0 681.37 56.5"><path d="M223.74 1l-9.55 23.64c-1.54 3.75-3.08 8.19-4.27 11.95h-.17c-1.11-3.76-2.82-8.2-4.36-11.95L195.83 1h-9.47l-3.93 54.45h11.1L195 36.28c.26-3.08.34-6.06.34-9.65h.17a103.8 103.8 0 0 0 3.5 9.82l8 19.12h5.63l7.85-19.12c1.2-2.9 2.56-6.49 3.59-9.82h.17c-.09 3.41.17 6.83.34 9.65l1.41 19.2h11.27L233.22 1zm37.49 32.12h12.12v-9.9h-12.12V10.84h14.94V1.02h-26.63v54.46h28.42v-9.82h-16.73V33.12zm24.25-22.54h12.89v44.9h11.78V10.67h12.8V1.02h-37.47v9.56zm59.33 22.54h12.13v-9.9h-12.13V10.84h14.94V1.02h-26.63v54.46h28.43v-9.82h-16.74V33.12zM394.59 0c-13 0-23.65 11.1-23.65 28.17 0 17.24 10.68 28.33 23.65 28.33s23.64-11.09 23.64-28.33C418.23 11.1 407.48 0 394.59 0zm0 45.84c-6.15 0-11.61-7.09-11.61-17.67 0-10.42 5.46-17.59 11.61-17.59s11.61 7.17 11.61 17.59c0 10.58-5.55 17.67-11.61 17.67zm43.89-44.82h-7.6v54.46h26.54v-6.57h-18.94V1.02zm48.58-.93c-12.29 0-22.88 11-22.88 28.08 0 17.24 10.59 28.16 22.88 28.16s22.79-10.92 22.79-28.16c0-17.07-10.59-28.08-22.79-28.08zm0 49.42c-7.68 0-15.11-8.2-15.11-21.34s7.43-21.26 15.11-21.26c7.51 0 15 8.2 15 21.26s-7.49 21.34-15 21.34zm57.03-15.03h9.39V47.2c-1.8 1.54-4.7 2.39-8.37 2.39-8.36 0-16.21-7.77-16.21-21.25 0-13.66 8-21.43 16.55-21.43a18.84 18.84 0 0 1 11.44 4l1.2-6.91c-3-2.22-7.68-3.92-13.66-3.92-11.61 0-23.21 10.07-23.21 28.16 0 17.84 11.26 28.08 23.47 28.08 6.74 0 11.95-1.79 15.87-5.54V28.25h-16.47zm31.34-33.45h7.68v54.46h-7.68zm45.84 5.88a17.8 17.8 0 0 1 10.24 3.16l1.11-6.83A23.36 23.36 0 0 0 620.25.09C608.64.09 597 10.16 597 28.25s11.44 28.08 23.22 28.08c5.37 0 8.44-.85 11-2.39l1.28-7.51c-2.48 1.8-6.32 3.08-11.27 3.08-8.71 0-16.47-7.77-16.47-21.26s7.98-21.34 16.51-21.34zm42.09-6.4h-3.93l-18 55h7.35l4.52-14.25h16l4.44 14.25h7.68zm-8 34.66l4.09-13.23a52.26 52.26 0 0 0 1.71-6.66h.17a53.32 53.32 0 0 0 1.8 6.66l4 13.23zM9.73 27C-7.3 39.26 2 55.17 7.9 55.29c0 0 1-.12 138.47 0C149.28 55.29 41.69 3.92 9.73 27zm99.76 1.84c9.32 3.45 16.75 6.34 22.7 8.82a19.19 19.19 0 1 0-23.11-9z" fill="#fff"></path></svg></div>
            <Charts temperature={tempAvgs} power={powAvgs} powXAxis={powXAxis} tempXAxis={tempXAxis} />
            <LastMeasurements temperature={lastTemp} power={lastPow}/>
          </Fragment> : <Spinner/>

        }
      </Fragment>
    );
  }
}

export default App;
