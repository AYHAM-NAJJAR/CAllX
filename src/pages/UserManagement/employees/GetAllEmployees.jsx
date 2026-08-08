import React, { useState } from 'react';
import AppBar from '../../../components/common/AppBar';
import Button from '../../../components/common/Button';
import { useEmployees } from '../../../hooks/useEmployees'; 
import LoadingCircle from '../../../components/common/LoadingCircle';
import EmployeeCard from './components/EmployeeCard';
import CreateEmployeeModal from './modal/CreateEmployeeModal';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';
import LoadingError from '../../../components/common/LoadingError';
import { Menu } from 'lucide-react';
import { SearchInput } from '../../../components/common/SearchInput';

const GetAllEmployees = () => {
    const token = localStorage.getItem("Token");
    const [isOpenModalAddEmployee, setIsOpenModalAddEmployee] = useState(false);
        const [search, setSearch] = useState("");
    const { data: employees, isLoading, error, refetch } = useEmployees(token, false, search);
    const location = useLocation();
    const isSubRoute = location.pathname !== '/main/system/employee' && location.pathname !== '/main/system/employee/';
    

    
    if (isLoading) {
      return <LoadingCircle Phrase={"Employees"}/>;
    }

    if (error) {
      return <LoadingError Phrase={"Employees"}/>;
    }

    if (isSubRoute) {
        return <Outlet/>;
    }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans p-6">
      <CreateEmployeeModal onSuccess={() => refetch()} onClose={() => setIsOpenModalAddEmployee(false)} isOpen={isOpenModalAddEmployee}/>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white">
            Employees Overview
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Monitoring Your Employees.
          </p>
        </div>

        {/* الأزرار */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button 
            onClick={() => setIsOpenModalAddEmployee(true)}
            className="flex-1 sm:flex-initial bg-[#1e293b] hover:bg-[#2b394e] border border-blue-500 px-4 sm:px-6 py-2.5 rounded-md text-xs sm:text-sm font-bold text-blue-400 transition-colors duration-200"
          >
            Add Employee
          </Button>
                            <SearchInput
                              placeholder={"Search About Employee name"} 
                              value={search} 
                              onChange={(val) => {
                                setSearch(val);
                              }} 
                            />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="flex gap-4 mb-8">
        <div className="bg-[#1a202c] p-4 border border-[#2d3748] rounded w-24 text-center">
          <div className="text-blue-400 font-bold text-xl">{employees?.length || 0}</div>
          <div className="text-[10px] text-gray-500">TOTAL</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {employees?.map((emp) => (
            <EmployeeCard
                key={emp.id}
                id={emp.id}
                firstName={emp.firstName}
                lastName={emp.lastName}
                email={emp.email}
                phone={emp.phoneNumber}
                departmentName={emp.departmentName}
                userType={emp.userType} // تم تمرير الـ userType هنا بنجاح
                roles={emp.roles}
            />
        ))}
      </div>
        
      <Outlet/>
    </div>
  );
};

export default GetAllEmployees;