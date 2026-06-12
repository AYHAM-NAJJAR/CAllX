import React from 'react'
import { Link, NavLink } from 'react-router-dom'

function AppBar() {
  return (
    <nav className="flex justify-between items-center mb-8 border-b border-[#1e293b] pb-4">
        <div className="flex gap-6 text-sm text-gray-400">
            <NavLink
            to={"/main/system/employee"}
            className={({ isActive }) => 
              ` rounded ${isActive ? 'bg-blue-600 py-1 px-1 text-white' : 'text-gray-400 py-1 px-1'}`
            }
            >
              Employees
            </NavLink>
            
            <NavLink 
           className={({ isActive }) => 
              ` rounded ${isActive ? 'bg-blue-600 py-1 px-1 text-white' : 'text-gray-400 py-1 px-1'}`
            }
            to={"/main/system/tickets"}
            >
            Tickets
            </NavLink>
            <NavLink 
           className={({ isActive }) => 
              ` rounded ${isActive ? 'bg-blue-600 py-1 px-1 text-white' : 'text-gray-400 py-1 px-1'}`
            }
            to={"/main/system/departments"}
            >
            Departments
            </NavLink>
            <NavLink 
           className={({ isActive }) => 
              ` rounded ${isActive ? 'bg-blue-600 py-1 px-1 text-white' : 'text-gray-400 py-1 px-1'}`
            }
            to={"/main/system/roles"}
            >
            Roles
            </NavLink>
        </div>
        <div className="flex gap-4 text-xl"><span>🔔</span><span>⚙️</span></div>
      </nav>
  )
}

export default AppBar