import React from 'react'
import { NavLink } from 'react-router-dom'

function TicketBar() {
  return (
    <nav className="w-full mb-6 sm:mb-8">
      {/* 
        - التمرير الأفقي الناعم (overflow-x-auto) للشاشات الصغيرة منعاً لاقتطاع النص
        - تحسين التباعد (paddings) والأحجام لتتناسب مع الموبايل واللابتوب
      */}
      <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2 custom-scrollbar text-xs sm:text-sm text-gray-400 whitespace-nowrap">
        
        <NavLink
          to={"/main/system/tickets/structure/createField"} 
          className={({ isActive }) => 
            `rounded-full px-3.5 py-1.5 transition-colors shrink-0 ${
              isActive 
                ? 'bg-blue-600 text-white font-medium shadow-sm' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`
          }
        >
          Create Fields Definition
        </NavLink>
        
        

        <NavLink 
          to={"/main/system/tickets/structure/allFields"} 
          className={({ isActive }) => 
            `rounded-full px-3.5 py-1.5 transition-colors shrink-0 ${
              isActive 
                ? 'bg-blue-600 text-white font-medium shadow-sm' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`
          }
        >
          Get All Fields
        </NavLink>

        <NavLink 
          to={"/main/system/tickets/structure/active"} 
          className={({ isActive }) => 
            `rounded-full px-3.5 py-1.5 transition-colors shrink-0 ${
              isActive 
                ? 'bg-blue-600 text-white font-medium shadow-sm' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`
          }
        >
          Get All Active Fields
        </NavLink>

        <NavLink 
          to={"/main/system/tickets/structure/inactive"} 
          className={({ isActive }) => 
            `rounded-full px-3.5 py-1.5 transition-colors shrink-0 ${
              isActive 
                ? 'bg-blue-600 text-white font-medium shadow-sm' 
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`
          }
        >
          Get All InActive Fields
        </NavLink>
        
      </div>
    </nav>
  )
}

export default TicketBar