import React from 'react';
// classes from css module for the clases to be unique
import { Measurement } from './LastMeasurement.module.css';

const lastMeasurement = ({ temperature, power }) => {
    return (
        <div className={ Measurement }>
        {/* Check if its power or temperature before rendering*/}
        { power ?
        <h3>Last Power: <br/><span style={{ color: 'red' }}>{power} KW</span></h3> :
        <h3>Last Temperature: <br/><span style={{ color: 'blue' }}>{temperature} ºC</span></h3>}
        </div>
      )
}

export default lastMeasurement;
