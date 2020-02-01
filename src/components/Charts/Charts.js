import React from 'react';

// Component
import Chart from './Chart/Chart';

const charts = ({
  temperature, power, tempXAxis, powXAxis
}) => {
  return (
    <div style={{
      display: 'flex', width: '100%', justifyContent: 'space-around', flexWrap: 'wrap'
    }}
    >
      {/* instances of the last measurements for power/temperature */}
      <Chart tempData={temperature} time={tempXAxis} />
      <Chart powData={power} time={powXAxis} />
    </div>
  );
};

export default charts;
