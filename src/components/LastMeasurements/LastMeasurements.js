import React from 'react';
import LastMeasurement from './LastMeasurement/LastMeasurement';
import { Measurements } from './LastMeasurements.module.css';

const lastMeasurements = ({ data }) => {
  return (
    <div className={ Measurements }>
      <LastMeasurement data={ data.power }/>
      <LastMeasurement data={ data.temperature }/>
    </div>
    );
}

export default lastMeasurements;
