import React from 'react';

const TicketDetails= () => {
  return (
    <div className="min-h-screen bg-[#080C11] text-gray-200 font-sans">
      <div className="container mx-auto px-10 py-12">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border-2 border-[#1E88E5] rounded flex items-center justify-center">
              <div className="w-5 h-2 bg-[#1E88E5]"></div>
            </div>
            <h1 className="text-xl font-bold tracking-wider text-white">Support Portal</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="bg-[#151D29] border border-gray-800 rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-gray-800">
              Back to List
            </button>
            <div className="flex flex-col gap-0.5 cursor-pointer p-1">
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
            </div>
          </div>
        </header>

        <section className="mb-10">
          <div className="flex gap-2.5 mb-5">
            <span className="bg-[#153444] text-[#81D4FA] text-[10px] font-bold px-3 py-0.5 rounded uppercase tracking-wider">
              High Priority
            </span>
            <span className="bg-[#1E3A2E] text-[#66BB6A] text-[10px] font-bold px-3 py-0.5 rounded uppercase tracking-wider">
              Open
            </span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-5xl font-extrabold text-white">Ticket #8421</h2>
              <p className="text-gray-500 mt-2 text-base">Created on Oct 24, 2023 at 2:45 PM</p>
            </div>
            <button className="bg-[#00A3FF] text-white px-8 py-3 rounded-full text-base font-semibold hover:bg-blue-600 transition">
              Assign Agent
            </button>
          </div>
        </section>

        <section className="bg-[#111821] border border-gray-800 rounded-3xl p-10 flex items-center gap-10 mb-10">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Customer profile"
            className="w-48 h-48 rounded-full border-4 border-gray-800 object-cover"
          />
          <div className="flex-1 space-y-6">
            <div>
              <p className="text-[#00A3FF] text-xs font-bold tracking-widest uppercase mb-1.5">
                Customer Profile
              </p>
              <h3 className="text-3xl font-extrabold text-white">John Doe</h3>
              <p className="text-yellow-400 text-sm mt-1.5 flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 bg-yellow-400 rounded-sm"></span> Gold Tier Member • Since 2021
              </p>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-gray-300 text-base">
              <div className="flex items-center gap-3">
                <span className="text-xl">✉</span>
                <span>john.doe@example.com</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">📞</span>
                <span>+1 (555) 0123-4567</span>
              </div>
            </div>
          </div>
          <button className="bg-[#151D29] border border-gray-800 rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-gray-800 flex items-center gap-2">
            View Profile <span>↗</span>
          </button>
        </section>

        <div className="grid grid-cols-3 gap-10">
          <section className="col-span-2 space-y-10">
            <div className="bg-[#111821] border border-gray-800 rounded-3xl p-10">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl text-[#00A3FF]">📄</span>
                <h4 className="text-xl font-bold text-white uppercase tracking-wider">Issue Description</h4>
              </div>
              <p className="text-gray-300 leading-relaxed mb-8 text-base">
                The user is reporting a persistent sync error when attempting to connect the mobile application with the desktop dashboard. This occurs primarily on iOS devices running version 15.4 or higher.
              </p>
              <p className="text-gray-300 mb-4 text-base">Steps to reproduce:</p>
              <ul className="list-decimal list-inside space-y-3.5 text-gray-300 text-base">
                <li>Open mobile app on iOS 15.4+</li>
                <li>Navigate to 'Sync Settings'</li>
                <li>Tap 'Connect to Desktop'</li>
                <li>Scan QR code from desktop app</li>
                <li>Result: "Error 504: Handshake Failed"</li>
              </ul>
              <div className="flex gap-3 mt-10">
                {['#ios-issue', '#sync-error', '#mobile-app'].map(tag => (
                  <span key={tag} className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#111821] border border-gray-800 rounded-3xl p-10">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-2xl text-[#00A3FF]">📎</span>
                <h4 className="text-xl font-bold text-white uppercase tracking-wider">Attachments (2)</h4>
              </div>
              <div className="flex gap-5">
                {[
                  { name: 'SCREENSHOT_1.PNG', icon: '🖼' },
                  { name: 'LOG_REPORT.TXT', icon: '📄' }
                ].map(file => (
                  <div key={file.name} className="w-40 h-40 bg-[#151D29] border border-gray-800 rounded-xl p-5 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-[#1E88E5]">
                    <span className="text-5xl text-gray-600 group-hover:text-[#1E88E5]">{file.icon}</span>
                    <p className="text-gray-500 text-xs text-center font-mono break-all">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <aside className="space-y-10">
            <div className="bg-[#111821] border border-gray-800 rounded-3xl p-10">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Ticket Stats</h4>
              <div className="space-y-5 text-base">
                {[
                  { label: 'Time Open', value: '4h 22m' },
                  { label: 'Assigned To', value: 'Unassigned', isAgent: true },
                  { label: 'Source', value: 'Mobile App' }
                ].map(stat => (
                  <div key={stat.label} className="flex justify-between items-center pb-5 border-b border-gray-800/60 last:border-b-0 last:pb-0">
                    <span className="text-gray-500">{stat.label}</span>
                    <span className={`text-white font-semibold flex items-center gap-2 ${stat.isAgent ? 'text-gray-500 font-normal' : ''}`}>
                      {stat.isAgent && <div className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center text-[10px] text-gray-500">UA</div>}
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 bg-transparent border-2 border-dashed border-gray-800 text-gray-500 py-3 rounded-xl text-sm font-semibold hover:border-blue-800 hover:text-white transition">
                Modify Ticket
              </button>
            </div>

            <div className="bg-[#111821] border border-gray-800 rounded-3xl p-8 border-l-4 border-l-[#1E88E5]">
              <div className="flex gap-3">
                <span className="text-2xl text-[#1E88E5]">ⓘ</span>
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Internal Note</h4>
                  <p className="text-gray-400 text-base font-mono leading-relaxed">
                    "Known issue on v15.4. Check server-side logs for session handshake timeouts."
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;