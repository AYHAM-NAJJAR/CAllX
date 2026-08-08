import React from 'react'
import { NavLink, useOutletContext } from 'react-router-dom'
import Button from './Button'
import { Bell, Menu } from 'lucide-react'

// دالة مساعدة للتحقق من وجود الصلاحية لدى المستخدم (مطابقة لنفس الدالة في SidebarAdmin)
const hasPermission = (requiredPermission) => {
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
  if (!requiredPermission) return true;
  if (Array.isArray(requiredPermission)) {
    return requiredPermission.some((perm) => permissions.includes(perm));
  }
  return permissions.includes(requiredPermission);
};

function AppBar() {
  const navLinks = [
    { 
      to: "/main/system/stats", 
      label: "Stats", 
      permission: "VIEW_ANALYTICS" 
    },
    { 
      to: "/main/system/employee", 
      label: "Employees", 
      permission: "MANAGE_USERS" 
    },
    { 
      to: "/main/system/tickets", 
      label: "Tickets", 
      permission: ["VIEW_ALL_TICKETS", "VIEW_ASSIGNED_TICKETS", "UPDATE_TICKET_STATUS", "ADD_NOTE"] 
    },
    { 
      to: "/main/system/departments", 
      label: "Departments", 
      permission: "VIEW_COMPANY_STRUCTURE" 
    },
    { 
      to: "/main/system/roles", 
      label: "Roles", 
      permission: "MANAGE_ROLES" 
    },
  ];

  // فلترة الروابط بناءً على صلاحيات المستخدم المخزنة في localStorage
  const visibleNavLinks = navLinks.filter((link) => hasPermission(link.permission));

  const context = useOutletContext() || {};
  const { toggleSidebar } = context;

  return (
    <nav className="flex items-center justify-between gap-4 border-b-2 border-[#1e293b] pb-3 mb-6 w-full overflow-x-auto custom-scrollbar">
      
      {/* القسم الأيسر: زر القائمة والروابط في محاذاة واحدة */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        
        {/* زر السايدبار */}
        <Button 
          onClick={toggleSidebar} 
          className="p-2 text-slate-300 hover:text-sky-400 rounded-lg transition-all shrink-0"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </Button>

        {/* قائمة الروابط المفلترة */}
        <div className="flex items-center gap-1 sm:gap-2">
          {visibleNavLinks.map((link) => (
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

    </nav>
  )
}

export default AppBar