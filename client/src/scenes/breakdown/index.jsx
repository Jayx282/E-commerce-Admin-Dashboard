import React from 'react'
import { Box } from '@mui/material'
import Header from 'component/Header'
import BreakdownChart from "component/BreakdownChart"

const Breakdown = () => {
  return <Box m="1.5rem 2.5rem">
      <Header title="BREAKDOWN CHART" subTitle="Breakdown of sales by category" />
      <Box mt="40px" height="75vh">
          <BreakdownChart/>
      </Box>
  </Box>
}

export default Breakdown