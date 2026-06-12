import React, { useState } from 'react';
import AppBar from '../../../components/common/AppBar';
import Button from '../../../components/common/Button';
import { useEmployees } from '../../../hooks/useEmployees'; // تأكد من المسار الصحيح
import LoadingCircle from '../../../components/common/LoadingCircle';
import EmployeeCard from './components/EmployeeCard';
import CreateEmployeeModal from './modal/CreateEmployeeModal';
import { Outlet, useLocation } from 'react-router-dom';

const GetAllEmployees = () => {
    const token = localStorage.getItem("Token");
    const [isOpenModalAddEmployee, setIsOpenModalAddEmployee] =useState(false);
    const { data: employees, isLoading, error , refetch} = useEmployees(token);
    const location = useLocation();
    const isSubRoute = location.pathname !== '/main/system/employee' && location.pathname !== '/main/system/employee/';
  
  if (error) return <div className="text-red-500 p-10">Error loading employees</div>;
    if (isSubRoute) {
        return <Outlet/>;
    }
  return (
    <div className="min-h-screen bg-[#0f172a] p-8 text-white font-sans">
     
      <CreateEmployeeModal onSuccess={() => refetch()} onClose={setIsOpenModalAddEmployee} isOpen={isOpenModalAddEmployee}/>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Employees Overview</h1>
          <p className="text-gray-400 text-sm">Monitoring Your Employees.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-500 px-6 py-2 rounded-md text-sm font-bold">REPORT</button>
          <Button 
          onClick={() => setIsOpenModalAddEmployee(true)}
          className="bg-[#1e293b] border border-blue-500 px-6 py-2 rounded-md text-sm font-bold text-blue-400">
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="flex gap-4 mb-8">
        {/* يمكنك حساب القيم هنا ديناميكياً بناءً على مصفوفة employees */}
        <div className="bg-[#1a202c] p-4 border border-[#2d3748] rounded w-24 text-center">
          <div className="text-red-500 font-bold text-xl">{employees?.length || 0}</div>
          <div className="text-[10px] text-gray-500">TOTAL</div>
        </div>
      </div>

        {isLoading ? (
            <div className='flex items-center justify-center h-[50vh] w-full '>
                <LoadingCircle />
            </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {employees?.map((emp) => (
            <EmployeeCard
                id={emp.id}
                firstName={emp.firstName}
                lastName={emp.lastName}
                email={emp.email}
                phone={emp.phoneNumber}
                departmentName={emp.departmentName}
                roles={emp.roles}
            />
        ))}
      </div>
        )}
      <Outlet/>
    </div>
  );
};

export default GetAllEmployees;