import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import { Users, Loader2, AlertCircle, Menu } from "lucide-react";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import Button from "../../../components/common/Button";
import { useCustomers } from "../../../hooks/useCustomers";
import ClientCard from "./components/ClientCard";
import CreateCustomerModal from "./Modal/CreateCustomerModal";
import { SearchInput } from "../../../components/common/SearchInput";

const ShowAllCustomers = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const token = localStorage.getItem("Token");
  const [isModalCreateCustomerOpen, setIsModalCreateCustomerOpen] = useState(false);
  const isSubRoute = location.pathname.includes("/tags") || location.pathname.includes("/details/");
  const [search, setSearch] = useState("");
  
  // استقبال handleGlobalCall من الـ context الخاص بـ Panel
  const context = useOutletContext() || {};
  const { toggleSidebar, handleGlobalCall } = context;
  
  const { 
    data: Customers = [], 
    isLoading, 
    isError,
    refetch
  } = useCustomers(token, search);

  useEffect(() => {
    if (!isSubRoute) {
      refetch(); 
    }
  }, [isSubRoute, refetch]);

  if (isSubRoute) {
    return <Outlet />;
  }

  // 2. واجهة حالة التحميل (Loading State)
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-400 gap-3">
        <Loader2 className="animate-spin text-[#0D9EF2]" size={32} />
        <p className="text-sm">{t('showAllCustomers.loading')}</p>
      </div>
    );
  }

  // 3. واجهة حالة الخطأ (Error State)
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-400 gap-3">
        <AlertCircle size={32} />
        <p className="text-sm font-semibold">{t('showAllCustomers.errorTitle')}</p>
        <p className="text-xs text-gray-500">{t('showAllCustomers.errorSubtitle')}</p>
      </div>
    );
  }
 
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 lg:mb-12">
        
        <CreateCustomerModal
          data={Customers} 
          isOpen={isModalCreateCustomerOpen} 
          onSuccess={() => refetch()}
          onClose={() => setIsModalCreateCustomerOpen(false)}
        />

        {/* Left Side: Professional Menu Icon, Title & Search Input */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button 
              onClick={toggleSidebar} 
              className="p-2 sm:p-2.5 bg-[#101B22] border border-slate-800 text-slate-300 hover:text-[#0D9EF2] hover:bg-slate-800/50 rounded-lg transition-all shrink-0 shadow-sm flex items-center justify-center"
              aria-label={t('showAllCustomers.toggleSidebar')}
            >
              <Menu size={20} />
            </Button>

            <h1 className="text-xl sm:text-2xl text-white font-bold tracking-wide leading-tight">
              {t('showAllCustomers.title')}
            </h1>
          </div>

          <div className="w-full sm:w-auto">
            <SearchInput
              placeholder={t('showAllCustomers.searchPlaceholder')} 
              value={search} 
              onChange={(val) => {
                setSearch(val);
              }} 
            />
          </div>
        </div>

        {/* Right Side: Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full lg:w-auto">
          <Button
            onClick={() => setIsModalCreateCustomerOpen(true)}
            className="bg-customButton hover:bg-blue-500 text-white px-4 py-2.5 sm:py-2 text-sm sm:text-base font-bold rounded-lg flex justify-center items-center shadow-lg transition-all"
          >
            {t('showAllCustomers.createCustomer')}
          </Button>
          <Button
            path={"/main/customers/tags"}
            className="bg-customButton hover:bg-blue-500 text-white px-4 py-2.5 sm:py-2 text-sm sm:text-base font-bold rounded-lg flex justify-center items-center shadow-lg transition-all"
          >
            {t('showAllCustomers.tagsManagement')}
          </Button>
        </div>
      </div>

      {/* Grid عرض العملاء بعد الفلترة */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Customers.length > 0 ? (
            Customers.map((client) => (
              <ClientCard 
                key={client.id} 
                client={client} 
                onCall={() => {
                  if (handleGlobalCall) {
                    handleGlobalCall(client.phoneNumber, client.id);
                  }
                }} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16 sm:py-20 text-gray-500 border border-dashed border-gray-800 rounded-lg mx-2 sm:mx-0">
              {t('showAllCustomers.noClients')}
            </div>
          )}
        </div>
      </div>

      {/* التول تيب */}
      <Tooltip
        id="export-clients-tooltip"
        place="top"
        style={{
          backgroundColor: "#101B22",
          border: "1px solid #1e293b",
          color: "#f8fafc",
          fontSize: "12px",
          borderRadius: "6px",
          padding: "6px 10px",
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.5)",
          zIndex: 50
        }}
      />
    </div>
  );
};

export default ShowAllCustomers;