import { Link } from "react-router-dom";
import PerformaneCards from "./PerformaneCards";

const SidBarAgent = () => {
return (
    <div className="flex flex-col w-64 h-full gap-5 p-3 text-white bg-secondary">      
      {/* Header */}
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
  );
};

export default SidBarAgent;