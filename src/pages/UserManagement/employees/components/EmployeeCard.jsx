import { motion, useAnimation } from 'framer-motion';
import {
  useFloating,
  offset,
  flip,
  shift,
  useHover,
  useInteractions,
} from '@floating-ui/react';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import detail from '../../../../assets/details.png';
import { useNavigate } from 'react-router-dom';

function EmployeeCard({
  id,
  firstName,
  lastName,
  email,
  phone,
  departmentName,
  userType, // 1. استقبال الـ userType هنا
  roles = [],
}) {
  const { t } = useTranslation();
  const controls = useAnimation();
  const GO = useNavigate();

  // فحص ما إذا كان الأدمن يحتوي على ADMIN
  const isAdmin = roles.includes('ADMIN');

  // =========================
  // Tooltip State
  // =========================
  const [isOpen, setIsOpen] = useState(false);

  // =========================
  // Floating UI
  // =========================
  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    middleware: [
      offset(10),
      flip(),
      shift(),
    ],
  });

  const hover = useHover(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

  const handleHoverStart = () => { controls.start('hover'); };
  const handleHoverEnd = () => { controls.start('rest'); };

  const titleVariants = {
    rest: { x: 0 },
    hover: {
      x: 4,
      transition: { type: 'spring', stiffness: 300 },
    },
  };

  const imageVariants = {
    rest: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.15,
      rotate: 45,
      transition: { type: 'spring', stiffness: 400, damping: 10 },
    },
  };

  // دالة لتحديد لون شارة الـ UserType بناءً على قيمته
  const getUserTypeBadgeStyle = (type) => {
    switch (type) {
      case 'ADMIN':
        return 'bg-purple-500/20 text-purple-400 border border-purple-500/30';
      case 'AGENT':
        return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
      case 'CUSTOMER':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div
      key={id}
      className={`p-4 rounded border transition-all duration-300 ${
        isAdmin 
          ? 'bg-[#1e2531] border-sky-500' 
          : 'bg-[#1e293b] border-[#334155]'
      }`}
    >
      <div className="flex items-center justify-between flex-row">
        {/* TITLE */}
        <motion.h3
          className="font-bold text-lg text-white"
          variants={titleVariants}
          animate={controls}
          initial="rest"
        >
          {firstName} {lastName}
        </motion.h3>

        {/* IMAGE */}
        <motion.img
          ref={(node) => refs.setReference(node)}
          {...getReferenceProps()}
          src={detail}
          alt="details"
          className="w-6 h-6 cursor-pointer"
          variants={imageVariants}
          animate={controls}
          initial="rest"
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          onClick={() => GO(`/main/system/employee/details/${id}`)}
        />

        {/* TOOLTIP */}
        {isOpen && (
          <div
            ref={(node) => refs.setFloating(node)}
            style={floatingStyles}
            {...getFloatingProps()}
            className="bg-sky-600 text-white text-xs px-3 py-1 rounded shadow-lg z-50"
          >
            {t('employeeCard.tooltip')}
          </div>
        )}
      </div>

      {/* عرض User Type كشعار مميز */}
      <div className="flex items-center gap-2 mt-2">
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${getUserTypeBadgeStyle(userType)}`}>
          {userType || 'UNKNOWN'}
        </span>
        <span className="text-blue-400 text-xs">
          • {departmentName || t('employeeCard.noDepartment')}
        </span>
      </div>

      <p className="text-gray-400 text-sm mt-2">
        {email}
      </p>

      <p className="text-gray-400 text-sm">
        {phone || t('employeeCard.noPhone')}
      </p>

      {/* Roles Section */}
      <div className="mt-3 pt-3 border-t border-slate-700/50">
        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">{t('employeeCard.rolesLabel')}</div>
        <div className="flex flex-wrap gap-1">
          {roles && roles.length > 0 ? (
            roles.map((role, idx) => (
              <span
                key={idx}
                className={`text-[10px] px-2 py-1 rounded font-medium ${
                  role === 'ADMIN' 
                    ? 'bg-sky-500 text-white' 
                    : 'bg-gray-700 text-gray-200'
                }`}
              >
                {role}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-slate-500 italic">{t('employeeCard.noRoles')}</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeCard;