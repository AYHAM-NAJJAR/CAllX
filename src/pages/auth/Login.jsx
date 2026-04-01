import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const GO= useNavigate();
  function Login(e) {
    e.preventDefault();
    GO("/main")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1118] font-sans p-4">
      {/* Top Left Logo */}
      <div className="absolute flex items-center gap-2 top-8 left-8">
        <div className="grid grid-cols-2 gap-0.5">
          <div className="w-2.5 h-2.5 bg-[#00A3FF]"></div>
          <div className="w-2.5 h-2.5 bg-[#00A3FF] opacity-40"></div>
          <div className="w-2.5 h-2.5 bg-[#00A3FF] opacity-70"></div>
        </div>
        <span className="text-sm font-bold tracking-widest text-white">CALLX</span>
      </div>

      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-white">CAIIX</h1>
          <p className="text-sm text-gray-400">
            Please enter your credentials to access the support portal.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          
          {/* Email Address */}
          <div>
            <label className="block mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Email Address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full px-4 py-3 bg-[#151D29] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#151D29] border border-gray-800 rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Server Mode */}
          <div>
            <label className="block mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
              Server Mode
            </label>
            <select className="w-full px-4 py-3 bg-[#151D29] border border-gray-800 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer">
              <option>server</option>
              <option>local</option>
            </select>
          </div>

          {/* Login Button */}
          <button
            onClick={Login}
            type="submit"
            className="w-full mt-4 py-3.5 bg-[#00A3FF] hover:bg-[#008EDB] text-white font-bold rounded-full transition-all active:scale-95 shadow-lg shadow-blue-500/10"
          >
            LOGIN
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Need an account?{' '}
            <button className="text-[#00A3FF] hover:underline bg-transparent border-none cursor-pointer">
              Contact your supervisor
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;