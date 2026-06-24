import HangupSideProperties from "./HangupSideProperties";
import MenuSideProperities from "./MenuSideProperities";
import TransferSideProperities from "./TransferSideProperities";
import VoicemailSideProperties from "./VoicEamilSideProperities";
import VoicEmailNode from "./VoicEmailNode";


export default function PropertySidebar({ nodeId, setNodes  , edges  ,nodes, close ,flowId }) {
  const currentNode = nodes.find(n => n.id === nodeId);
  
  if (!currentNode) return null;

  // قاموس يربط نوع العقدة بمكون الـ Sidebar الخاص بها
  const SidebarComponents = {
    'main-menu': MenuSideProperities,
    'transfer': TransferSideProperities,
    'hangup': HangupSideProperties,
    'voice':  VoicemailSideProperties ,
  };

  const SelectedComponent = SidebarComponents[currentNode.type];

  return (
    <div className="w-[350px] h-screen bg-[#111827] border-l border-slate-700 shadow-2xl z-50 absolute right-0 top-0 text-white overflow-y-auto">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center">
        <h1>In Flow {flowId}</h1>
        <h2 className="font-bold">{currentNode.type} Properities</h2>

        <button onClick={close} className="text-slate-400 hover:text-white">Close</button>
      </div>
      
      
      {SelectedComponent ? (
        <div className=""> 
            <SelectedComponent
            flowId={flowId}
            setNodes={setNodes}
            node={currentNode} 
            edges={edges}
            />
            
        </div>
      ) : (
        <div className="p-4 text-slate-500">لا يوجد إعدادات لهذا النوع</div>
      )}
    </div>
  );
}