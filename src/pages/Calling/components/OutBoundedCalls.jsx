import React from 'react'

function OutBoundedCalls({name , sub , wait }) {
  return (
    <div className="space-y-3">
            
              <div className="bg-[#161b2a] border border-gray-800 p-4 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1c2438] rounded-full flex items-center justify-center text-gray-400">
                    👤
                  </div>
                  <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-xs text-gray-500">{sub}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Duration</div>
                  <div className="font-bold text-gray-300">{wait}</div>
                </div>
              </div>
            
          </div>
  )
}

export default OutBoundedCalls