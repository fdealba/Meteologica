import React, { Component } from 'react';
import classes from './Chart.module.css';
//Plotly for graph
import Plot from 'react-plotly.js';

class Chart extends Component {

  render() {
    //destructuring props
  	const { tempData, powData, time } = this.props;

    return (
        <Plot
        className={classes.Chart}
        data={[
          { 
            x: time,
            y: [...tempData],
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'green', size: 1},
            fill: 'tozeroy',
            line: {
              color: 'red',
              width: 1
            },
          }
          // {
          //   y: [...tempData],
          //   type: 'scatter',
          //   mode: 'lines+markers',
          //   marker: {color: 'brown'}, 
          // }
        ]}
        layout={ 
          { width: '50%',
            height: '50%',
            title: 'Power Output/Temperature',
            xaxis: {
              type: 'time',
              title: 'Minutes'
            },
            yaxis: {
              title: 'Temperature (ºC)'
            }
          } 
        }
      />
    );
  }
}

export default Chart;
