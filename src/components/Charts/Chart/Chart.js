import React from 'react';
//Plotly for graph
import Plot from 'react-plotly.js';

const chart = ({tempData, powData, time}) => {
  let chart = null;
    // if temp is present, then its a temperature chart, if not, a power chart.
  if (tempData) {
      chart = (
        <Plot
        data={[
          {
            x: time,
            y: tempData,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'blue', size: 8},
            line: {
              color: 'blue',
              width: 1
            },
          }
        ]}
        layout={
          { 
            width: 600,
            height: 350,
            title: 'Temperature',
            xaxis: {
              type: 'date',
              title: 'Time (Minutes)'
            },
            paper_bgcolor: 'rgb(255, 255, 255)',
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
        data={[
          {
            x: time,
            y: powData,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red', size: 8},
            line: {
              color: 'red',
              width: 1
            },
          }
        ]}
        layout={
          { width: 600,
            height: 350,
            title: 'Power Output',
            xaxis: {
              type: 'date',
              title: 'Time (Minutes)'
            },
            paper_bgcolor: 'rgb(255, 255, 255)',
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

export default chart;
