import React, { useState } from 'react';
import Modal from 'react-modal';

import Button from '../../../components/common/Button';
import image1 from '../../../assets/image1.png';
import Input from '../../../components/common/Input';
import { createDepartmentService } from '../../../services/CompanyStructure/CreateDepartment';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import LoadingCircle from '../../../components/common/LoadingCircle';

// import useReactRouterBreadcrumbs from 'use-react-router-breadcrumbs';

const CreatDepartmentModal = ({isOpen , onClose ,onSuccess}) => {
    const { t } = useTranslation();
    const [departmentName, setDepartmentName] = useState('');
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('Token');

    async function handleGenerateDepartment(e) {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await createDepartmentService(
                departmentName,
                token
            );

            if (response.success) {
                toast.success(response.message, {
                    position: 'top-left',
                    autoClose: 3000,
                    className:
                        '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
                });
                
                setDepartmentName('');
                onSuccess()
                onClose()
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response);
            } else {
                console.error('Login Error:', error);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="outline-none"
            overlayClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
        >
            
                {/* Right Side */}
                <div
                    
                    className="overflow-hidden p-10 rounded-xl bg-[#171F33] shadow-2xl shadow-black/80 w-full max-w-sm"
                >
                    <div className="px-2 py-2">
                        <form
                            className="flex flex-col items-center"
                            onSubmit={handleGenerateDepartment}
                        >
                            <Input
                                required={true}
                                value={departmentName}
                                onChange={(e) =>
                                    setDepartmentName(e.target.value)
                                }
                                label={t('department.inputLabel')}
                                labelStyle="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2"
                                type="text"
                                placeholder={t('department.placeholder')}
                                autoFocus={true}
                                className="w-full rounded-xl bg-[#171F33] border border-sky-400/30 p-3 mb-10 text-gray-200 placeholder-gray-600 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 focus:outline-none transition-all shadow-lg shadow-black/20"
                            />
                            <div className='flex items-center justify-center gap-4'>
                                
                            <Button
                                type="submit"
                                onClick={handleGenerateDepartment}
                                className="rounded-lg bg-customButton px-2.5 py-2.5 text-sm font-bold text-[#0f172a] hover:bg-[#c5d3ff] transition-all"
                            >
                                {loading ? (
                                    <LoadingCircle />
                                ) : (
                                    t('department.generateButton')
                                )}
                            </Button>
                            <Button
                           className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
                            onClick={onClose}
                            >
                                Close
                            </Button>
                            </div>
                        </form>
                    </div>
                </div>
           
        </Modal>
    );
};

export default CreatDepartmentModal;