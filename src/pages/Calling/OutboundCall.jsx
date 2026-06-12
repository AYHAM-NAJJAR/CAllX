import React, { useState } from 'react';

const OutboundCall = () => {
  const [dialedNumber, setDialedNumber] = useState('+9568');

  const recentTickets = [
    { id: 1, name: 'John Doe', number: '+95684455', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 2, name: 'Jane Smith', number: '+95684455', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 3, name: 'Robert Wilson', number: '+95684455', avatar: 'https://randomuser.me/api/portraits/men/62.jpg' },
  ];

  const dialPadKeys = [
    { key: '1', letters: '' }, { key: '2', letters: 'ABC' }, { key: '3', letters: 'DEF' },
    { key: '4', letters: 'GHI' }, { key: '5', letters: 'JKL' }, { key: '6', letters: 'MNO' },
    { key: '7', letters: 'PQRS' }, { key: '8', letters: 'TUV' }, { key: '9', letters: 'WXYZ' },
    { key: '*', letters: '' }, { key: '0', letters: '+' }, { key: '#', letters: '' },
  ];

  const handleKeyPress = (key) => {
    setDialedNumber(prev => prev + key);
  };

  return (
    <div className="min-h-screen bg-[#0A1016] text-gray-200 font-sans p-20">
      <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-800/60">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Make Call</h2>
        <div className="flex gap-4">
          <span className="text-xl text-gray-600 cursor-pointer p-2">🔔</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
        <section>
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-1.5">From Tickets</h3>
            <p className="text-gray-500 text-sm">Initiate a call from your recent ticket activities</p>
          </div>
          <div className="space-y-5">
            {recentTickets.map(ticket => (
              <div key={ticket.id} className="bg-[#111821] border border-gray-800 rounded-3xl p-6 flex items-center gap-5 hover:border-gray-700 transition">
                <img src={ticket.avatar} alt={ticket.name} className="w-16 h-16 rounded-full" />
                <div className="flex-1">
                  <p className="text-white font-bold text-lg mb-1">{ticket.name}</p>
                  <p className="text-gray-500 text-xs font-mono">{ticket.number}</p>
                </div>
                <button className="bg-[#12221A] border border-[#2BB673]/30 text-[#2BB673] px-6 py-2.5 rounded-full text-xs font-bold uppercase flex items-center gap-2.5 hover:bg-[#2BB673] hover:text-white transition">
                  <span className="text-lg">📞</span> CALL
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-1.5">New Customer</h3>
            <p className="text-gray-500 text-sm">Dial a manual number to start a new call</p>
          </div>
          <div className="bg-[#111821] border border-gray-800 rounded-3xl p-10 flex flex-col items-center">
            <p className="text-5xl font-mono font-extrabold text-white mb-10 tracking-widest">{dialedNumber}</p>
            <div className="grid grid-cols-3 gap-6 mb-10 w-full max-w-sm">
              {dialPadKeys.map(key => (
                <button
                  key={key.key}
                  onClick={() => handleKeyPress(key.key)}
                  className="group flex flex-col items-center justify-center aspect-square bg-transparent rounded-full border-2 border-transparent hover:border-gray-800 active:bg-gray-800"
                >
                  <span className="text-3xl font-bold text-white group-hover:text-[#38B6FF] transition">{key.key}</span>
                  {key.letters && <span className="text-[10px] text-gray-600 font-bold uppercase mt-1 group-hover:text-gray-400">{key.letters}</span>}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-5 w-full max-w-sm">
              <button 
              className="flex-1 bg-[#2BB673] text-white py-4 rounded-full text-base font-bold uppercase flex items-center justify-center gap-3.5 hover:bg-green-600 transition shadow-[0_0_20px_2px_rgba(43,182,115,0.2)]">
                <span className="text-xl">📞</span> CALL
              </button>
              <button
                onClick={() => setDialedNumber(prev => prev.slice(0, -1))}
                className="w-16 h-16 bg-[#151D29] border border-gray-800 rounded-full flex items-center justify-center text-gray-600 hover:text-white hover:border-gray-700 active:bg-gray-800 transition"
              >
                <span className="text-2xl">⌫</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OutboundCall;