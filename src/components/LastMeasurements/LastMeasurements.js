import React from 'react';
//Component
import LastMeasurement from './LastMeasurement/LastMeasurement';
// classes from css module for the clases to be unique
import { Measurements } from './LastMeasurements.module.css';

const lastMeasurements = ({ temperature, power }) => {

  return (
    <div className={ Measurements }>
      {/* instances of the last measurements for power/temperature */}
      <LastMeasurement temperature={ temperature }/>
      <LastMeasurement power={ power }/>
    </div>
    );
}

export default lastMeasurements;
