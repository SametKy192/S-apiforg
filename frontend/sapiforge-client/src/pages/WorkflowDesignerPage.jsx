import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  addEdge, 
  applyNodeChanges, 
  applyEdgeChanges,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { getAllCollections, getCollectionById } from '../services/collectionService';
import { sendRequest } from '../services/requestService';
import useSettingsStore from '../store/settingsStore';
import useRequestStore from '../store/requestStore';
import { translations } from '../i18n/translations';

const WorkflowDesignerPage = () => {
  const { language } = useSettingsStore();
  const { activeEnvironment } = useRequestStore();
  const t = translations[language].workflow;
  const common = translations[language].common;

  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [executionLog, setExecutionLog] = useState([]);
  
  // Workflow-specific environment (accumulates results)
  const workflowEnv = useRef({});

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const data = await getAllCollections();
      setCollections(data || []);
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
        type: 'default',
        data: { 
          item: item,
          status: 'idle', // idle, running, success, error
          label: (
            <div className="p-5 glass-card min-w-[240px] group transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-[10px] font-black px-2.5 py-1 rounded border-2 ${
                  item.request.method === 'GET' ? 'bg-emerald-500/5 text-emerald-600 border-emerald-500/10' :
                  item.request.method === 'POST' ? 'bg-indigo-500/5 text-indigo-600 border-indigo-500/10' : 
                  'bg-rose-500/5 text-rose-600 border-rose-500/10'
                }`}>
                  {item.request.method}
                </span>
                <div className="flex items-center gap-1.5" id={`status-${item.id}`}>
                   <div className="w-2 h-2 bg-slate-200 dark:bg-white/10 rounded-full"></div>
                </div>
              </div>
              <h4 className="text-[var(--text-primary)] text-sm font-bold truncate mb-1 font-space tracking-tight">{item.name || item.request.url.split('/').pop()}</h4>
              <p className="text-[var(--text-secondary)] text-[10px] truncate opacity-50 font-medium">{item.request.url}</p>
            </div>
          ) 
        },
        position: { x: 250, y: index * 180 + 50 },
      }));

      const newEdges = [];
      for (let i = 0; i < newNodes.length - 1; i++) {
        newEdges.push({
          id: `edge-${i}`,
          source: newNodes[i].id,
          target: newNodes[i+1].id,
          animated: true,
          style: { stroke: 'var(--accent-blue)', strokeWidth: 2, opacity: 0.2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--accent-blue)' },
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

  // Basic variable substitution
  const replaceVariables = (text, env) => {
    if (!text) return text;
    let newText = text;
    Object.entries(env).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      newText = newText.replace(regex, value);
    });
    return newText;
  };

  const updateNodeStatus = (nodeId, status, response = null) => {
    setNodes((nds) => nds.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            status: status,
            label: React.cloneElement(node.data.label, {}, 
                <div className="p-4 glass-card border-[var(--border-glass)] rounded-2xl shadow-2xl min-w-[220px]">
                    <div className="flex items-center justify-between mb-3">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                        node.data.item.request.method === 'GET' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                        {node.data.item.request.method}
                        </span>
                        <div className="flex items-center gap-1.5">
                            {status === 'running' && <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>}
                            {status === 'success' && <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>}
                            {status === 'error' && <div className="w-2 h-2 bg-rose-500 rounded-full"></div>}
                            <span className={`text-[9px] font-black uppercase tracking-widest ${
                                status === 'success' ? 'text-emerald-500' : status === 'error' ? 'text-rose-500' : 'text-blue-500'
                            }`}>
                                {response ? response.statusCode : status}
                            </span>
                        </div>
                    </div>
                    <h4 className="text-[var(--text-primary)] text-xs font-bold truncate mb-1">{node.data.item.name}</h4>
                    <p className="text-[var(--text-secondary)] text-[9px] truncate opacity-40">{node.data.item.request.url}</p>
                </div>
            )
          }
        };
      }
      return node;
    }));
  };

  const runWorkflow = async () => {
    if (isRunning || nodes.length === 0) return;
    
    setIsRunning(true);
    setExecutionLog([]);
    workflowEnv.current = activeEnvironment?.variables ? JSON.parse(activeEnvironment.variables) : {};

    // Reset all nodes
    setNodes(nds => nds.map(n => ({ ...n, data: { ...n.data, status: 'idle' } })));

    try {
      for (const node of nodes) {
        updateNodeStatus(node.id, 'running');
        
        const item = node.data.item;
        const subReq = {
          method: item.request.method,
          url: replaceVariables(item.request.url, workflowEnv.current),
          headers: replaceVariables(item.request.headers, workflowEnv.current),
          body: replaceVariables(item.request.body, workflowEnv.current),
        };

        try {
          const res = await sendRequest(subReq);
          
          if (res.statusCode >= 400) throw new Error(`HTTP ${res.statusCode}`);

          // Chaining: Merge response data into environment
          if (res.body) {
            try {
              const bodyJson = JSON.parse(res.body);
              workflowEnv.current = { ...workflowEnv.current, ...bodyJson };
            } catch { /* ignore non-json */ }
          }

          updateNodeStatus(node.id, 'success', res);
          setExecutionLog(prev => [...prev, { name: item.name, status: 'success', statusLine: res.statusCode }]);
        } catch (err) {
          updateNodeStatus(node.id, 'error');
           setExecutionLog(prev => [...prev, { name: item.name, status: 'error', error: err.message }]);
          break; // Stop on error
        }
      }
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg-main)]">
      {/* Designer Header */}
      <div className="p-8 border-b border-[var(--border-glass)] bg-[var(--bg-main)]/50 backdrop-blur-xl flex items-center justify-between z-10 shadow-2xl shadow-black/50">
        <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[var(--text-on-accent)]">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
            </div>
            <div>
                <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">{t.title}</h1>
                <p className="text-[var(--text-secondary)] text-xs font-medium uppercase tracking-widest">{t.subtitle}</p>
            </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 mr-4">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Env</span>
               <div className="px-4 py-2 glass-item rounded-xl text-[10px] font-bold text-blue-400">
                    {activeEnvironment?.name || "NONE"}
               </div>
          </div>

          <div className="relative">
            <select 
              value={selectedCollectionId}
              onChange={handleCollectionChange}
              disabled={isRunning}
              className="px-6 py-3 glass-item rounded-2xl text-[var(--text-primary)] text-xs font-bold focus:ring-2 ring-blue-500/20 border-none outline-none appearance-none cursor-pointer min-w-[240px] pr-12 transition-all hover:bg-white/5 disabled:opacity-50"
            >
              <option value="" className="bg-[var(--bg-sidebar)]">{t.selectCollection}</option>
              {collections.map(c => (
                <option key={c.id} value={c.id} className="bg-[var(--bg-sidebar)]">{c.name}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={runWorkflow}
            disabled={isRunning || nodes.length === 0}
            className={`px-10 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-3 ${
                isRunning ? 'bg-slate-700 text-slate-400' : 'bg-emerald-600 hover:bg-emerald-500 text-[var(--text-on-accent)] shadow-emerald-500/20'
            }`}
          >
            {isRunning ? (
                <div className="w-4 h-4 border-2 border-[var(--text-on-accent)]/20 border-t-[var(--text-on-accent)] rounded-full animate-spin"></div>
            ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
            )}
            {isRunning ? 'Running...' : 'Run Workflow'}
          </button>
        </div>
      </div>

      {/* Main Canvas + Debug Panel */}
      <div className="flex-1 flex overflow-hidden">
          {/* Canvas Area */}
          <div className="flex-1 relative border-r border-[var(--border-glass)]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              style={{ background: 'transparent' }}
            >
              <Background color="var(--border-glass)" gap={20} />
              <Controls />
            </ReactFlow>

            {nodes.length === 0 && !selectedCollectionId && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-1000">
                    <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-6 border border-dashed border-white/10">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="1" className="opacity-30">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                        </svg>
                    </div>
                    <h3 className="text-[var(--text-secondary)] font-bold text-xl uppercase tracking-tight opacity-40">{t.ready}</h3>
                    <p className="text-[var(--text-secondary)] text-sm mt-3 max-w-sm text-center leading-relaxed font-medium opacity-30">{t.readySubtitle}</p>
                </div>
            )}
          </div>

          {/* Execution Log / Execution Feed */}
          {(executionLog.length > 0 || isRunning) && (
              <div className="w-80 bg-[var(--bg-sidebar)] flex flex-col animate-in slide-in-from-right duration-500">
                  <div className="p-6 border-b border-[var(--border-glass)]">
                      <h3 className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1">Execution Log</h3>
                      <p className="text-[var(--text-primary)] font-bold text-xs">Real-time Activity</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                      {executionLog.map((log, idx) => (
                          <div key={idx} className="p-3 glass-item rounded-xl border-white/5 animate-in zoom-in-95 duration-200">
                              <div className="flex items-center justify-between mb-1">
                                  <span className="text-[10px] text-[var(--text-primary)] font-bold truncate max-w-[120px]">{log.name}</span>
                                  <span className={`text-[9px] font-black uppercase ${log.status === 'success' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                      {log.status === 'success' ? `Ok ${log.statusLine}` : 'Fail'}
                                  </span>
                              </div>
                              {log.error && <p className="text-[9px] text-rose-400 opacity-70 font-mono italic">{log.error}</p>}
                          </div>
                      ))}
                      {isRunning && (
                          <div className="p-4 flex flex-col items-center justify-center gap-3 opacity-40">
                              <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                              <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Processing...</span>
                          </div>
                      )}
                  </div>
                  <div className="p-4 border-t border-[var(--border-glass)] bg-black/20">
                      <div className="flex justify-between items-center text-[10px] font-bold">
                          <span className="text-slate-500">Workflow Progress</span>
                          <span className="text-[var(--text-primary)]">{Math.round((executionLog.length / (nodes.length || 1)) * 100)}%</span>
                      </div>
                      <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                           <div 
                            className="h-full bg-blue-500 transition-all duration-500" 
                            style={{ width: `${(executionLog.length / nodes.length) * 100}%` }}
                           ></div>
                      </div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default WorkflowDesignerPage;
