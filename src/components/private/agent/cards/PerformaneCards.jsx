

function PerformaneCards({title , number}) {
  return (
        
            <div className="bg-[#161b2a] rounded-lg  p-4 ">
                <div className='flex flex-col items-center justify-center'>
                    <p className="text-sm">{title}</p>
                    <p className="text-lg text-sky-400 font-bold">{number}</p>      
                </div>
            </div>
        
)
}

export default PerformaneCards