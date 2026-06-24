import React from 'react';

const AuditTable = ({ data }) => {
  
  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        {/* استخدام اللون الأساسي للخلفية في الرأس */}
        <thead className="text-xs uppercase text-white" style={{ backgroundColor: '#0F172A' }}>
          <tr>
            <th className="px-6 py-3">Ticket ID</th>
            <th className="px-6 py-3">Action</th>
            <th className="px-6 py-3">User</th>
            <th className="px-6 py-3">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="" style={{ backgroundColor: '#101B22', color: '#ffffff' }}>
              <td className="px-6 py-4 font-medium">{item.ticketId}</td>
              <td className="px-6 py-4">
                {/* استخدام اللون المخصص للزر */}
                <span 
                  className="px-2 py-1 rounded text-xs text-white" 
                  style={{ backgroundColor: '#0D9EF2' }}
                >
                  {item.action}
                </span>
              </td>
              <td className="px-6 py-4">{item.user}</td>
              <td className="px-6 py-4">{formatDate(item.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditTable;