import React, { useState } from 'react';
import { motion } from 'framer-motion'; // التعديل هنا
import Modal from 'react-modal';

import Button from '../../components/common/Button';
import image1 from "../../assets/image1.png"
import Input from '../../components/common/Input';
import { createDepartmentService } from '../../services/CompanyStructure/CreateDepartment';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../components/common/Loading';
import { useTranslation } from 'react-i18next';
import LoadingCircle from '../../components/common/LoadingCircle';
// import useReactRouterBreadcrumbs from 'use-react-router-breadcrumbs';

const CreatDepartment = () => {
    const { t } = useTranslation();
    const [departmentName,setDepartmentName] = useState("")
    const [loading, setLoading] = useState(false);
    const GO = useNavigate();
    const token = localStorage.getItem("Token")


    async function handleGenerateDepartment(e) {
        e.preventDefault();
        setLoading(true);
       try {
         const response = await createDepartmentService(departmentName,token)
        if (response.success) {
             toast.success(response.message, {
                  position: "top-left",
                  autoClose: 3000,
                  className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
                });
                
        setDepartmentName("")
        
        }
       } catch (error) {
        if (error.response) {
                // الخطأ جاء من السيرفر (مثلاً 401 Unauthorized)
                toast.error(error.response);
              } else {
                // خطأ شبكة غير متوقع أو أن الـ Interceptor قام بعمله
                console.error("Login Error:", error);
              }
       }finally{
        setLoading(false);
       }
    }
   
    return (


    <div className="min-h-screen bg-[#101B22] flex  items-center gap-4 justify-evenly p-2 font-sans">
        
        {/* Left Side */}
        <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="rounded-xl w-full max-w-md"
        >
        
            <motion.img
                src={image1}
                alt="Department illustration"
                className="w-30 h-30"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2 }}
                whileHover={{ scale: 1.05 }}
            />
            
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-xl font-bold text-white mt-4"
            >
                {t("department.title")}
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="text-sm font-semibold text-[#0D9EF2] mt-2"
            >
                {t("department.description")}
            </motion.p>
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className=' flex flex-row items-center justify-start gap-5  mt-5 '>
                    <Button
                    path={"/"}
                    className="rounded-lg bg-[#b4c6ff] px-6 py-2.5 text-sm font-bold text-[#0f172a] hover:bg-[#c5d3ff] transition-all"
                    >
                     {t("department.previousButton")}
                    </Button>
                    <Button
                        path={"/department/category"}
                        onClick={handleGenerateDepartment}
                        className="rounded-lg bg-[#b4c6ff] px-6 py-2.5 text-sm font-bold text-[#0f172a] hover:bg-[#c5d3ff] transition-all"
                    >
                         {t("department.nextButton")}
                    </Button>
                
                </motion.div>
        </motion.div>

        {/* Right Side */}
        <motion.div
            initial={{ opacity: 0, y: 50,scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 0.8,
                delay: 0.3,
                ease: "easeOut",
            }}
            
            className="overflow-hidden p-10 rounded-xl bg-[#171F33] shadow-2xl shadow-black/80  w-full max-w-sm"
        >
            <div className="px-2 py-2">
                <form className='flex flex-col items-center'  onSubmit={handleGenerateDepartment}  action="">
                    <Input
                    required={true}
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    label={t("department.inputLabel")}
                    labelStyle="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2"
                    type="text"
                    placeholder= {t("department.placeholder")}
                    autoFocus={true}
                    className="w-full rounded-xl bg-[#171F33] border border-sky-400/30 p-3 mb-10 text-gray-200 placeholder-gray-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 focus:outline-none transition-all shadow-lg shadow-black/20"
                    
                    />
                    <Button
                        type={"submit"}
                        onClick={handleGenerateDepartment}
                        className="rounded-lg bg-[#b4c6ff] px-5 py-2.5 text-sm font-bold text-[#0f172a] hover:bg-[#c5d3ff] transition-all"
                    >
                    {loading ? (
                            <>
                                <LoadingCircle/>
                            </>
                            ):(
                                t("department.generateButton")
                            )}
                    </Button>
                    
                </form>
               
            </div>

            
        </motion.div>

    </div>
);

};



export default CreatDepartment;