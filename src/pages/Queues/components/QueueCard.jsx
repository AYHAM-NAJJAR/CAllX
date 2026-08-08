// QueueCard.jsx
import React from 'react';
import { UserCheck, Clock, ShieldCheck, ShieldAlert, Key } from 'lucide-react';

function QueueCard({ queue }) {
  const { name, queueKey, waitingCount, active, createdAt } = queue;

  // تنسيق التاريخ لشكل مقروء
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div 
      style={{
        backgroundColor: '#101B22', // secondary color
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600', color: '#FFFFFF' }}>
            {name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '13px' }}>
            <Key size={14} color="#0D9EF2" />
            <span>{queueKey}</span>
          </div>
        </div>
        
        {/* Status Badge */}
        <span style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: active ? '#10B981' : '#EF4444',
        }}>
          {active ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
          {active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '0 0 16px 0' }} />

      {/* Content Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Waiting Count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8' }}>
            <UserCheck size={18} />
            <span style={{ fontSize: '14px' }}>Waiting Customers</span>
          </div>
          <span style={{ 
            fontSize: '16px', 
            fontWeight: '700', 
            color: waitingCount > 0 ? '#0D9EF2' : '#FFFFFF',
            backgroundColor: waitingCount > 0 ? 'rgba(13, 158, 242, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            padding: '2px 8px',
            borderRadius: '6px'
          }}>
            {waitingCount}
          </span>
        </div>

        {/* Created At */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8' }}>
            <Clock size={18} />
            <span style={{ fontSize: '14px' }}>Created Date</span>
          </div>
          <span style={{ fontSize: '14px', color: '#CBD5E1', fontWeight: '500' }}>
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button style={{
        marginTop: '20px',
        width: '100%',
        backgroundColor: '#0D9EF2', // customButton color
        color: '#FFFFFF',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 16px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0b84cb'}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0D9EF2'}
      >
        Manage Queue
      </button>
    </div>
  );
}

export default QueueCard;