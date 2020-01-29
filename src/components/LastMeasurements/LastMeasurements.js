import React from 'react';
import LastMeasurement from './LastMeasurement/LastMeasurement';
import { Measurements } from './LastMeasurements.module.css';

const lastMeasurements = ({ data }) => {
  const { power, temperature } = data;

  return (
    <div className={ Measurements }>
      {/* instances of the last measurements for power/temperature */}
      <LastMeasurement data={ power }/>
      <LastMeasurement data={ temperature }/>
    </div>
    );
}

export default lastMeasurements;
