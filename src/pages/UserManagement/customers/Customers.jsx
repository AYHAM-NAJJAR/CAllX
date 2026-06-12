import React from "react";
import { useOutletContext } from "react-router-dom";
import menu from '../../assets/menu.png';
const Customers = () => {
  const { toggleSidebar} = useOutletContext();
  const customers = [
    { name: "Marcus Chen", company: "NovaStream Tech", tickets: 5 },
    { name: "Sarah Jenkins", company: "Lumina Designs", tickets: 2 },
    { name: "David Miller", company: "Aero Dynamics", tickets: 12 },
    { name: "Elena Rodriguez", company: "Solaris Energy", tickets: 3 },
    { name: "Robert Wilson", company: "Quantum Core", tickets: 8 },
    { name: "Dr. Mei Ling", company: "BioHealth Labs", tickets: 1 },
    { name: "Alex Thompson", company: "CodeBase Inc", tickets: 4 },
    { name: "Linda Garcia", company: "Global Logistics", tickets: 15 },
    { name: "Jordan Smith", company: "Urban Streams", tickets: 6 },
  ];

  return (
    <div className="bg-[#0b1019] min-h-screen p-8 text-white">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center justify-center gap-5">
          <img  onClick={toggleSidebar}   src={menu} className='w-8 h-8 cursor-pointer' alt="" />
          <div>
            <h1 className="text-3xl font-bold">Customer Directory</h1>
          <p className="text-gray-400 mt-1">
            Manage and monitor your enterprise customer accounts.
          </p>
          </div>
        </div>
        <button className="bg-blue-600 px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2">
          Add Customer
        </button>
      </header>

      <div className="flex items-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          className="flex-grow bg-[#111721] p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <div className="flex items-center gap-4">
          <select className="bg-[#111721] p-3 rounded-lg border border-gray-700">
            <option>Sort by: Recent</option>
          </select>
          <select className="bg-[#111721] p-3 rounded-lg border border-gray-700">
            <option>Status: All</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer, index) => (
          <div key={index} className="bg-[#111721] p-6 rounded-2xl border border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-600" />
              <div>
                <h3 className="text-lg font-semibold">{customer.name}</h3>
                <p className="text-gray-400 text-sm">{customer.company}</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">{customer.tickets} Tickets</p>
          </div>
        ))}
      </div>

      <footer className="flex items-center justify-between mt-12 text-sm text-gray-400">
        <p>Showing 1 to 9 of 142 customers</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-[#111721]">
            Previous
          </button>
          <button className="w-8 h-8 rounded-lg bg-blue-600 text-white font-semibold">
            1
          </button>
          <button className="w-8 h-8 rounded-lg hover:bg-[#111721]">2</button>
          <button className="w-8 h-8 rounded-lg hover:bg-[#111721]">3</button>
          <button className="px-3 py-1.5 rounded-lg border border-gray-700 hover:bg-[#111721]">
            Next
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Customers;