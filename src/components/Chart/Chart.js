import React, { Component } from 'react';
import classes from './Chart.module.css';

class Chart extends Component {
  componentDidMount() {
    console.log(this.props)
  }

  render() {
    return (
      <div className={ classes.Chart }>
      </div>
    );
  }
}

export default Chart;
