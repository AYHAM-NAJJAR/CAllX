import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { LoginOperation } from '../../services/Authentication/login';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import LanguageSelect from '../../components/private/LanguageSelect';
import call from '../../assets/call.png'

const Login = () => {
  const GO = useNavigate();
  const { t} = useTranslation();
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLoginInfo({
      ...loginInfo,
      [e.target.name]: e.target.value,
    });
  };

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      
      const respone = await LoginOperation(loginInfo)
      if (respone.success) {
        
        const { permissions, ...userWithoutPermissions } = respone.user;
        // الآن نقوم بحفظ الكائن الجديد الذي لا يحتوي على الصلاحيات
        localStorage.setItem("user", JSON.stringify(userWithoutPermissions));
        localStorage.setItem("permissions", JSON.stringify(permissions));
        toast.success(respone.message, {
            position: "top-left",
            autoClose: 3000,
            className: '!bg-[#1a2332] !border !border-gray-700 !rounded-xl !shadow-2xl',
          });
        GO("/department");
        
      }
     
    } catch (error) {
      if (error.response) {
        // الخطأ جاء من السيرفر (مثلاً 401 Unauthorized)
        toast.error(error.response);
      } else {
        // خطأ شبكة غير متوقع أو أن الـ Interceptor قام بعمله
        console.error("Login Error:", error);
      }
    }finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1118]">
        <Loading LoadingPhrase="Process Login Operation" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1118] font-sans p-4">
      
      {/* Top Left Logo */}
      <div className="absolute flex items-center gap-2 top-8 left-8">
       

        <span className="text-sm font-bold tracking-widest text-white">
          {t('login.title')}
        </span>
          <LanguageSelect show={true} />
      </div>

      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-10 text-center flex items-center flex-col ">
          <img src={call} className='h-30 w-30 mb-4 animate-pulse' alt="" />
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-white">
            {t('login.title')}
          </h1>

          <p className="text-sm text-gray-400">
            {t('login.description')}
          </p>
        
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleLogin}>

          {/* Email */}
          <div>
            <Input
              required={true}
              type="email"
              id="email"
              name="email"
              placeholder={t('login.email_placeholder')}
              labelStyle="block mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase"
              className="w-full px-4 py-3 bg-[#151D29] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
              label={t('login.email_label')}
              value={loginInfo.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <Input
              required={true}
              type="password"
              id="password"
              name="password"
              placeholder={t('login.password_placeholder')}
              labelStyle="block mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase"
              className="w-full px-4 py-3 bg-[#151D29] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
              label={t('login.password_label')}
              value={loginInfo.password}
              onChange={handleChange}
            />
          </div>

          {/* Button */}
          <Button
            type="submit"
            className="w-full mt-4 py-3.5 bg-[#00A3FF] hover:bg-[#008EDB] text-white font-bold rounded-full transition-all active:scale-95 shadow-lg shadow-blue-500/10"
          >
            {t('login.submit')}
          </Button>

        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            {t('login.no_account')}
            <button className="text-[#00A3FF] hover:underline bg-transparent border-none cursor-pointer">
              {t('login.contact')}
            </button>
          </p>
        </div>
         
      </div>
    </div>
  );
};

export default Login;