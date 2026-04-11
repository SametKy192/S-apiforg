import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { getAllCollections, getCollectionById } from '../services/collectionService';

const initialNodes = [];
const initialEdges = [];

const WorkflowDesignerPage = () => {
  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const data = await getAllCollections();
      setCollections(data);
    } catch (err) {
      console.error('Failed to fetch collections:', err);
    }
  };

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const loadWorkflow = async (id) => {
    if (!id) return;
    try {
      const collection = await getCollectionById(id);
      if (!collection?.items) return;

      const newNodes = collection.items.map((item, index) => ({
        id: `node-${item.id}`,
        data: { 
          label: (
            <div className="p-4 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                  item.request.method === 'GET' ? 'bg-emerald-500/10 text-emerald-500' :
                  item.request.method === 'POST' ? 'bg-blue-500/10 text-blue-500' : 'bg-orange-500/10 text-orange-500'
                }`}>
                  {item.request.method}
                </span>
                <span className="text-white text-[11px] font-bold truncate">{item.request.url.split('/').pop() || '/'}</span>
              </div>
              <p className="text-slate-500 text-[10px] truncate">{item.request.url}</p>
            </div>
          ) 
        },
        position: { x: 250, y: index * 150 + 50 },
        // draggable: true,
      }));

      const newEdges = [];
      for (let i = 0; i < newNodes.length - 1; i++) {
        newEdges.push({
          id: `edge-${i}`,
          source: newNodes[i].id,
          target: newNodes[i+1].id,
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#3b82f6',
          },
        });
      }

      setNodes(newNodes);
      setEdges(newEdges);
    } catch (err) {
      console.error('Failed to load workflow:', err);
    }
  };

  const handleCollectionChange = (e) => {
    const id = e.target.value;
    setSelectedCollectionId(id);
    loadWorkflow(id);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      {/* Designer Header */}
      <div className="p-8 border-b border-white/5 bg-slate-950/50 backdrop-blur-xl flex items-center justify-between z-10">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
            <span className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </span>
            Workflow Designer
          </h1>
          <p className="text-slate-500 text-xs font-medium mt-1">Visualize and connect your API orchestration flow.</p>
        </div>

        <div className="flex items-center gap-4">
          <select 
            value={selectedCollectionId}
            onChange={handleCollectionChange}
            className="px-6 py-3 glass-item rounded-2xl text-white text-xs font-bold focus:ring-2 ring-blue-500/20 border-none outline-none appearance-none cursor-pointer min-w-[240px]"
          >
            <option value="">Select a Collection...</option>
            {collections.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          
          <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
            Auto-Layout
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          style={{ background: '#020617' }}
          theme="dark"
        >
          <Background color="#1e293b" gap={20} />
          <Controls className="bg-slate-900 border-white/10 fill-white" />
          <MiniMap 
            nodeColor="#3b82f6" 
            maskColor="rgba(2, 6, 23, 0.7)" 
            className="bg-slate-900 border border-white/10 rounded-xl"
            style={{ height: 120 }}
          />
        </ReactFlow>

        {nodes.length === 0 && !selectedCollectionId && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 border border-dashed border-white/10">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5">
                         <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                    </svg>
                </div>
                <h3 className="text-slate-400 font-bold text-lg">Designer Ready</h3>
                <p className="text-slate-600 text-sm mt-2">Choose a collection from the top menu to visualize its flow.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowDesignerPage;
