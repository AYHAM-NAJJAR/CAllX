import { Link } from "react-router-dom";
import PerformaneCards from "./cards/PerformaneCards";
import Select from 'react-select';

const SidBarAgent = ({ isOpen,toggleSidebar }) => {
console.log(isOpen);
const options = [
  { value: 'active', label: 'Active' },
  { value: 'away', label: 'Away' },
  { value: 'away', label: 'On Break' },
];
return (

    <>
   <div 
        onClick={toggleSidebar} 
        className={`fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <div
      
        className={`
          /* خصائص مشتركة */
          h-full bg-secondary text-white p-5 flex flex-col gap-5 z-50
          transition-transform duration-300 ease-in-out
          overflow-y-auto custom-scrollbar
          /* الموبايل: ينزلق فوق المحتوى */
          fixed top-0 left-0 w-full
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          
          /* اللابتوب: يصبح جزءاً من تدفق الصفحة */
          lg:static lg:translate-x-0 lg:w-full
        `}
      >
      
      <div className="flex flex-col items-center mb-6">
        <img className="w-12 h-12 mb-2 bg-gray-500 rounded-full" />
        <h1 className="text-lg font-bold">agent Name</h1>
        <Select 
        options={options}
        styles={customStyles}
          components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null, // يشيل الخط كمان
        }}
        />
      </div>

      <div className="mb-4">
        <p className="mb-2 text-sm">PERFORMANCE STATS</p>
        <div className="grid grid-cols-2 gap-5">
        <PerformaneCards title={"Total Calls"} number={12} />
        <PerformaneCards title={"Tickets"} number={12} />
        <PerformaneCards title={"Total Time"} number={12} />
        <PerformaneCards title={"Rate"} number={12} />
        
        </div>
      </div>
        
      
        <ul className="flex  flex-col flex-1 gap-3 w-full ">
        <p>NAVIGATION</p>
        <li className="p-2 transition-all duration-300 ease-linear rounded hover:bg-[#1E293B]">
          <Link className=" w-full block " to={"/main"} >
          Dashboard
          </Link></li>
        <li className="w-full p-2 transition-all duration-300 ease-linear rounded hover:bg-[#1E293B]">
            <Link
            className=" w-full block "
            to={"/main/tickets"}
            >Tickets</Link>
        </li>
      </ul>
    </div>
    </>
  );
};
const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: "#1E293B",
    border: "none", // إزالة الحدود تماماً
    boxShadow: "none", // إزالة ظل التركيز الافتراضي الأزرق
    minHeight: "30px",
  }),
  // القيمة المختارة التي تظهر في الـ Select
  singleValue: (base) => ({
    ...base,
    color: "#4ade80", // هنا نغير اللون (مثلاً أخضر فاتح مثل حالة active لديك)
    fontWeight: "bold",
  }),
  menu: (base) => ({
    ...base,
    width:"100px" ,
    
    backgroundColor: "#1E293B",
    border: "1px solid #334155", // إضافة حدود خفيفة للقائمة
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#2563EB" // اللون عند الاختيار داخل القائمة
      : state.isFocused
      ? "#374151" // اللون عند مرور الماوس
      : "#1E293B",
    color: "white",
    cursor: "pointer",
  }),
  
};


export default SidBarAgent;