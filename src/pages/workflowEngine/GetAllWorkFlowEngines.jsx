import React, { useState, useEffect } from 'react';
import WorkFlowCard from './components/WorkFlowCard';
import { allRules } from '../../services/workflowEngine/getAllActiveRules';
import Button from '../../components/common/Button';
import { Outlet, useLocation, useOutletContext } from 'react-router-dom';
import LoadingError from '../../components/common/LoadingError';
import LoadingCircle from '../../components/common/LoadingCircle';
import { Menu } from 'lucide-react';
const GetAllWorkFlowEngines = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const isSubCreate = location.pathname.includes("/main/workengine/");
   const context = useOutletContext() || {};
  const { toggleSidebar } = context;
  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('Token') || ''; 
        const data = await allRules(token);
        setWorkflows(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkflows();
  }, [location.pathname]);

  if (isSubCreate) {
    return <Outlet/>
  }
   if (loading) {
    return <LoadingCircle Phrase={"Rules"} />;
  }

  if (error) {
    return <LoadingError Phrase={"Rules"} />;
  }
  return (
    <div className="w-full max-w-6xl mx-auto p-12">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
       <div className='flex flex-row items-start justify-start'>
         <Button 
          onClick={toggleSidebar} 
          className="p-2 text-slate-300 hover:text-sky-400  rounded-lg transition-all shrink-0"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </Button>
        <div className='flex flex-col'>
          <h1 className="text-xl font-semibold text-white">Workflows</h1>
          <p className=" text-base text-slate-400">
            Intelligent automation to orchestrate your ticketing lifecycle with a seamless, friction-free flow.
          </p>
        </div>
       </div>
        
        <Button 
          path={"/main/workengine/create"}
          className=" bg-customButton mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white rounded-lg shadow-sm transition-all duration-200 hover:brightness-110 active:scale-95"
        >
          Create Workflow
        </Button>
      </div>

      <div>
       

        

        {!loading && !error && (
          workflows?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow) => (
                <WorkFlowCard 
                  key={workflow.id} 
                  workflow={workflow} 
                  onDetailsClick={(id) => console.log(id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
              <p className="text-lg">No workflows found.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GetAllWorkFlowEngines;