import React, { Component } from 'react';
// classes from css module for the clases to be unique
import { Measurement } from './LastMeasurement.module.css';

class LastMeasurement extends Component {

  componentDidMount() {
  }

  render() {
    {/* destructuring props */}
    const { temperature, power } = this.props;

    return (
        <div className={ Measurement }>
        {/* Check if its power or temperature before rendering*/}
        { power ?
        <h3>Power: <br/><span>{power} KWH</span></h3> :
        <h3>Temperature: <br/><span>{temperature} ºC</span></h3>}
        </div>
      )
  }
}

export default LastMeasurement;
