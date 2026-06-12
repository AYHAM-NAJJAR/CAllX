import React, { useState } from 'react'
import SidBarAgent from '../../components/private/agent/SidBarAgent'
import { Outlet } from 'react-router-dom'
import SidBarAdmin from '../../components/common/SideBarAdmin';

function Panel() {
  // الحالة الافتراضية: true ليظهر السايد بار عند التحميل
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => setShowSidebar(prev => !prev);

  return (
    <div className='flex flex-row w-screen h-screen overflow-hidden bg-primary'>
      
      {/* حاوية السايد بار في اللابتوب مع أنميشن العرض */}
      <div className={`
        transition-all duration-300 ease-in-out overflow-hidden
        ${showSidebar ? 'w-64' : 'w-0'} 
        hidden lg:block
      `}>
        {/* العرض هنا ثابت (256px) لضمان عدم عصر المحتوى أثناء الحركة */}
        <div className="w-60 h-full">
           <SidBarAdmin isOpen={showSidebar} toggleSidebar={toggleSidebar} />
        </div>
      </div>

{/*      
      <div className="lg:hidden">
         <SidBarAgent isOpen={showSidebar} toggleSidebar={toggleSidebar} />
      </div> */}

      {/* المحتوى الرئيسي: يتمدد تلقائياً بفضل flex-1 */}
      <div className='flex-1 h-full overflow-y-auto custom-scrollbar bg-primary'>
        <Outlet context={{ toggleSidebar, showSidebar }} />
      </div>
    </div>
  )
}

export default Panel