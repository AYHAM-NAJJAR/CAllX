import React, { useState } from 'react';
import Button from '../../../components/common/Button'; // تأكد من مسار الاستيراد الصحيح
import CampaignCard from './components/CampaignCard';


function ShowAllCampaigns() {
  // استخدام البيانات الثابتة (Mock Data) بناءً على الريسبونس المرسل
  const [campaigns, setCampaigns] = useState([
    {
      "id": 3,
      "name": "Q2 Cold Outreach - Dubai",
      "type": "COLD_CALL",
      "status": "ACTIVE",
      "startDate": "2026-04-01",
      "endDate": "2026-06-30",
      "leadCount": 214
    },
    {
      "id": 4,
      "name": "SaaS Product Launch - Europe",
      "type": "EMAIL_MARKETING",
      "status": "ACTIVE",
      "startDate": "2026-05-15",
      "endDate": "2026-08-15",
      "leadCount": 850
    },
    {
      "id": 5,
      "name": "Inbound Follow-up Q3",
      "type": "DIRECT_CALL",
      "status": "PENDING",
      "startDate": "2026-07-01",
      "endDate": "2026-09-30",
      "leadCount": 95
    }
  ]);

  const handleDeleteCampaign = (id) => {
    console.log(`Deleting campaign with ID: ${id}`);
    // منطق الحذف الفعلي مستقبلاً:
    // setCampaigns(campaigns.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-200 font-sans p-8 md:p-12" dir="ltr">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="text-[#0D9EF2]">⚡</span> Campaign Tracker
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Monitor, schedule, and optimize outreach campaigns to scale lead acquisition.
            </p>
          </div>
          <Button 
            className="bg-[#0D9EF2] hover:bg-sky-500 text-white font-bold px-5 py-2.5 rounded-full transition ease-in text-sm shrink-0 shadow-lg shadow-[#0D9EF2]/20"
          >
            + Create New Campaign
          </Button>
        </header>

        {/* Educational Concept Box */}
        <section className="bg-[#101B22] border border-gray-800/80 rounded-3xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0D9EF2]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-start gap-4">
            <div className="bg-[#0F172A] p-3 rounded-2xl border border-gray-800 text-2xl text-[#0D9EF2]">
              🎯
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">What are Campaigns & Why are they critical?</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-4xl">
                Campaigns act as strategic, time-bound initiatives designed to convert specific target groups using tailored channels. 
                Whether managing high-volume cold calling pipelines like <span className="text-[#0D9EF2] font-semibold">Q2 Cold Outreach - Dubai</span> or mass email funnels, breaking workloads into campaigns allows you to track targeted performance metrics, control start/end boundaries, and audit incoming lead counts dynamically.
              </p>
            </div>
          </div>
        </section>

        {/* Campaigns Grid Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              All Running Campaigns ({campaigns.length})
            </h2>
          </div>

          {/* Grid View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id} 
                campaign={campaign} 
                onDelete={() => handleDeleteCampaign(campaign.id)}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default ShowAllCampaigns;