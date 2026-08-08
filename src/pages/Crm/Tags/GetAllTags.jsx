import React, { useState } from 'react';
import Button from '../../../components/common/Button';
import CreateTagModal from './Modal/CreateTagModal';
import TagCard from './components/TagCard';
import { useTags } from '../../../hooks/useTags';
import { deleteTag } from '../../../services/CRM/Tags/DeleteTag';
import { toast } from 'react-toastify';
import { SearchInput } from '../../../components/common/SearchInput';

function GetAllTags() {
  const [isOpenModalCreateTag, setIsOpenModalCreateTag] = useState(false);
  const token = localStorage.getItem("Token");
  const [search, setSearch] = useState("");
  // 1. استخراج دالة التحديث (refetch) من الـ hook 
  // (تأكد أن الـ hook الخاص بك يرجع هذه الدالة، قد يكون اسمها mutate إذا كنت تستخدم SWR أو React Query)
  const { 
      data: tags = [], 
      refetch 
    } = useTags(token,search);

  // تم تغيير اسم الدالة إلى handleDelete كأفضل ممارسة في React
  async function handleDelete(id) {
    const res = await deleteTag(id,token);
    if (res.success) {
      toast.success(res.message, {
        position: "top-left",
        autoClose: 3000,
        className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
      });
      
      // 2. تحديث واجهة المستخدم بعد الحذف بنجاح
      if (refetch) {
        refetch();
      }
    } else {
      // من الجيد دائماً إظهار رسالة خطأ في حال فشل الحذف
      toast.error(res.message || "Failed to delete tag");
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-200 font-sans p-8 md:p-12" dir="ltr">
      <CreateTagModal
        isOpen={isOpenModalCreateTag} 
        onClose={() => setIsOpenModalCreateTag(false)}
        // 3. تمرير دالة التحديث للمودال لكي تتحدث القائمة فور إضافة تاج جديد
        onSuccess={refetch} 
      />
      
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="text-[#0D9EF2]">#</span> Tag Management System
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Organize and categorize support tickets and accounts for smarter, faster routing.
            </p>
          </div>
          <div className='flex gap-2'>
            <Button 
            onClick={() => setIsOpenModalCreateTag(true)}
            className="bg-[#0D9EF2] hover:bg-sky-500 text-white font-bold px-5 py-2.5 rounded-full transition ease-in text-sm shrink-0 shadow-lg shadow-[#0D9EF2]/20"
          >
            Create New Tag
          </Button>
           <SearchInput
                        placeholder={"Search About Tag name"} 
                        value={search} 
                        onChange={(val) => {
                        setSearch(val);
                    }} 
                  />
          </div>
        </header>

        {/* Educational Concept Box */}
        <section className="bg-[#101B22] border border-gray-800/80 rounded-3xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0D9EF2]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-start gap-4">
            <div className="bg-[#0F172A] p-3 rounded-2xl border border-gray-800 text-2xl text-[#0D9EF2]">
              💡
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">What are Tags & Why do we use them?</h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-4xl">
                Tags are dynamic, lightweight labels used to segment customers and tickets based on behavior, priority, or contract terms. 
                They empower your support team to filter workloads instantly and identify crucial accounts—like the <span className="text-[#0D9EF2] font-semibold">High Value</span> tag—ensuring key clients receive dedicated, high-priority assistance without delay.
              </p>
            </div>
          </div>
        </section>

        {/* Tags Grid Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Active Tags ({tags.length})
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tags.map((tag) => (
              <TagCard
                key={tag.id} 
                tag={tag} 
                onDelete={() => handleDelete(tag.id)}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default GetAllTags;