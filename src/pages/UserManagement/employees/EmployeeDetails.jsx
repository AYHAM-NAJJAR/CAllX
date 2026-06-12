import React, { useState, useEffect } from 'react';
import { getEmployeeById } from '../../../services/UserManagement/getEmployeeById';
import { useParams } from 'react-router-dom';
import LoadingCircle from '../../../components/common/LoadingCircle';
import Button from '../../../components/common/Button';
import UpdateEmployeeModal from './modal/UpdateEmployeeModal';
import DeleteEmployeeModal from './modal/DeleteEmployeeModal';


const EmployeeDetails = () => {
  const {id} = useParams()
  const [employee, setEmployee] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("Token"); 
  const [isOpenModalUpdateEmployee,setIsOpenModalUpdateEmployee] = useState(false);
  const [isOpenModalDeleteEmployee,setIsOpenModalDeleteEmployee] = useState(false);
  const[flag,setFlag]= useState(false)

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        // استدعاء الدالة وتمرير المتغيرات المطلوبة
        const data = await getEmployeeById(token, id);
        setEmployee(data); 
      } catch (err) {
        setError("فشل في تحميل بيانات الموظف.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [token, id, flag]); 
   console.log(employee);
  // عرض واجهة التحميل
  if (loading) {
    return (
      <div className="h-screen text-gray-200 flex items-center justify-center">
        <LoadingCircle/>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="min-h-screen text-gray-200 flex items-center justify-center">
        <p className="text-xl text-red-400">{error || "لم يتم العثور على بيانات الموظف"}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-gray-200 font-sans ">
        <UpdateEmployeeModal onSuccess={setFlag} data={employee} onClose={setIsOpenModalUpdateEmployee} isOpen={isOpenModalUpdateEmployee} />
        <DeleteEmployeeModal data={employee}  onClose={setIsOpenModalDeleteEmployee} isOpen={isOpenModalDeleteEmployee} />
      <header className="flex items-center justify-between mb-10">
        
          <h1 className="text-xl font-bold tracking-wider text-white">Employee Details</h1>
        
        <div className="flex items-center gap-3">
          <Button
          path={"/main/system/employee"}
          className="bg-[#151D29] border border-gray-800 rounded-full px-6 py-2.5 text-sm font-semibold hover:bg-gray-800">
            Back to List
          </Button>
          <Button
          onClick={() => setIsOpenModalUpdateEmployee(true)}
          className="rounded-full bg-customButton px-6 py-2.5 text-sm font-bold text-[#0f172a] ">
            Edit
          </Button>
          <Button
          onClick={()=>setIsOpenModalDeleteEmployee(true)}
          className="rounded-full text-white  bg-red-400 hover:bg-red-600 ease-in transition-colors   px-6 py-2.5 text-sm font-bold  ">
            Delete
          </Button>
        </div>
      </header>
      <section className="bg-[#111821] border border-gray-800 rounded-xl p-10 flex items-center gap-10 mb-10">
        
        <div className="flex-1 space-y-6">
          <div>
            {/* عرض الاسم الأول والأخير مع اسم القسم المعني */}
            <h3 className="text-3xl font-extrabold text-white">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-gray-400 mt-1">Department: {employee.departmentName || "No Department"}</p>
          </div>
          
          <div className=" flex flex-col items-start gap-2 text-gray-300 text-base">
            
            <div className="flex items-center gap-3">
              <span className="text-xl">✉</span>
              <span>{employee.email}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xl">📞</span>
              <span>{employee.phoneNumber || "No phone number"}</span>
            </div>
            
            <div className="flex items-center gap-3 col-span-2">
              <span className="text-sm bg-gray-800 text-gray-400 px-3 py-1 rounded-md">
                Role: {employee.roles?.join('/ ')}
              </span>
              
            </div>
            <div className="flex items-center gap-3 col-span-2">
              <span className="text-sm bg-gray-800 text-gray-400 px-3 py-1 rounded-md">
                verifiedAt: {employee.verifiedAt}
              </span>
              
            </div>
          </div>
        </div>
        
      </section>
    </div>
  );
};

export default EmployeeDetails;