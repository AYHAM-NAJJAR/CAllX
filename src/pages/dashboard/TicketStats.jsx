import React from 'react';
import CommonPieChart from '../../components/common/PieChart';
import { useTicketStats } from '../../hooks/useTicketStats';

export const TicketStats = ({ token }) => {
  const { data: responseData, isLoading, error } = useTicketStats(token);

  if (isLoading) return <div style={{ textAlign: 'center', padding: '20px', color: '#0F172A' }}>Loading...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Error fetching data</div>;

  // Extract internal object accurately
  const stats = responseData?.data || responseData;
  console.log(stats);
  if (!stats) return <div style={{ textAlign: 'center', padding: '20px', color: '#0F172A' }}>No data available</div>;

  return (
    <div style={{ padding: '20px', width: '100%' }}>
      <h2 style={{ fontSize: '18px', marginBottom: '16px', color: '#E2E8F0', textAlign: 'center', fontWeight: 'bold' }}>
        Ticket Statistics Dashboard (Total: {stats.totalTickets || 0})
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* Tickets by Category */}
        <div style={{ background: '#13222F', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', border: '1px solid #1D3547' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#E2E8F0', textAlign: 'center', fontWeight: '600' }}>Tickets by Category</h3>
          <CommonPieChart data={stats.ticketsByCategory} height={140} outerRadius={40} textColor="#0284C7" />
        </div>

        {/* Tickets by Department */}
        <div style={{ background: '#13222F', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', border: '1px solid #1D3547' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#E2E8F0', textAlign: 'center', fontWeight: '600' }}>Tickets by Department</h3>
          <CommonPieChart data={stats.ticketsByDepartment} height={140} outerRadius={40} textColor="#0284C7" />
        </div>

        {/* Tickets by User */}
        <div style={{ background: '#13222F', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', border: '1px solid #1D3547' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#E2E8F0', textAlign: 'center', fontWeight: '600' }}>Tickets by User</h3>
          <CommonPieChart data={stats.ticketsByUser} height={140} outerRadius={40} textColor="#0284C7" />
        </div>

        {/* Tickets by Location */}
        <div style={{ background: '#13222F', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', border: '1px solid #1D3547' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#E2E8F0', textAlign: 'center', fontWeight: '600' }}>Tickets by Location</h3>
          <CommonPieChart data={stats.ticketsByLocation} height={140} outerRadius={40} textColor="#0284C7" />
        </div>

        {/* Tickets by Date */}
        <div style={{ background: '#13222F', padding: '15px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', border: '1px solid #1D3547' }}>
          <h3 style={{ fontSize: '14px', marginBottom: '10px', color: '#E2E8F0', textAlign: 'center', fontWeight: '600' }}>Tickets by Date</h3>
          <CommonPieChart data={stats.ticketsByDate} height={140} outerRadius={40} textColor="#0284C7" />
        </div>

      </div>
    </div>
  );
};

export default TicketStats;