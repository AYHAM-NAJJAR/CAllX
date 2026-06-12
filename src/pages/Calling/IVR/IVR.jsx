import { useState, useCallback } from 'react';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import IVRSideBar from './components/IVRSideBar';
import IVRCanvas from './components/IVRCanvas';
import MenuNode from './components/MenuNode';
import TransferNode from './components/TransferNode';
import PropertySidebar from './components/PropertySideBar';
import HangupNode from './components/HangupNode';
import VoicEmailNode from './components/VoicEmailNode';

export default function IVR() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [activePropertyNodeId, setActivePropertyNodeId] = useState(null);

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

  return (
    <div className="flex w-screen h-screen overflow-hidden font-sans bg-secondary">
      <IVRSideBar setNodes={setNodes} />
      <main className="flex-grow h-screen relative">
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
          nodeId={activePropertyNodeId}
          nodes={nodes}
          setNodes={setNodes}
          close={() => setActivePropertyNodeId(null)} 
        />
      )}
    </div>
  );
}