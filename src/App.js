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
    if (tempIndex == -1) tempIndex = this.handleUndefined(tempData);

    // Find Index of time now in power dataset
    let powerIndex = powData.findIndex(dataSet => {
      return dataSet.time === timenow
    })

    // if the index is undefined, execute a undefined handler for the Dataset to set index
    // to the most recent valid value previus to this one
    if (powerIndex == -1) powerIndex = this.handleUndefined(powData);


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
        return obj.time == formatedTime
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
      // append random yyyy-mm-dd for chart library to read it
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
          {/* Charts */}
              <Charts temperature={tempAvgs} power={powAvgs} powXAxis={powXAxis} tempXAxis={tempXAxis} />
          {/* Last Measurements */}
            <LastMeasurements temperature={lastTemp} power={lastPow}/>
          </Fragment> : <Spinner/> 
          
        }
      </Fragment>
    );  
  }
}

export default App;
