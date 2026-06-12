import React from 'react'
import { NavLink } from 'react-router-dom'

function TicketBar() {
  return (
    <nav className="flex mb-8">
        <div className="flex justify-evenly items-center flex-row gap-6 text-sm text-gray-400">
            
            <NavLink
            to={"/main/system/tickets/structure/createField"} 
            className={({ isActive }) => 
              ` rounded-full ${isActive ? 'bg-blue-600 py-1 px-1.5 text-white' : 'text-gray-400 py-1 px-1'}`
            }
            >
            Create Fields Difention
            </NavLink>
            
            {/* تم إضافة خاصية to هنا */}
            <NavLink 
           to={"/main/system/tickets/structure/single"} // 👈 عدل هذا المسار حسب ما هو موجود في App.js
           className={({ isActive }) => 
              ` rounded-full ${isActive ? 'bg-blue-600 py-1.5 px-1 text-white' : 'text-gray-400 py-1 px-1'}`
            }
            >
            Get Single Field Definition
            </NavLink>

            {/* تم إضافة خاصية to هنا */}
            <NavLink 
           to={"/main/system/tickets/structure/allFields"} 
           className={({ isActive }) => 
              ` rounded-full ${isActive ? 'bg-blue-600 py-1 px-1.5 text-white' : 'text-gray-400 py-1 px-1'}`
            }
            >
            Get All  Fields
            </NavLink>

            <NavLink 
           to={"/main/system/tickets/structure/active"} 
           className={({ isActive }) => 
              ` rounded-full ${isActive ? 'bg-blue-600 py-1 px-1.5 text-white' : 'text-gray-400 py-1 px-1'}`
            }
            >
            Get All Active Fields
            </NavLink>

            <NavLink 
           to={"/main/system/tickets/structure/inactive"} 
           className={({ isActive }) => 
              ` rounded-full ${isActive ? 'bg-blue-600 py-1 px-1.5 text-white' : 'text-gray-400 py-1 px-1'}`
            }
            >
            Get All InActive  Fields
            </NavLink>
            
        </div>
        
      </nav>
  )
}

export default TicketBar