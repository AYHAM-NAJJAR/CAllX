import React from 'react'
import AppBar from '../../components/common/AppBar'
import { Outlet} from 'react-router-dom'

function System() {
 
  return (
    <div className='min-h-screen bg-[#0f172a] p-8 '>
        <header>
            <AppBar/>
            
        </header>
        <main>
            
            <Outlet/>
        </main>
    </div>
  )
}

export default System