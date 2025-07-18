import React, { Suspense } from 'react'
import DashboardPage from './page'
import { BarLoader } from 'react-spinners'

const Dashboardlayout = () => {
  return (
    <div className='px-5'>
      <h1 className='text-6xl font-bold gradient-title ml-5'>Dashboard</h1>

      {/* dashboard page */}
      <Suspense fallack= {<BarLoader className = "mt-4" width = {"100%"} color='#8765ea' />}>
      <DashboardPage/>
      </Suspense>
    </div>
  )
}

export default Dashboardlayout
