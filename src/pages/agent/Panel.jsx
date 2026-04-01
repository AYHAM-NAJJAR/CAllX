import React from 'react'
import SidBarAgent from '../../components/private/agent/SidBarAgent'
import { Outlet } from 'react-router-dom'

function Panel() {
  return (
    <div className='flex flex-row w-screen h-screen overflow-hidden bg-primary'>
      <SidBarAgent/>
      <div className='flex-1  mr-0 overflow-y-auto '>
        
      <Outlet/>
      </div>
    </div>
  )
}

export default Panel