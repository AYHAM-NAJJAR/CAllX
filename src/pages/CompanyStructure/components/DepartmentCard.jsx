import Button from "../../../components/common/Button";

// DepartmentCard.jsx
const DepartmentCard = ({ department }) => {
  return (
    <div className="bg-[#101B22] border border-slate-700 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-shadow duration-300">
      {/* اسم القسم */}
      <h3 className="text-white text-xl font-bold mb-3 border-b border-sky-600 pb-2">
        {department.name}
      </h3>

      {/* تفاصيل الموظفين */}
      <div className="mb-4">
        <p className="text-gray-400 text-sm mb-1">Agents Count: {department.employees.agents.length}</p>
        <div className="flex flex-wrap gap-2">
          {department.employees.agents.map((agent) => (
            <span key={agent.id} className="bg-[#0F172A] text-sky-400 text-xs px-2 py-1 rounded">
              {agent.fullName}
            </span>
          ))}
        </div>
      </div>

      {/* التصنيفات */}
      <div>
        <p className="text-gray-400 text-sm mb-1">Categories:</p>
        <div className="flex flex-wrap gap-1">
          {department.categories.length > 0 ? (
            department.categories.map((cat, index) => (
              <span key={index} className="text-white text-xs bg-sky-600 px-2 py-0.5 rounded-full">
                {cat}
              </span>
            ))
          ) : (
            <span className="text-gray-600 text-xs">No categories</span>
          )}
        </div>
      </div>
      
      
    </div>
  );
};

export default DepartmentCard;