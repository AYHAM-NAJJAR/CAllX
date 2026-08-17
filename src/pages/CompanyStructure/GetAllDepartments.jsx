import { useState } from "react";
import Button from "../../components/common/Button";
import { useDepartments } from "../../hooks/useDepartments";
import CreateEmployeeModal from "../UserManagement/employees/modal/CreateEmployeeModal";
import DepartmentCard from "./components/DepartmentCard";
import CreatDepartmentModal from "./Modal/CreateDepartmentModal";
import LoadingError from "../../components/common/LoadingError";
import LoadingCircle from "../../components/common/LoadingCircle";
import CreateCategoryToDepartmentModal from "./Modal/CreateCategoryToDepartmentModal";
import { SearchInput } from "../../components/common/SearchInput";
import { useTranslation } from "react-i18next";

export default function DepartmentsList() {
  const { t } = useTranslation();
  const [isCreateDepartmentModalOpen, setIsCreateDepartmentModalOpen] = useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const token = localStorage.getItem("Token");
  const [search, setSearch] = useState("");
  
  const { 
    data: departments = [], 
    isLoading,
    isError,
    refetch
  } = useDepartments(token, false, search);

  if (isLoading) {
    return (
      <LoadingCircle Phrase={t('departmentsList.loadingPhrase')} />
    );
  }

  if (isError) {
    return (
      <LoadingError Phrase={t('departmentsList.errorPhrase')} />
    );
  }

  return (
    <div className="bg-[#0F172A] min-h-screen p-8">
      <CreatDepartmentModal onSuccess={() => refetch()} isOpen={isCreateDepartmentModalOpen} onClose={setIsCreateDepartmentModalOpen} />
      <CreateCategoryToDepartmentModal onSuccess={() => refetch()} isOpen={isCreateCategoryModalOpen} onClose={setIsCreateCategoryModalOpen} />
      
      <div className="flex flex-col lg:flex-row items-center justify-between mb-10">
        <h1 className="text-white text-3xl font-bold">{t('departmentsList.title')}</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsCreateDepartmentModalOpen(true)}
            className="bg-customButton mr-4 px-6 py-2 rounded-md text-sm font-bold text-white"
          >
            {t('departmentsList.addDepartment')}
          </Button>
          <Button 
            onClick={() => setIsCreateCategoryModalOpen(true)}
            className="bg-customButton px-6 py-2 rounded-md text-sm font-bold text-white"
          >
            {t('departmentsList.addCategory')}
          </Button>
          <SearchInput
            placeholder={t('departmentsList.searchPlaceholder')} 
            value={search} 
            onChange={(val) => {
              setSearch(val);
            }} 
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {departments.length > 0 ? (
          departments.map((dept) => (
            <DepartmentCard key={dept.id} department={dept} />
          ))
        ) : (
          <p className="text-gray-400">{t('departmentsList.noDepartments')}</p>
        )}
      </div>
    </div>
  );
}