import React from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  PhoneForwarded, 
  Clock, 
  Calendar, 
  Copy, 
  User, 
  ShieldAlert 
} from 'lucide-react';

function CallCard({ call, onClick }) {
  
  // دالة مساعدة لتحديد الأيقونة والألوان الخاصة بكل حالة
  const getStatusConfig = (status) => {
    switch (status) {
      case 'ACCEPTED':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
          dot: 'bg-emerald-400',
          icon: <PhoneCall className="w-3.5 h-3.5" />,
          glow: 'hover:shadow-emerald-500/5 hover:border-emerald-500/30'
        };
      case 'ENDED':
        return {
          bg: 'bg-slate-500/10 border-slate-500/20 text-slate-300',
          dot: 'bg-slate-400',
          icon: <PhoneOff className="w-3.5 h-3.5" />,
          glow: 'hover:shadow-slate-500/5 hover:border-slate-700'
        };
      case 'CANCELLED':
        return {
          bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
          dot: 'bg-rose-400',
          icon: <ShieldAlert className="w-3.5 h-3.5" />,
          glow: 'hover:shadow-rose-500/5 hover:border-rose-500/30'
        };
      case 'RINGING':
        return {
          bg: 'bg-[#0D9EF2]/10 border-[#0D9EF2]/20 text-[#0D9EF2] animate-pulse',
          dot: 'bg-[#0D9EF2]',
          icon: <Phone className="w-3.5 h-3.5 animate-bounce" />,
          glow: 'shadow-lg shadow-[#0D9EF2]/5 border-[#0D9EF2]/40'
        };
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
          dot: 'bg-slate-500',
          icon: <Phone className="w-3.5 h-3.5" />,
          glow: 'hover:border-slate-700'
        };
    }
  };

  const statusStyle = getStatusConfig(call.status);

  // دالة مساعدة لتنسيق الوقت بشكل رقمي مميز
  const formatDuration = (seconds) => {
    if (seconds === null || seconds === undefined) return '--:--';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };



  // تنظيف وتلوين الهويات بناءً على نوعها (نظام، عميل، أو عميل داخلي)
  const renderIdentity = (identity) => {
    if (!identity) return <span className="text-slate-500 italic">Unknown</span>;
    if (identity.toLowerCase() === 'system') {
      return <span className="text-[#0D9EF2] font-semibold tracking-wide">SYSTEM</span>;
    }
    if (identity.includes('@')) {
      const [name, domain] = identity.split('@');
      return (
        <span className="truncate block" title={identity}>
          <span className="text-slate-200 font-medium">{name}</span>
          <span className="text-slate-500 text-xs">@{domain}</span>
        </span>
      );
    }
    return <span className="text-slate-300 font-mono font-semibold text-sm">{identity}</span>;
  };

  return (
    <div onClick={onClick} className={`cursor-pointer bg-[#101B22] border border-slate-800/80 rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group ${statusStyle.glow}`}>
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-800/60">
        <div className="relative">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold block mb-0.5">Call Reference</span>
          <div className="flex items-center gap-1.5 group/id cursor-pointer" >
            <p className="font-mono text-xs text-slate-400 group-hover/id:text-slate-200 transition-colors truncate max-w-[140px]">
              {call.callId.split('-')[0]}...
            </p>
            
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={`flex items-center gap-1.5 px-3 py-1 border rounded-full text-[11px] font-bold tracking-wide shadow-sm ${statusStyle.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
          {statusStyle.icon}
          <span>{call.status}</span>
        </div>
      </div>

      {/* Communications / Parties Section */}
      

                <div className="relative z-10 bg-gradient-to-br from-[#0D9EF2]/10 via-slate-900/60 to-slate-900/90 border border-[#0D9EF2]/30 rounded-xl p-2.5 shadow-sm hover:border-[#0D9EF2]/50 transition-colors backdrop-blur-sm my-2">
            <div className="grid grid-rows-2 gap-3 relative">
                
                {/* Caller (FROM) */}
                <div className="border-r border-slate-800/80 pr-2">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                    <div className="p-1 rounded-md bg-[#0D9EF2]/10 text-[#0D9EF2]">
                    <User className="w-3 h-3" />
                    </div>
                    <span>FROM (Caller)</span>
                </div>
                <div className="text-sm truncate">
                    {renderIdentity(call.callerIdentity)}
                </div>
                </div>
                
                {/* Callee (TO) */}
                <div className="pl-1">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                    <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                    <User className="w-3 h-3" />
                    </div>
                    <span>TO (Callee)</span>
                </div>
                <div className="text-sm truncate">
                    {renderIdentity(call.calleeIdentity)}
                </div>
                </div>

            </div>
            </div>


      {/* Footer Section / Metadata */}
      <div className="grid grid-cols-2 gap-2 pt-3 mt-2 border-t border-slate-800/40 text-xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-slate-800/40 rounded-lg text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 block">Timestamp</span>
            <p className="text-slate-300 font-mono text-[11px]">
              {new Date(call.createdAt).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 justify-self-end">
          <div className="p-1.5 bg-slate-800/40 rounded-lg text-slate-400 group-hover:text-[#0D9EF2]/70 transition-colors">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">Duration</span>
            <p className="text-[#0D9EF2] font-mono font-bold text-[13px] tracking-wide">
              {formatDuration(call.durationSeconds)}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default CallCard;