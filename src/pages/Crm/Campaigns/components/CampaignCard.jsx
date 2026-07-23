import React from 'react';
import Button from '../../../../components/common/Button'; // تأكد من صحة مسار الاستيراد لديك

function CampaignCard({ campaign, onDelete ,onUpdate }) {
  // دالة لمساندة تنسيق النصوص مثل تحويل COLD_CALL إلى Cold Call
  const formatText = (text) => text?.replace('_', ' ')?.toLowerCase();

  return (
    <div className="bg-[#101B22] border border-gray-800/60 rounded-2xl p-6 hover:border-[#0D9EF2]/40 transition group flex flex-col justify-between min-h-[220px]">
      
      {/* الجزء العلوي: العنوان والحالة */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs text-gray-500 font-mono block">ID: #{campaign.id}</span>
            <h4 className="text-xl font-extrabold text-white group-hover:text-[#0D9EF2] transition capitalize">
              {campaign.name}
            </h4>
          </div>
          
          {/* شارة الحالة الاستاتيكية */}
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
            campaign.status === 'ACTIVE' 
              ? 'bg-[#1E3A2E] text-[#66BB6A]' 
              : 'bg-gray-800 text-gray-400'
          }`}>
            {campaign.status}
          </span>
        </div>

        {/* نوع الحملة والتفاصيل الإضافية */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-[#0F172A] border border-gray-800 text-[#0D9EF2] px-2.5 py-1 rounded-md font-semibold tracking-wide capitalize">
            📢 {formatText(campaign.type)}
          </span>
        </div>
      </div>

      {/* المنتصف: التواريخ ومؤشر الوقت */}
      <div className="mt-4 space-y-1.5 text-xs text-gray-400 border-t border-gray-800/40 pt-4 font-mono">
        <div className="flex justify-between">
          <span>Start Date:</span>
          <span className="text-gray-300">{campaign.startDate}</span>
        </div>
        <div className="flex justify-between">
          <span>End Date:</span>
          <span className="text-gray-300">{campaign.endDate}</span>
        </div>
      </div>

      {/* الجزء السفلي: العداد وأزرار التحكم */}
      <div className="mt-4 pt-4 border-t border-gray-800/40 flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 text-xs">Total Leads:</span>
          <span className="text-white font-black bg-[#0F172A] px-2.5 py-0.5 rounded-md border border-gray-800 font-mono">
            {campaign.leadCount}
          </span>
        </div>
        
        {/* زر الحذف المنسق */}
       <div className='flex items-center justify-between gap-2'>
         <Button 
          onClick={onDelete}
          className="bg-red-500/10 hover:bg-red-600 border border-red-500/20 hover:border-red-600 text-red-400 hover:text-white px-4 py-1.5 text-xs font-bold rounded-full transition duration-200"
        >
          Delete
        </Button>
        <Button 
          onClick={onUpdate}
          className="bg-customButton hover:bg-sky-400 border border-red-500/20  text-white  px-4 py-1.5 text-xs font-bold rounded-full transition duration-200"
        >
          Edit
        </Button>
       </div>
      </div>
       
    </div>
  );
}

export default CampaignCard;