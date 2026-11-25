import React from 'react'
import Chart from 'src/components/chart'

interface Props {
  height?: number;
  showRanges?: boolean;
}

const Performance = ({ height, showRanges }: Props) => {
  return (
    <>
        <Chart height={height} showRanges={showRanges} />
    </>
  )
}

export default Performance
