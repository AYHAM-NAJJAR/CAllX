import { Link } from "react-router-dom";
import PerformaneCards from "./PerformaneCards";

const SidBarAgent = ({ isOpen,toggleSidebar }) => {
console.log(isOpen);
return (

    <>
   <div 
        onClick={toggleSidebar} 
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <div
        className={`
          /* خصائص مشتركة */
          h-full bg-secondary text-white p-5 flex flex-col gap-5 z-50
          transition-transform duration-300 ease-in-out
          
          /* الموبايل: ينزلق فوق المحتوى */
          fixed top-0 left-0 w-64 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          
          /* اللابتوب: يصبح جزءاً من تدفق الصفحة */
          lg:static lg:translate-x-0 lg:w-full
        `}
      >
      
      <div className="flex flex-col items-center mb-6">
        <img className="w-12 h-12 mb-2 bg-gray-500 rounded-full" />
        <h1 className="text-lg font-bold">agent Name</h1>
        <span className="text-sm text-green-400">active</span>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-sm">performance stats</p>
        <PerformaneCards title={"L:L:L"} />
        <PerformaneCards title={"L:L:L"} />
        <PerformaneCards title={"L:L:L"} />
      </div>
        <ul className="">
            <p>STATUS CONTROL</p>
            <li><Link className="">on active</Link></li>
            <li><Link className="">away</Link></li>
            <li><Link className="">onBreak</Link></li>
        </ul>
      
        <ul className="flex  flex-col flex-1 gap-3 overflow-y-auto w-full ">
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

export default SidBarAgent;