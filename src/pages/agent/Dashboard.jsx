import React from 'react';

const Dashboard = () => {
  const inboundCalls = [
    { name: '+956 844 55', sub: 'United States', wait: '40s', vip: false },
    { name: 'Sarah Jenkins', sub: '+1 202 555 0109', wait: '1m 12s', vip: true },
    { name: '+44 7700 900504', sub: 'United Kingdom', wait: '2m 45s', vip: false },
    { name: 'Mike Ross', sub: 'Incoming via IVR', wait: '5s', vip: false },
  ];

  const outboundCalls = [
    { name: '+1 415 555 0122', sub: 'Callback Request', duration: '4m 30s' },
    { name: 'John Doe', sub: 'Follow-up Call', duration: '12m 10s' },
    { name: 'Alice Cooper', sub: 'Sales Lead', duration: '2m 15s' },
    { name: 'Tech Support', sub: 'Internal Referral', duration: '8m 05s' },
  ];

  return (
    <div className="min-h-screen bg-[#0f111a] text-white p-8 font-sans">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold">Call Center</h1>
          <p className="text-gray-400 text-sm">Manage active and incoming customer inquiries</p>
        </div>
        <button className="bg-[#22c55e] hover:bg-[#1eb054] text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 transition-all">
          <span>+</span> Make Call
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Inbound Calls Column */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-blue-400 font-semibold flex items-center gap-2">
              <span className="text-lg">↙</span> Inbound Calls (4)
            </h2>
            <span className="text-gray-500 text-xs tracking-widest uppercase">Active Queue</span>
          </div>

          <div className="space-y-3">
            {inboundCalls.map((call, idx) => (
              <div key={idx} className="bg-[#161b2a] border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 bg-[#1c2438] rounded-full flex items-center justify-center text-blue-400">
                      👤
                    </div>
                    {call.vip && (
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 bg-yellow-500 text-[10px] px-1 rounded font-bold text-black">
                        VIP
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{call.name}</div>
                    <div className="text-xs text-gray-500">{call.sub}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Wait Time</div>
                  <div className="text-cyan-400 font-bold">{call.wait}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Outbound Calls Column */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-orange-400 font-semibold flex items-center gap-2">
              <span className="text-lg">↗</span> Outbound Calls (4)
            </h2>
            <span className="text-gray-500 text-xs tracking-widest uppercase">Recent Logs</span>
          </div>

          <div className="space-y-3">
            {outboundCalls.map((call, idx) => (
              <div key={idx} className="bg-[#161b2a] border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1c2438] rounded-full flex items-center justify-center text-gray-400">
                    👤
                  </div>
                  <div>
                    <div className="font-medium">{call.name}</div>
                    <div className="text-xs text-gray-500">{call.sub}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Duration</div>
                  <div className="font-bold text-gray-300">{call.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;