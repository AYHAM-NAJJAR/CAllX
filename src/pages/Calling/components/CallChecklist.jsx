import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Smile, HelpCircle, MessageSquare, FileEdit } from 'lucide-react';

const DEFAULT_GUIDELINES = [
  { id: 1, title: 'Welcome & Platform Intro', desc: 'Greet customer and state platform name', icon: Smile },
  { id: 2, title: 'Inquire Call Reason', desc: 'Ask how you can assist the customer today', icon: HelpCircle },
  { id: 3, title: 'Active Listening', desc: 'Allow customer sufficient space to explain', icon: MessageSquare },
  { id: 4, title: 'Create Ticket', desc: 'Fill in details in the Ticket Creator form', icon: FileEdit }
];

const CallChecklist = ({ items = DEFAULT_GUIDELINES }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: -10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-[#111726] border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-5 h-fit lg:sticky lg:top-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          <h2 className="text-lg font-bold text-white tracking-wide">Call Guidelines</h2>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-3 py-1 rounded-full">
          {items.length} Rules
        </span>
      </div>

      {/* Guideline Items */}
      <div className="space-y-3.5 pt-1">
        {items.map((item, index) => {
          const ItemIcon = item.icon;
          return (
            <div
              key={item.id || index}
              className="flex items-start gap-3.5 p-3.5 rounded-xl border border-slate-800 bg-[#182032]/70 text-slate-200 select-none"
            >
              {/* Step Number Badge */}
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-sm font-bold shrink-0 mt-0.5 font-mono">
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {ItemIcon && <ItemIcon className="w-4 h-4 text-cyan-400 shrink-0" />}
                  <h4 className="text-sm font-bold text-white">
                    {item.title}
                  </h4>
                </div>
                <p className="text-xs mt-1 leading-relaxed text-slate-300">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CallChecklist;