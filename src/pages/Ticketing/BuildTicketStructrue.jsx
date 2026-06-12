import React from 'react'
import TicketBar from './components/TicketBar'
import { Outlet } from 'react-router-dom' // 1. استيراد Outlet

function BuildTicketStructrue() {
  return (
    <div>
        {/* شريط التنقل العلوي الخاص بالتذكر */}
        <TicketBar/>
        
        {/* 2. هذا المكان الذي سيتم فيه عرض المكونات الأبناء تلقائياً بناءً على الرابط */}
        <div className="mt-4"> 
          <Outlet />
        </div>
    </div>
  )
}

export default BuildTicketStructrue