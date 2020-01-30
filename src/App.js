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
    tempData: [],
    powData: [],
    tempAvgs: [],
    powAvgs: [],
    times: [], 
    time: ''
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
    setInterval(() => {
      this.setTime()
    },5000);
  }

  setData = (timenow) => {
    const { data } = this.state;
    const tempData = [...data.temperature.values];
    const powData = [...data.power.values];

    const tempIndex = tempData.findIndex(dataSet => {
      return dataSet.time == timenow
    });

    const powerIndex = powData.findIndex(dataSet => {
      return dataSet.time == timenow
    })

    this.setState(state => {
      const newTempData = tempData.slice(0, tempIndex);
      const newPowData = powData.slice(0, powerIndex);
      return {
        tempData: newTempData,
        powData: newPowData
      }
    })
    this.handleData();
  }

  handleDataTwo = () => {
    const { tempData } = this.state;


  }

  handleData = () => {
    const { tempData, powData } = this.state;
    let arr = [];
    let newarr = [];
    tempData.forEach((obj, index) => {
      if (index == 0) return;
      if (obj.time.endsWith('00')) {
        const minuteData = tempData.slice(index - 12, index);
        const sum = minuteData.reduce((acc, obj) => {
          return acc + obj.value;
        }, 0);
        const avg = sum/12;
        arr = [...arr, avg];    
      }
      if (obj.time.includes('00', 6)) {
        newarr = [...newarr, `2020-01-30 ${obj.time}`];
      }
      return arr
    })
    const final = arr.map(avg => {
      return avg/10 - 273.15;
    });


    this.setState({
      tempAvgs: final,
      times: newarr
    });


    // tempData.forEach(obj => {
    //   const time = obj.time.slice(-2)
    //   console.log(time.)
    //   // console.log(time);
      
    // })

    this.setLast();
  }

  setLast = () => {
    const { tempData, powData } = this.state;

    const temp = [...tempData];
    const pow = [...powData];

    const lastPObj = pow.pop();
    const lastTObj = temp.pop();

    const lastTemp = (lastTObj.value/10 - 273.15).toFixed(2);

    this.setState(state => {
      return {
        lastTemp: lastTemp,
        lastPow: lastPObj.value * 1000
      } 
    })
  }

  setTime = () => {
    // Get hours, minutes and seconds from date
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // round seconds to the nearest 5
    let seconds = date.getSeconds();
    seconds = Math.ceil(seconds / 5) * 5
    // add a 0 behind if less than 10
    const time = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    this.setData(time);

  }
  

  render() {

    // destructuring state
    const { data, time, lastTemp, lastPow, tempData, powData, tempAvgs, times } = this.state;
    return(
    // Using Fragment for Adjacent JSX
    // checking if data has loaded, if not, display Spinner
      <Fragment>
        { lastTemp && lastPow ?
          <Fragment>
          {/* Chart */}
          <Chart tempData={tempAvgs} powData={powData} time={times} />
          {/* Last Measurements */}
          <LastMeasurements temperature={lastTemp} power={lastPow}/>
          </Fragment> : <Spinner/>
        }
      </Fragment>
    );  
  }
}

export default App;
