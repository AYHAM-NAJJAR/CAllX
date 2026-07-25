import React from 'react'
import { NavLink, useOutletContext } from 'react-router-dom'
import Button from './Button'
import { Bell, Menu } from 'lucide-react'

function AppBar() {
  const navLinks = [
    { to: "/main/system/stats", label: "Stats" },
    { to: "/main/system/employee", label: "Employees" },
    { to: "/main/system/tickets", label: "Tickets" },
    { to: "/main/system/departments", label: "Departments" },
    { to: "/main/system/roles", label: "Roles" },
  ];

  // أضفنا القيمة الافتراضية للـ Context لتجنب الأخطاء في حال عدم التمرير
  const context = useOutletContext() || {};
  const { toggleSidebar } = context;

  return (
    <nav className="flex items-center justify-between gap-4 border-b-2 border-[#1e293b] pb-3 mb-6 w-full overflow-x-auto custom-scrollbar">
      
      {/* القسم الأيسر: زر القائمة والروابط في محاذاة واحدة */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        
        {/* زر السايدبار */}
        <Button 
          onClick={toggleSidebar} 
          className="p-2 text-slate-300 hover:text-sky-400  rounded-lg transition-all shrink-0"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </Button>

        {/* قائمة الروابط النافذة */}
        <div className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `whitespace-nowrap text-xs sm:text-sm font-medium py-1.5 px-3 sm:px-4 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/40'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* القسم الأيمن: زر الإشعارات */}
      <div className="shrink-0">
        <Button className="p-2 text-yellow-500 hover:bg-slate-800/60 rounded-lg transition-all flex items-center justify-center">
          <Bell className="w-5 h-5" />
        </Button>
      </div>

    </nav>
  )
}

export default AppBar