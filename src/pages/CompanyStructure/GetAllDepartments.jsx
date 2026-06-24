// DepartmentsList.jsx
import { useState } from "react";
import Button from "../../components/common/Button";
import { useDepartments } from "../../hooks/useDepartments";
import CreateEmployeeModal from "../UserManagement/employees/modal/CreateEmployeeModal";
import DepartmentCard from "./components/DepartmentCard";
import CreatDepartmentModal from "./Modal/CreateDepartmentModal";
import LoadingError from "../../components/common/LoadingError";
import LoadingCircle from "../../components/common/LoadingCircle";

export default function DepartmentsList() {
  const [isCreateDepartmentModalOpen,setIsCreateDepartmentModalOpen] = useState(false);
  const token = localStorage.getItem("Token")
  const { 
    data: departments = [], 
    isLoading,
    isError ,
    refetch
  } = useDepartments(token);
  console.log(departments);
console.log(departments.categories);
    if (isLoading) {
    return (
      <LoadingCircle Phrase={"Departments"}/>
    );
  }

  if (isError) {
    return (
      <LoadingError Phrase={"Departments"}/>
    );
  }

  return (
    <div className="bg-[#0F172A] min-h-screen p-8">
      <CreatDepartmentModal onSuccess={() => refetch()}  isOpen={isCreateDepartmentModalOpen} onClose={setIsCreateDepartmentModalOpen} />
      <div className="flex flex-row items-center justify-between mb-10">
          <h1 className="text-white text-3xl font-bold ">Departments List</h1>
          <Button 
          onClick={() => setIsCreateDepartmentModalOpen(true)}
          className="bg-customButton   px-6 py-2 rounded-md text-sm font-bold text-white">
            Add Department
          </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {departments.length > 0 ? (
          departments.map((dept) => (
            <DepartmentCard key={dept.id} department={dept} />
          ))
        ) : (
          <p className="text-gray-400">No departments found.</p>
        )}
      </div>
    </div>
  );
}