import React from 'react'
import { ResponsiveCirclePacking } from '@nivo/circle-packing'

const CircularPacking = ({data}) => {

  const parseData = (rawData) => {
    const children = [];
    if (rawData) {
      for (const [key, value] of Object.entries(data)) {
        children.push({ name: key, value });
      }
    }
    const chartData = {
      name: 'Tags',
      color: '#FFF',
      children,
    };
    return chartData;
  };

  return (
    <>
      <ResponsiveCirclePacking
        data={parseData(data)}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        id="name"
        value="value"
        colors={{ scheme: 'nivo' }}
        childColor={{ from: 'color', modifiers: [['brighter', 0.4]] }}
        padding={4}
        enableLabels={true}
        labelsFilter={function (e) { return 2 === e.node.depth }}
        labelsSkipRadius={10}
        labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.5]] }}
        // defs={[
        //   {
        //     id: 'lines',
        //     type: 'patternLines',
        //     background: 'none',
        //     color: 'inherit',
        //     rotation: -45,
        //     lineWidth: 5,
        //     spacing: 8,
        //   },
        // ]}
        fill={[{ match: { depth: 1 }, id: 'lines' }]}
      />
    </>
  )
}

export default CircularPacking;
