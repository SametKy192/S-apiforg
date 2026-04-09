import React, { useState, useEffect } from 'react';
import { sendRequest } from '../services/requestService';

const CollectionRunnerModal = ({ isOpen, onClose, collection }) => {
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

  const runCollection = async () => {
    setIsRunning(true);
    const newResults = [];
    const items = collection.items || [];
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const request = item.apiRequest;
        
        try {
            const response = await sendRequest({
                url: request.url,
                method: request.method,
                headers: request.headers,
                body: request.body
            });
            newResults.push({ name: request.name || request.url, status: response.statusCode, success: response.statusCode < 400, duration: response.durationMs });
        } catch (err) {
            newResults.push({ name: request.name || request.url, status: 'Error', success: false, duration: 0 });
        }
        
        setResults([...newResults]);
        setProgress(((i + 1) / items.length) * 100);
    }
    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-white">Collection Runner</h3>
            <p className="text-gray-500 text-xs mt-1">Running: {collection.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {progress > 0 && (
            <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          <div className="space-y-2">
            {results.length === 0 && !isRunning && (
                <div className="text-center py-10">
                    <p className="text-gray-500 italic">No tests run yet. Click "Start Run" to begin.</p>
                </div>
            )}
            {results.map((res, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-950 rounded-xl border border-gray-800 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${res.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-sm font-medium text-gray-200">{res.name}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] text-gray-500 font-mono">{res.duration}ms</span>
                    <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${res.success ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                        {res.status}
                    </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-all"
          >
            Close
          </button>
          <button
            onClick={runCollection}
            disabled={isRunning || (collection.items?.length || 0) === 0}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-blue-900/40"
          >
            {isRunning ? 'Running...' : 'Start Run'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionRunnerModal;
