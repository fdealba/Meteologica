import React, { Component } from 'react';
// classes from css module for the clases to be unique
import classes from './Chart.module.css';
//Plotly for graph
import Plot from 'react-plotly.js';

class Chart extends Component {

  render() {
    //destructuring props
  	const { tempData, powData, time } = this.props;
    let chart = null;
    // if temp is present, then its a temperature chart, if not, a power chart.
    if (tempData) {
      chart = (
        <Plot
        className={classes.Chart}
        data={[
          {
            x: time,
            y: tempData,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'green', size: 5},
            line: {
              color: 'red',
              width: 1
            },
          }
        ]}
        layout={
          { width: '50%',
            height: '50%',
            title: 'Temperature',
            xaxis: {
              type: 'date',
              title: 'Time'
            },
            yaxis: {
              title: 'Temperature (ºC)'
            }
          }
        }
      />
    );
    } else {
        chart = (
        <Plot
        className={classes.Chart}
        data={[
          {
            x: time,
            y: powData,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'green', size: 5},
            line: {
              color: 'red',
              width: 1
            },
          }
        ]}
        layout={
          { width: '50%',
            height: '50%',
            title: 'Power Output',
            xaxis: {
              type: 'date',
              title: 'time'
            },
            yaxis: {
              title: 'Power Output (kWh)'
            }
          }
        }
      />
    );
    }
    return chart;
  }
}

export default Chart;
