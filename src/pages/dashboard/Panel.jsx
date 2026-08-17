import React, { useState } from 'react'
import SidBarAgent from '../../components/private/agent/SidBarAgent'
import { Outlet } from 'react-router-dom'
import SidBarAdmin from '../../components/common/SideBarAdmin';
import FloatingAgentTerminal from '../Calling/FloatingAgentTerminal';
import FloatingMakeCall from '../Calling/FloatingMakeCall';

function Panel() {
  // الحالة الافتراضية: true ليظهر السايد بار عند التحميل
  const [showSidebar, setShowSidebar] = useState(true);

  // حالات الاتصال العامة على مستوى التطبيق بالكامل
  const [isMakeCallOpen, setIsMakeCallOpen] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState("");

  const toggleSidebar = () => setShowSidebar(prev => !prev);

  // دالة عامة لفتح نافذة الاتصال من أي صفحة في التطبيق
  const handleGlobalCall = (phone, clientId) => {
    setSelectedNumber(phone);
    if (clientId) {
      localStorage.setItem("selectedClientId", clientId);
    }
    setIsMakeCallOpen(true);
  };

  return (
    <div className='flex flex-row w-screen h-screen overflow-hidden bg-primary'>
      {showSidebar && <div onClick={toggleSidebar} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />}
      
      {/* حاوية السايد بار في اللابتوب مع أنميشن العرض */}
      <div className={`
        fixed lg:static top-0 start-0 z-50 h-full
        transition-all duration-300 ease-in-out overflow-hidden
        ${showSidebar ? 'w-64' : 'w-0'} 
      `}>
        {/* العرض هنا ثابت (256px) لضمان عدم عصر المحتوى أثناء الحركة */}
        <div className="w-64 h-full">
           <SidBarAdmin isOpen={showSidebar} toggleSidebar={toggleSidebar} />
        </div>
      </div>

      {/* المحتوى الرئيسي: يتمدد تلقائياً بفضل flex-1 ونمرر من خلاله handleGlobalCall */}
      <div className='flex-1 h-full overflow-y-auto custom-scrollbar bg-primary'>
        <Outlet context={{ toggleSidebar, showSidebar, handleGlobalCall }} />
      </div>
      
      <FloatingAgentTerminal />

      {/* نافذة الاتصال المركزية التي تعمل في أي مكان ضمن التطبيق */}
      {isMakeCallOpen && (
        <FloatingMakeCall 
          onClose={() => setIsMakeCallOpen(false)} 
          number={selectedNumber} 
        />
      )}
    </div>
  )
}

export default Panel