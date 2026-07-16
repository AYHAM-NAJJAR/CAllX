import React, { useState } from 'react';

export default function Documentation() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const chapters = [
    {
      id: 'dashboard',
      title: 'لوحة المؤشرات الفورية',
      subTitle: 'Live Dashboard & Activity',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <div className="bg-[#0F172A] text-white p-6 rounded-2xl border border-slate-800">
            <span className="text-[#0D9EF2] text-xs font-bold tracking-wide uppercase">الفصل الأول</span>
            <h2 className="text-2xl font-bold mt-1 text-white">لوحة التحكم والمؤشرات اللحظية</h2>
            <p className="text-slate-300 mt-2 text-sm leading-relaxed">
              شاشة الإدارة الفورية والذكية التي تمنحك عيناً يقظة على كل مكالمة، عميل، ووكيل داخل المنصة لحظة بلحظة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800/60 shadow-sm">
              <h3 className="font-bold text-white text-lg mb-2">مراقبة الحالة اللحظية (Live Stats)</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                لا حاجة لتحديث الصفحة يدوياً. تتدفق البيانات والنسب مئوية فوراً لتعرض لك المكالمات النشطة، والعملاء المنتظرين في الطوابير، وحالة تواجد الوكلاء (متاح، مشغول، استراحة).
              </p>
            </div>
            <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800/60 shadow-sm">
              <h3 className="font-bold text-white text-lg mb-2">الاستجابة التشغيلية السريعة</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                بناءً على المؤشرات اللحظية، يمكن للمشرفين والمدراء إعادة توزيع المهام وتخصيص وكلاء إضافيين لدعم طوابير الاتصال التي تشهد ضغطاً غير متوقع بشكل فوري.
              </p>
            </div>
          </div>

          <div className="bg-[#0D9EF2]/10 border-r-4 border-[#0D9EF2] p-4 rounded-l-xl">
            <h4 className="font-bold text-[#0D9EF2] text-sm mb-1">💡 نصيحة الإدارة الفعالة</h4>
            <p className="text-slate-200 text-sm">
              احتفظ بصفحة لوحة المؤشرات مفتوحة دائماً في شاشات المراقبة الرئيسية داخل صالة مركز الاتصال لضمان التنسيق البصري الفوري لكافة أعضاء الفريق.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'structure',
      title: 'الهيكل التنظيمي والصلاحيات',
      subTitle: 'Company Structure & RBAC',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <div className="bg-[#0F172A] text-white p-6 rounded-2xl border border-slate-800">
            <span className="text-[#0D9EF2] text-xs font-bold tracking-wide uppercase">الفصل الثاني</span>
            <h2 className="text-2xl font-bold mt-1 text-white">تنظيم حوكمة الشركة وإدارة الأدوار</h2>
            <p className="text-slate-300 mt-2 text-sm leading-relaxed">
              هيكلة الأقسام الفنية والتحكم في صلاحيات المستخدمين لضمان بيئة عمل آمنة، منظمة وخالية من تداخل المسؤوليات.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-[#0F172A] p-6 rounded-xl border border-slate-800/60 shadow-sm">
              <h3 className="font-bold text-lg text-white mb-3">1. تصميم الأقسام والتصنيفات (Departments & Categories)</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                تتيح لك المنصة تمثيل الهيكل التنظيمي الحقيقي لشركتك رقمياً عبر إنشاء أقسام رئيسية وتصنيفات فرعية دقيقة تضمن توجيه العمل والاتصالات للمكان المناسب:
              </p>
              <ul className="list-disc list-inside text-sm text-slate-300 space-y-2 mr-2">
                <li><strong className="text-[#0D9EF2]">الأقسام الرئيسية:</strong> مثل (المبيعات، الدعم التقني، الحسابات والإدارة).</li>
                <li><strong className="text-[#0D9EF2]">التصنيفات الخدمية:</strong> تخصيص نوعية الاستفسارات لكل قسم (مثلاً: "مشاكل الفواتير" تتبع تلقائياً لقسم الحسابات).</li>
              </ul>
            </div>

            <div className="bg-[#0F172A] p-6 rounded-xl border border-slate-800/60 shadow-sm">
              <h3 className="font-bold text-lg text-white mb-3">2. إدارة الأدوار والأمان الصارم (Roles & Permissions)</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                يعتمد النظام على حوكمة الصلاحيات للتحكم الدقيق في الوصول إلى الميزات والبيانات:
              </p>
              <ul className="list-disc list-inside text-sm text-slate-300 space-y-2 mr-2">
                <li><strong className="text-[#0D9EF2]">صناعة الأدوار المخصصة:</strong> إنشاء مستويات وصول متباينة (مدير عام، مشرف قسم، وكيل اتصال، متدرب).</li>
                <li><strong className="text-[#0D9EF2]">تعيين الصلاحيات:</strong> تحديد دقيق لمن يمكنه إغلاق التذاكر، الاطلاع على تقارير الأداء، أو التحكم في شجرة الرد الآلي.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ticketing',
      title: 'نظام إدارة التذاكر المتقدم',
      subTitle: 'Ticketing System',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <div className="bg-[#0F172A] text-white p-6 rounded-2xl border border-slate-800">
            <span className="text-[#0D9EF2] text-xs font-bold tracking-wide uppercase">الفصل الثالث</span>
            <h2 className="text-2xl font-bold mt-1 text-white">نظام تتبع وإدارة التذاكر (Tickets)</h2>
            <p className="text-slate-300 mt-2 text-sm leading-relaxed">
              حوّل تفاعلات واستفسارات عملائك الهاتفية إلى مهام عمل رقمية قابلة للتتبع والتحليل والحل لضمان عدم ضياع أي تواصل.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800/60 shadow-sm">
              <span className="text-2xl">⚙️</span>
              <h3 className="font-bold text-white mt-2 mb-1">حقول مخصصة بالكامل</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                قم ببناء النماذج بما يخدم نشاطك التجاري. أضف حقولاً مخصصة لتعبئتها من قبل الوكلاء أثناء المكالمة (مثل رقم الشحنة أو نوع المنتج).
              </p>
            </div>
            <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800/60 shadow-sm">
              <span className="text-2xl">⏳</span>
              <h3 className="font-bold text-white mt-2 mb-1">دورة حياة تفاعلية</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                تتبع التذكرة من مرحلة "جديدة" إلى "قيد المعالجة" ثم "معلقة بانتظار العميل" وحتى الإغلاق والتقييم النهائي لضمان الالتزام بـ SLA.
              </p>
            </div>
            <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800/60 shadow-sm">
              <span className="text-2xl">🔒</span>
              <h3 className="font-bold text-white mt-2 mb-1">أرشفة وحذف آمن</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                حماية شاملة ضد الأخطاء البشرية؛ حيث يحتفظ مدراء النظام حصرياً بصلاحية حذف أو أرشفة التذاكر لضمان جودة السجلات التاريخية.
              </p>
            </div>
          </div>

          <div className="bg-[#0F172A] p-6 rounded-xl border border-slate-800/60">
            <h4 className="font-bold text-white mb-2">كيف تعمل التذكرة داخل المنصة؟</h4>
            <ol className="list-decimal list-inside text-sm text-slate-300 space-y-3 mr-2 font-sans">
              <li>يتصل العميل بالمنصة، فيقوم وكيل الدعم بفتح تذكرة مباشرة من لوحة التحكم الخاصة به أثناء المكالمة.</li>
              <li>يقوم الوكيل بتعبئة البيانات المخصصة المطلوبة وربط التذكرة بملف العميل في الـ CRM.</li>
              <li>إذا احتاجت المشكلة تدخل قسم آخر، يتم تحويل التذكرة تلقائياً لذلك القسم دون فقدان سياق المحادثة.</li>
              <li>يتلقى العميل إشعاراً عند حل المشكلة، ويتم إغلاق التذكرة وتضمين زمن الحل في تقرير الأداء.</li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 'ivr',
      title: 'الرد الآلي ومصمم التدفقات',
      subTitle: 'IVR & Interactive Flows',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 11-3-3V3m3 0V3h1V3" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <div className="bg-[#0F172A] text-white p-6 rounded-2xl border border-slate-800">
            <span className="text-[#0D9EF2] text-xs font-bold tracking-wide uppercase">الفصل الرابع</span>
            <h2 className="text-2xl font-bold mt-1 text-white">مصمم الرد الآلي التفاعلي (IVR Designer)</h2>
            <p className="text-slate-300 mt-2 text-sm leading-relaxed">
              قم ببناء شجرة اتصالات ديناميكية تفاعلية توجه عملائك إلى الأقسام الصحيحة تلقائياً وبأصوات مسجلة مخصصة لشركتك.
            </p>
          </div>

          <div className="bg-[#0F172A] p-6 rounded-xl border border-slate-800/60 shadow-sm space-y-4">
            <h3 className="font-bold text-white text-lg">عناصر ومكونات مسار الاتصال (Flow Nodes)</h3>
            <p className="text-sm text-slate-300">
              يمكنك بسهولة تصميم رحلة العميل عند الاتصال برقم شركتك عبر تجميع العقد التالية داخل لوحة تحكم التدفقات:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="border border-slate-800/80 p-4 rounded-lg bg-[#101B22]">
                <span className="font-semibold text-sm text-[#0D9EF2] block mb-1">🔘 عقدة القائمة التفاعلية (Menu Node)</span>
                <span className="text-xs text-slate-400 leading-relaxed block">
                  طلب الضغط على الأزرار من العميل (مثال: اضغط 1 للمبيعات، 2 للدعم الفني).
                </span>
              </div>
              <div className="border border-slate-800/80 p-4 rounded-lg bg-[#101B22]">
                <span className="font-semibold text-sm text-[#0D9EF2] block mb-1">📞 عقدة التحويل المباشر (Transfer Node)</span>
                <span className="text-xs text-slate-400 leading-relaxed block">
                  توجيه المكالمة فوراً لقسم مخصص، أو طابور انتظار معين، أو لوكيل استقبال محدد.
                </span>
              </div>
              <div className="border border-slate-800/80 p-4 rounded-lg bg-[#101B22]">
                <span className="font-semibold text-sm text-[#0D9EF2] block mb-1">📼 عقدة البريد الصوتي (Voicemail Node)</span>
                <span className="text-xs text-slate-400 leading-relaxed block">
                  السماح للعملاء بترك رسائل صوتية مسجلة في فترات خارج أوقات العمل الرسمية للشركة.
                </span>
              </div>
              <div className="border border-slate-800/80 p-4 rounded-lg bg-[#101B22]">
                <span className="font-semibold text-sm text-[#0D9EF2] block mb-1">🛑 عقدة إنهاء المكالمة (Hangup Node)</span>
                <span className="text-xs text-slate-400 leading-relaxed block">
                  إغلاق خط الاتصال بلطف بعد الانتهاء من سماع الإرشاد، أو تسجيل الشكوى التلقائية.
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] p-6 rounded-xl border border-slate-800/60 shadow-sm">
            <h3 className="font-bold text-white text-lg mb-2">مكتبة الأصوات والملفات الصوتية (Audio Studio)</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              ارفع تسجيلات الترحيب، الإعلانات الصوتية أو موسيقى الانتظار الخاصة بهوية شركتك مباشرة عبر المنصة، وقم بدمجها فوراً داخل عقد الـ IVR لتبث الألفة والاحترافية لدى المتصلين.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'workflows',
      title: 'محرك الأتمتة وسير العمل',
      subTitle: 'Automation & Workflow Rules',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <div className="bg-[#0F172A] text-white p-6 rounded-2xl border border-slate-800">
            <span className="text-[#0D9EF2] text-xs font-bold tracking-wide uppercase">الفصل الخامس</span>
            <h2 className="text-2xl font-bold mt-1 text-white">محرك الأتمتة الذكي (Workflow Engine)</h2>
            <p className="text-slate-300 mt-2 text-sm leading-relaxed">
              اجعل نظامك يعمل بدلاً عنك. قم بصياغة قواعد تشغيلية تلقائية لتوفير الوقت لعملائك وموظفيك ورفع الكفاءة التشغيلية.
            </p>
          </div>

          <div className="bg-[#0F172A] p-6 rounded-xl border border-slate-800/60 shadow-sm space-y-4">
            <h3 className="font-bold text-white text-lg">مفهوم عمل القواعد (Conditional Automation)</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              يعمل نظام الأتمتة استناداً إلى آلية <strong className="text-[#0D9EF2]">"إذا حدث (الشرط) ⬅️ نفذ تلقائياً (الإجراء)"</strong>. مما يضمن لك معالجة سريعة لجميع الأحداث دون تدخل بشري دائم.
            </p>

            <div className="border-r-4 border-[#0D9EF2] bg-[#101B22] p-4 rounded-l-lg space-y-3">
              <h4 className="font-bold text-sm text-[#0D9EF2]">أمثلة لقواعد يمكنك إعدادها فوراً:</h4>
              <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                <p>📍 <strong>قاعدة الرفع التلقائي (Escalation):</strong> إذا مرت ساعتان دون أي تحديث على تذكرة لعميل ذو تصنيف (VIP)، ارفع درجة الأهمية تلقائياً للقصوى وأرسل تنبيهاً لمشرف القسم.</p>
                <p>📍 <strong>قاعدة المتابعة الذكية:</strong> عند تحديث حالة التذكرة إلى "تم الحل"، أرسل تلقائياً استبيان قياس الرضا عبر البريد الإلكتروني أو الرسائل النصية للعميل.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'monitoring',
      title: 'سجلات المراقبة والأمان',
      subTitle: 'System Auditing & Security',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <div className="bg-[#0F172A] text-white p-6 rounded-2xl border border-slate-800">
            <span className="text-[#0D9EF2] text-xs font-bold tracking-wide uppercase">الفصل السادس</span>
            <h2 className="text-2xl font-bold mt-1 text-white">المراقبة المستمرة وسجلات الأمان</h2>
            <p className="text-slate-300 mt-2 text-sm leading-relaxed">
              تحقّق من استقرار المنصة واحصل على شفافية مطلقة حول كافة الحركات التشغيلية والتعديلات داخل لوحة التحكم.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800/60 shadow-sm">
              <h3 className="font-bold text-white text-lg mb-2">مراقبة جودة النظام (System Health)</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                تتبع جودة أداء الاتصال وسرعة استجابة النظام ومعدل استهلاك الموارد لضمان الحفاظ على مكالمات صوتية فائقة الوضوح وبأقل معدل تأخير زمن الـ Latency للاتصالات عبر بروتوكولات WebRTC.
              </p>
            </div>
            <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800/60 shadow-sm">
              <h3 className="font-bold text-white text-lg mb-2">سجلات التدقيق الأمني (Auditing Logs)</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                سجل أمان غير قابل للتعديل يوثق الأنشطة الحساسة: "من قام بتعديل الصلاحيات؟"، "من تصفح تقارير الأرباح؟"، ومتى تم ذلك بالضبط، مما يسهل التحقيق في أي أخطاء تشغيلية داخلية.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'analytics',
      title: 'التقارير وتصدير البيانات',
      subTitle: 'Analytics & Reports',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <div className="bg-[#0F172A] text-white p-6 rounded-2xl border border-slate-800">
            <span className="text-[#0D9EF2] text-xs font-bold tracking-wide uppercase">الفصل السابع</span>
            <h2 className="text-2xl font-bold mt-1 text-white">الالتقارير الإحصائية والتحليلات البيانية</h2>
            <p className="text-slate-300 mt-2 text-sm leading-relaxed">
              حوّل الأرقام والاتصالات والمحادثات لقرارات تجارية ذكية بناءً على تقارير تفصيلية شاملة لكل نشاط في شركتك.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800/60 shadow-sm">
              <h3 className="font-bold text-lg text-white mb-2">مؤشرات كفاءة الوكلاء (Agents Performance)</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                تقييم شامل لجهود موظفيك: تتبع زمن التحدث الفعلي، معدل المكالمات التي تم الرد عليها، والتذاكر المغلقة، بالإضافة لالتزامهم بمواعيد العمل والاستراحات.
              </p>
            </div>

            <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800/60 shadow-sm">
              <h3 className="font-bold text-lg text-white mb-2">تصدير التقارير بضغطة زر</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-3">
                تمنحك لوحة التحكم مرونة فائقة لتصدير الجداول الإحصائية وسحب البيانات للمشاركة الخارجية:
              </p>
              <div className="flex gap-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/40 text-emerald-400 border border-emerald-900/40">
                  📁 Excel / CSV
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-950/40 text-rose-400 border border-rose-900/40">
                  📄 PDF جاهز للطباعة
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'crm',
      title: 'إدارة علاقات العملاء CRM',
      subTitle: 'CRM Customer Directory',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2m-9.717-1.914A8.982 8.982 0 0010 13.4" />
        </svg>
      ),
      content: (
        <div className="space-y-6">
          <div className="bg-[#0F172A] text-white p-6 rounded-2xl border border-slate-800">
            <span className="text-[#0D9EF2] text-xs font-bold tracking-wide uppercase">الفصل الثامن</span>
            <h2 className="text-2xl font-bold mt-1 text-white">دليل العملاء المتكامل (CRM Directory)</h2>
            <p className="text-slate-300 mt-2 text-sm leading-relaxed">
              افهم عملائك وتتبع تاريخ تفاعلاتهم معك في مكان واحد آمن لتبني علاقات مستدامة ممتلئة بالثقة والرضا.
            </p>
          </div>

          <div className="bg-[#0F172A] p-6 rounded-xl border border-slate-800/60 shadow-sm space-y-4">
            <h3 className="font-bold text-white text-lg">الملف الموحد للعميل (Single Customer View)</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              عند استقبال مكالمة جديدة أو تصفح سجل المتصلين، يظهر للوكلاء ملف متكامل يضم:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-300 mr-2">
              <li className="flex items-center gap-2">
                <span className="text-[#0D9EF2]">✓</span> معلومات الاتصال الأساسية والبريد الإلكتروني.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0D9EF2]">✓</span> السجل التاريخي الكامل لجميع المكالمات والمسجلات الصوتية.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0D9EF2]">✓</span> التذاكر والمشاكل المفتوحة والمغلقة السابقة ذات الصلة.
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0D9EF2]">✓</span> ملاحظات وتعليقات الوكلاء الآخرين حول هذا العميل.
              </li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const activeChapter = chapters.find((ch) => ch.id === activeTab) || chapters[0];

  return (
    <div dir="rtl" className="min-h-screen bg-[#0F172A] text-slate-100 font-sans antialiased flex flex-col">
      {/* الهيدر العلوي */}
      <header className="bg-[#101B22] text-white border-b border-slate-800/80 sticky top-0 z-50 px-6 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0D9EF2] flex items-center justify-center font-bold text-white text-xl tracking-wider shadow-md shadow-cyan-500/10">
              C
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">بوابة المعرفة التقنية لدعم CAllX</h1>
              <p className="text-xs text-slate-400">الدليل والتوثيق التشغيلي للشركات والمدراء</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="bg-[#0D9EF2] hover:bg-[#0c8ed9] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm flex items-center gap-2">
              <span>تواصل مع الدعم الفني</span>
            </button>
          </div>
        </div>
      </header>

      {/* منطقة المحتوى الرئيسي والـ Sidebar */}
      <div className="max-w-7xl mx-auto w-full flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
        
        {/* شريط التصفح الجانبي (Sidebar) */}
        <aside className="lg:col-span-4 space-y-4">
          {/* قائمة الأقسام والفصول بشكل ستاتيك وثابت */}
          <nav className="bg-[#101B22] rounded-2xl shadow-sm border border-slate-800/80 p-2 overflow-hidden">
            <div className="px-3 py-2 text-xs font-semibold text-slate-400 border-b border-slate-800/80 mb-2">
              فصول دليل الاستخدام
            </div>
            <div className="space-y-1 max-h-[60vh] lg:max-h-[none] overflow-y-auto">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => setActiveTab(chapter.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-right ${
                    activeTab === chapter.id
                      ? 'bg-[#0D9EF2] text-white shadow-md'
                      : 'text-slate-300 hover:bg-[#0F172A] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${activeTab === chapter.id ? 'bg-white/20' : 'bg-[#0F172A] text-slate-300'}`}>
                      {chapter.icon}
                    </div>
                    <div>
                      <span className="block text-sm font-bold">{chapter.title}</span>
                      <span className={`block text-[10px] ${activeTab === chapter.id ? 'text-cyan-100' : 'text-slate-500'}`}>
                        {chapter.subTitle}
                      </span>
                    </div>
                  </div>
                  <span>
                    <svg className="w-4 h-4 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* مساحة عرض المحتوى التفصيلي المختار */}
        <main className="lg:col-span-8 bg-[#101B22] rounded-2xl p-6 shadow-sm border border-slate-800/80">
          <div className="fade-in duration-300">
            {activeChapter.content}
          </div>
        </main>

      </div>

      {/* الفوتر السفلي */}
      <footer className="bg-[#101B22] text-slate-400 text-xs text-center py-6 border-t border-slate-800/80 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} CAllX Call Center Cloud Platform. جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-white transition-colors">سياسة الخصوصية</a>
            <a href="#terms" className="hover:text-white transition-colors">شروط الاستخدام</a>
          </div>
        </div>
      </footer>
    </div>
  );
}