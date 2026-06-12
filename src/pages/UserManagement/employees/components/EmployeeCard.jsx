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

import detail from '../../../../assets/details.png';
import { useNavigate } from 'react-router-dom';

function EmployeeCard({
  id,
  firstName,
  lastName,
  email,
  phone,
  departmentName,
  roles = [],
}) {

  const controls = useAnimation();
  const GO = useNavigate();

  // 1. فحص ما إذا كانت مصفوفة الأدوار تحتوي على "Admin"
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

  // =========================
  // Hover Interaction
  // =========================
  const hover = useHover(context);

  const { getReferenceProps, getFloatingProps } =
    useInteractions([hover]);

  // =========================
  // Hover Animation
  // =========================
  const handleHoverStart = () => {
    controls.start('hover');
  };

  const handleHoverEnd = () => {
    controls.start('rest');
  };

  // =========================
  // Variants
  // =========================
  const titleVariants = {
    rest: { x: 0 },

    hover: {
      x: 4,
      transition: {
        type: 'spring',
        stiffness: 300,
      },
    },
  };

  const imageVariants = {
    rest: {
      scale: 1,
      rotate: 0,
    },

    hover: {
      scale: 1.15,
      rotate: 45,

      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
  };

  return (
    <div
      key={id}
      // 2. تطبيق الكلاسات الشرطية على الكرت بالكامل بناءً على قيمة isAdmin
      className={`p-4 rounded border transition-all duration-300 ${
        isAdmin 
          ? ' bg-[#1e2531] border-sky-500 ' // كرت الأدمن: خلفية داكنة مميزة وإطار ذهبي مضيء
          : 'bg-[#1e293b] border-[#334155]' // الكرت الافتراضي لباقي الموظفين
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
          onClick={()=>GO(`/main/system/employee/details/${id}`)}
        />

        {/* TOOLTIP */}
        {isOpen && (
          <div
            ref={(node) => refs.setFloating(node)}
            style={floatingStyles}
            {...getFloatingProps()}
            className="
              bg-sky-600
              text-white
              text-xs
              px-3
              py-1
              rounded
              shadow-lg
              z-50
            "
          >
            Employee Details
          </div>
        )}
      </div>

      <p className="text-gray-400 text-sm mt-2">
        {email}
      </p>

      <p className="text-gray-400 text-sm">
        {phone}
      </p>

      <p className="text-blue-400 text-xs mt-2">
        {departmentName || 'No Department'}
      </p>

      <div className="mt-2">
        <div className="flex flex-wrap gap-1">
          {roles.map((role, idx) => (
            <span
              key={idx}
              // 3. تطبيق كلاس شرطي داخل الـ map لتمييز شارة الأدمن بلون مختلف عن بقية الأدوار
              className={`text-[10px] px-2 py-1 rounded font-medium ${
                role === 'ADMIN' 
                  ? 'bg-sky-500 text-white' // شارة الأدمن باللون الذهبي/البرتقالي
                  : 'bg-gray-700 text-gray-200' // باقي الشارات باللون الرمادي الاعتيادي
              }`}
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmployeeCard;