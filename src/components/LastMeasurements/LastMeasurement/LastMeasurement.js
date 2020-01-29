import React, { Component } from 'react';
import { Measurement } from './LastMeasurement.module.css';

class LastMeasurement extends Component {

  componentDidMount() {
    console.log(this.props.data)
  }

  render() {
    {/* destructuring props */}
    const { data } = this.props;
    const { unit, values } = data;
    const { value } = values[0];

    return (
        <div className={ Measurement }>
        {/* Check if its power or temperature before rendering*/}
        {unit === "MW" ?
        <h3>Power: <br/><span>{(value * 1000)} KW</span></h3> :
        <h3>Temperature: <br/><span>{(273.15 - value/10).toFixed(2)} ºC</span></h3>}
        </div>
      )
  }
}

export default LastMeasurement;
