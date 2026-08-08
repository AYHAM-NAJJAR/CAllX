import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

function CommonPieChart({ 
  data, 
  colors = ['#00e676', '#00c853', '#1de9b6', '#00695c'], 
  width = '100%', 
  height = 160,
  innerRadius = 25,
  outerRadius = 45 
}) {
  // معالجة البيانات وتحويلها إلى مصفوفة بشكل آمن تماماً
  let chartData = [];
  if (Array.isArray(data)) {
    chartData = data;
  } else if (data && typeof data === 'object') {
    chartData = Object.entries(data).map(([name, value]) => ({ name, value }));
  }

  if (chartData.length === 0) {
    return <div style={{ fontSize: 12, color: '#888', textAlign: 'center', padding: '20px' }}>لا توجد بيانات للعرض</div>;
  }

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* إعطاء حاوي الـ ResponsiveContainer ارتفاعاً صريحاً */}
      <div style={{ width: '100%', height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={chartData} 
              cx="50%" 
              cy="50%" 
              innerRadius={innerRadius} 
              outerRadius={outerRadius} 
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* مفتاح العناصر (Legend) مع التحكم بالطول والنزول لمنع التداخل */}
      <div style={{ marginTop: '10px', padding: '0 5px', width: '100%', maxheight: '120px', overflowY: 'auto' }}>
        {chartData.map((entry, index) => (
          <div 
            key={`legend-${index}`} 
            style={{ display: 'flex', alignItems: 'center', marginBottom: 4, fontSize: 11 }}
          >
            <div 
              style={{ 
                minWidth: 10, 
                width: 10, 
                height: 10, 
                backgroundColor: colors[index % colors.length], 
                borderRadius: '50%', 
                marginRight: 6,
                marginLeft: 6 
              }} 
            />
   <span style={{ fontWeight: 'bold', marginLeft: '6px', color: '#FFFFFF', fontSize: '15px' }}>{entry.value} : </span>
<span style={{ color: '#FFFFFF', fontSize: '15px', wordBreak: 'break-all', marginLeft:"4px" , fontWeight: 'bold' }}> {entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommonPieChart;