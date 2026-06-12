import React from 'react';

const MainDashboard = () => {
  // بيانات كاملة (Mock Data)
  const mockStats = {
    activeRooms: 2,
    totalParticipants: 5,
    rooms: [
      { roomName: "my-phone-room", currentParticipants: ["UserA", "UserB"], startedAt: "2026-05-20T10:00:00Z", peakParticipants: 3, totalJoins: 4 },
      { roomName: "support-room", currentParticipants: ["AgentA", "UserC", "UserD"], startedAt: "2026-05-20T10:05:00Z", peakParticipants: 3, totalJoins: 3 }
    ]
  };

  const mockSummary = { totalSessions: 42, totalMinutesRecorded: 318.5 };

  const mockHistory = [
    { id: 1, roomName: "my-phone-room", startedAt: "2026-05-20T10:00:00Z", endedAt: "2026-05-20T10:45:00Z", peakParticipants: 3, totalJoins: 5, status: "COMPLETED", durationSeconds: 2700 },
    { id: 2, roomName: "support-room", startedAt: "2026-05-20T11:00:00Z", endedAt: "2026-05-20T11:20:00Z", peakParticipants: 2, totalJoins: 2, status: "COMPLETED", durationSeconds: 1200 }
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] p-8 text-white">
      <h1 className="text-2xl font-bold mb-8 border-l-4 border-[#0D9EF2] pl-4">Main Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard title="Active Rooms" value={mockStats.activeRooms} />
        <StatCard title="Participants" value={mockStats.totalParticipants} />
        <StatCard title="Total Sessions" value={mockSummary.totalSessions} color="text-emerald-400" />
        <StatCard title="Total Minutes" value={mockSummary.totalMinutesRecorded} color="text-emerald-400" />
      </div>

      {/* Live Rooms & History Section */}
      <div className="space-y-12">
        {/* Live Rooms Section */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Live Rooms Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockStats.rooms.map((room) => (
              <div key={room.roomName} className="bg-[#101B22] p-6 rounded-lg border border-gray-700">
                <h3 className="text-[#0D9EF2] font-bold text-lg mb-4">{room.roomName}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                  <p>Participants: <span className="text-white font-bold">{room.currentParticipants.length}</span></p>
                  <p>Peak: <span className="text-white font-bold">{room.peakParticipants}</span></p>
                  <p>Total Joins: <span className="text-white font-bold">{room.totalJoins}</span></p>
                  <p>Started: <span className="text-white font-bold">{new Date(room.startedAt).toLocaleTimeString()}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full History Table */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Complete History Log</h2>
          <div className="bg-[#101B22] rounded-lg border border-gray-700 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-800 text-gray-400 uppercase">
                <tr>
                  <th className="p-4">Room</th>
                  <th className="p-4">Start Time</th>
                  <th className="p-4">End Time</th>
                  <th className="p-4">Duration (sec)</th>
                  <th className="p-4">Peak</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {mockHistory.map((h) => (
                  <tr key={h.id}>
                    <td className="p-4">{h.roomName}</td>
                    <td className="p-4">{new Date(h.startedAt).toLocaleTimeString()}</td>
                    <td className="p-4">{new Date(h.endedAt).toLocaleTimeString()}</td>
                    <td className="p-4">{h.durationSeconds}</td>
                    <td className="p-4">{h.peakParticipants}</td>
                    <td className="p-4 text-emerald-400 font-bold">{h.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// مكون صغير للكروت لتقليل تكرار الكود
const StatCard = ({ title, value, color = "text-white" }) => (
  <div className="bg-[#101B22] p-6 rounded-xl border border-gray-700 shadow-lg">
    <h3 className="text-gray-400 text-sm uppercase tracking-wider">{title}</h3>
    <p className={`text-4xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

export default MainDashboard;