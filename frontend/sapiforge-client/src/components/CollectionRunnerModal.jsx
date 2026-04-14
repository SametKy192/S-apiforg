import React, { useState, useEffect } from 'react';
import { sendRequest } from '../services/requestService';
import { executeScript } from '../services/scriptService';
import { updateEnvironment } from '../services/environmentService';
import useRequestStore from '../store/requestStore';

const CollectionRunnerModal = ({ isOpen, onClose, collection }) => {
  const { activeEnvironment, setActiveEnvironment } = useRequestStore();
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setResults([]);
      setProgress(0);
      setIsRunning(false);
    }
  }, [isOpen]);

  if (!isOpen || !collection) return null;

  const replaceVariables = (text, envVars) => {
    if (!text || !envVars) return text;
    let newText = text;
    Object.entries(envVars).forEach(([key, value]) => {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      newText = newText.replace(regex, String(value));
    });
    return newText;
  };

  const runCollection = async () => {
    setIsRunning(true);
    const newResults = [];
    const items = collection.items || [];
    
    let currentEnvVars = activeEnvironment?.variables 
      ? JSON.parse(activeEnvironment.variables) 
      : {};

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const apiRequest = item.apiRequest; // Note: correct property name from viewing CollectionsPage
        
        try {
            // 1. Pre-request Script
            if (apiRequest.preRequestScript && activeEnvironment) {
                currentEnvVars = executeScript(apiRequest.preRequestScript, { environment: currentEnvVars });
            }

            // 2. Variable Substitution
            const substitutedUrl = replaceVariables(apiRequest.url, currentEnvVars);
            const substitutedHeaders = replaceVariables(apiRequest.headers, currentEnvVars);
            const substitutedBody = replaceVariables(apiRequest.body, currentEnvVars);

            // 3. Send Request
            const response = await sendRequest({
                url: substitutedUrl,
                method: apiRequest.method,
                headers: substitutedHeaders,
                body: substitutedBody
            });

            // 4. Post-request Script (Tests)
            if (apiRequest.testScript && activeEnvironment) {
                currentEnvVars = executeScript(apiRequest.testScript, { environment: currentEnvVars, response });
            }

            newResults.push({ 
                name: apiRequest.name || apiRequest.url, 
                status: response.statusCode, 
                success: response.statusCode < 400, 
                duration: response.durationMs 
            });
        } catch (err) {
            newResults.push({ name: apiRequest.name || apiRequest.url, status: 'Error', success: false, duration: 0 });
        }
        
        setResults([...newResults]);
        setProgress(((i + 1) / items.length) * 100);
    }

    // 5. Finalize Environment Updates
    if (activeEnvironment) {
        const finalVarsJson = JSON.stringify(currentEnvVars);
        if (finalVarsJson !== activeEnvironment.variables) {
            try {
                const updatedEnv = { ...activeEnvironment, variables: finalVarsJson };
                await updateEnvironment(activeEnvironment.id, updatedEnv);
                setActiveEnvironment(updatedEnv);
            } catch (err) {
                console.error('Failed to sync environment after collection run:', err);
            }
        }
    }

    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-card border-white/10 w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden rounded-[2.5rem] animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight uppercase">Collection Runner</h3>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{collection.name}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-all">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 p-8 overflow-y-auto space-y-6">
          {progress > 0 && (
            <div className="space-y-3">
               <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Progress</span>
                  <span className="text-[10px] font-black text-blue-400 uppercase font-mono">{Math.round(progress)}%</span>
               </div>
               <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/5">
                 <div 
                   className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full transition-all duration-500 shadow-[0_0_12px_rgba(37,99,235,0.4)]" 
                   style={{ width: `${progress}%` }}
                 ></div>
               </div>
            </div>
          )}

          <div className="space-y-3">
            {results.length === 0 && !isRunning && (
                <div className="flex flex-col items-center justify-center py-16 bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-slate-600">
                         <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                             <polygon points="5 3 19 12 5 21 5 3"/>
                         </svg>
                    </div>
                    <p className="text-slate-400 font-bold">Ready to Launch</p>
                    <p className="text-slate-600 text-xs mt-1 uppercase tracking-widest font-medium">Click start run to begin sequence</p>
                </div>
            )}
            {results.map((res, index) => (
              <div key={index} className="flex items-center justify-between p-5 glass-item rounded-2xl border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-4">
                    <div className={`w-2.5 h-2.5 rounded-full ${res.success ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-white truncate max-w-[300px]">{res.name}</span>
                        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5">{res.success ? 'Passed' : 'Failed'}</span>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Duration</div>
                        <div className="text-xs font-bold text-slate-300 font-mono">{res.duration}ms</div>
                    </div>
                    <div className={`min-w-[60px] text-center px-3 py-1.5 rounded-xl border font-bold font-mono text-xs ${res.success ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20'}`}>
                        {res.status}
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 border-t border-white/5 flex justify-end gap-4 bg-white/5">
          <button
            onClick={onClose}
            className="btn-ghost px-8 py-3 text-[11px] font-black uppercase tracking-widest"
          >
            Cancel
          </button>
          <button
            onClick={runCollection}
            disabled={isRunning || (collection.items?.length || 0) === 0}
            className="btn-primary px-10 py-3 shadow-blue-500/25 min-w-[160px]"
          >
            {isRunning ? (
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 <span className="text-[11px] font-black uppercase tracking-widest">Running...</span>
              </div>
            ) : (
              <span className="text-[11px] font-black uppercase tracking-widest">Start Sequence</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionRunnerModal;
