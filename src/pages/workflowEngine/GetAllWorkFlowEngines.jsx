import React, { useState, useEffect } from 'react';
import WorkFlowCard from './components/WorkFlowCard';
import { allRules } from '../../services/workflowEngine/getAllActiveRules';
import Button from '../../components/common/Button';
import { Outlet, useLocation } from 'react-router-dom';

const GetAllWorkFlowEngines = () => {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const isSubCreate = location.pathname.includes("/main/workengine/");
  
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

  return (
    <div className="w-full max-w-6xl mx-auto p-12">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white">Workflows</h1>
          <p className="mt-2 text-base text-slate-400">
            Intelligent automation to orchestrate your ticketing lifecycle with a seamless, friction-free flow.
          </p>
        </div>
        <Button 
          path={"/main/workengine/create"}
          className=" bg-customButton mt-4 sm:mt-0 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white rounded-lg shadow-sm transition-all duration-200 hover:brightness-110 active:scale-95"
        >
          Create Workflow
        </Button>
      </div>

      <div>
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D9EF2]"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-950/40 border border-red-500/50 text-red-200 p-4 rounded-xl text-center my-6">
            <p>Error: {error}</p>
          </div>
        )}

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