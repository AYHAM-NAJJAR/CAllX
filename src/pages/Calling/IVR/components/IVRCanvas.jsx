import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import MenuNode from './MenuNode'; // الاستيراد هنا




export default function IVRCanvas({ nodes, edges, onNodesChange, onEdgesChange, onConnect , nodeTypes}) {
  return (
    <div className="w-full h-full">
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange} 
        onEdgesChange={onEdgesChange} 
        onConnect={onConnect} 
        nodeTypes={nodeTypes} 
        fitView 
      >
        <Controls />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}