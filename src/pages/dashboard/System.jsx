import React from 'react'
import AppBar from '../../components/common/AppBar'
import { Outlet, useOutletContext } from 'react-router-dom'
import Button from '../../components/common/Button';
import { Menu } from 'lucide-react';

function System() {
  // 1. استلام القيم من Panel الأب
  const { toggleSidebar, showSidebar } = useOutletContext();

  return (
    <div className='min-h-screen bg-[#0f172a] p-8 '>
        <header className="flex items-center ">
           
            <div className="w-full lg:flex-1">
              <AppBar/>
            </div>
        </header>
        
        <main className="">
            {/* 2. التعديل الأساسي هنا: تمرير الـ context لأبناء System */}
            <Outlet context={{ toggleSidebar, showSidebar }} />
        </main>
    </div>
  )
}

export default System