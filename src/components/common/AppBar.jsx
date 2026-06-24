import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import Button from './Button'
import { Bell } from 'lucide-react'

function AppBar() {
  // مصفوفة لتجنب تكرار كود الروابط وتسهيل التعديل مستقبلاً
  const navLinks = [
    { to: "/main/system/stats", label: "Stats" },
    { to: "/main/system/employee", label: "Employees" },
    { to: "/main/system/tickets", label: "Tickets" },
    { to: "/main/system/departments", label: "Departments" },
    { to: "/main/system/roles", label: "Roles" },
  ];

  return (
    <nav className="flex justify-between items-center border-b-2 mb-10 border-[#1e293b] ">
      {/* قائمة الروابط */}
      <div className="flex gap-6 text-sm text-gray-400 items-center">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `rounded mb-4 py-1 px-4 transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      
      <Button className="py-1 px-4 mb-4 flex items-center justify-center">
        <Bell className="text-yellow-500 w-5 h-5" />
      </Button>
    </nav>
  )
}

export default AppBar