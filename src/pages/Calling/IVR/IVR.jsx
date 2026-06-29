import { useState, useCallback, useEffect } from 'react';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import IVRSideBar from './components/IVRSideBar';
import IVRCanvas from './components/IVRCanvas';
import MenuNode from './components/MenuNode';
import TransferNode from './components/TransferNode';
import PropertySidebar from './components/PropertySideBar';
import HangupNode from './components/HangupNode';
import VoicEmailNode from './components/VoicEmailNode';
import { useParams } from 'react-router-dom';
import { saveCompleteFlow } from '../../../services/call/IVR/Flow/ivrSyncService';

export default function IVR() {
  const {flowId} = useParams()
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [activePropertyNodeId, setActivePropertyNodeId] = useState(null);
  useEffect(() => {
        console.log("🚨DATA CHANGED", nodes);
      }, [nodes]);



  const toggleProperties = (nodeId) => {
    setActivePropertyNodeId(activePropertyNodeId === nodeId ? null : nodeId);
  };

  const nodeTypes = {
    'main-menu': (props) => <MenuNode {...props} toggleProperties={() => toggleProperties(props.id)} />,
    'transfer': (props) => <TransferNode {...props} toggleProperties={() => toggleProperties(props.id)} />,
    'hangup': (props) => <HangupNode {...props} toggleProperties={() => toggleProperties(props.id)} />,
    'voice': (props) => <VoicEmailNode {...props} toggleProperties={() => toggleProperties(props.id)} />,
  };

  const onNodesChange = useCallback((chgs) => setNodes((nds) => applyNodeChanges(chgs, nds)), []);
  const onEdgesChange = useCallback((chgs) => setEdges((eds) => applyEdgeChanges(chgs, eds)), []);
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);


  const handleSaveClick = async () => {
    await saveCompleteFlow(nodes, edges);
  };
  
  return (

    <div className="flex w-screen h-screen overflow-hidden font-sans bg-secondary">
      <IVRSideBar setNodes={setNodes} />
      
      <main className="flex-grow h-screen relative">
       <button 
          onClick={handleSaveClick}
          className="absolute top-6 end-6 z-50 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-8 rounded-xl shadow-[0_4px_20px_rgba(2,132,199,0.4)] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-[0_6px_25px_rgba(2,132,199,0.6)] flex items-center gap-2"
        >
          Save Flow 
        </button>
        <IVRCanvas
          nodes={nodes} 
          edges={edges} 
          onNodesChange={onNodesChange} 
          onEdgesChange={onEdgesChange} 
          onConnect={onConnect} 
          nodeTypes={nodeTypes}
        />
      </main>
      {activePropertyNodeId && (
        <PropertySidebar
        flowId={flowId}
        nodeId={activePropertyNodeId}
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        close={() => setActivePropertyNodeId(null)}
        />
      )}
    </div>
  );
}