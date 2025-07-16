import React from 'react'
import DashboardPage from './page'

const Dashboardlayout = () => {
  return (
    <div className='px-5'>
      <h1 className='text-6xl font-bold gradient-title ml-5'>Dashboard</h1>

      {/* dashboard page */}
      <DashboardPage/>
    </div>
  )
}

export default Dashboardlayout
