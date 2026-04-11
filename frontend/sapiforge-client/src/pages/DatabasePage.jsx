import React, { useState, useEffect } from 'react';
import { getTables, executeQuery } from '../services/databaseService';

const DatabasePage = () => {
  const [tables, setTables] = useState([]);
  const [activeTable, setActiveTable] = useState('');
  const [sql, setSql] = useState('SELECT * FROM Requests LIMIT 10');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const data = await getTables();
      setTables(data);
    } catch (err) {
      console.error('Tables could not be fetched:', err);
    }
  };

  const runQuery = async (queryOverride) => {
    const queryToRun = queryOverride || sql;
    setIsLoading(true);
    setError('');
    try {
      const data = await executeQuery(queryToRun);
      setResults(data);
    } catch (err) {
      setError(err.response?.data || err.message);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTableClick = (tableName) => {
    setActiveTable(tableName);
    const newSql = `SELECT * FROM ${tableName} LIMIT 50`;
    setSql(newSql);
    runQuery(newSql);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {/* Table Sidebar (Within Page) */}
      <div className="w-64 border-r border-white/5 flex flex-col bg-slate-900/50">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Schema Browser</h2>
          <p className="text-white font-bold text-sm mt-1">Available Tables</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {tables.map(table => (
            <button
              key={table}
              onClick={() => handleTableClick(table)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTable === table 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                   <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/>
                </svg>
                {table}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* SQL Editor Area */}
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-black text-white tracking-tight">SQL Console</h1>
            <button
              onClick={() => runQuery()}
              disabled={isLoading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              )}
              {isLoading ? 'Executing...' : 'Run Query'}
            </button>
          </div>
          
          <div className="relative glass-card border-white/5 p-2 rounded-3xl overflow-hidden">
            <textarea
              className="w-full h-32 bg-transparent text-blue-400 font-mono text-sm p-4 focus:outline-none resize-none"
              spellCheck="false"
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder="Enter your SQL query here... (SELECT statements only)"
            />
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-auto p-8 pt-0">
          {error && (
            <div className="mb-6 p-6 bg-rose-500/5 border border-rose-500/20 rounded-[2rem] flex gap-4">
              <div className="w-10 h-10 bg-rose-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
                </svg>
              </div>
              <div>
                <h4 className="text-rose-400 font-black text-xs uppercase tracking-widest mb-1">Execution Error</h4>
                <p className="text-slate-400 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {results.length > 0 ? (
            <div className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      {Object.keys(results[0]).map(key => (
                        <th key={key} className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-400 text-xs font-medium">
                    {results.map((row, i) => (
                      <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-6 py-4 truncate max-w-xs">
                            {val?.toString() || ''}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-white/5 border-t border-white/5 flex justify-between items-center">
                 <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Total Rows: {results.length}</span>
                  <span className="text-[10px] font-bold text-emerald-500 italic bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest">Execution Successful</span>
              </div>
            </div>
          ) : !isLoading && !error && (
            <div className="h-full flex flex-col items-center justify-center py-20 opacity-30">
               <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                 <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/>
               </svg>
               <p className="mt-4 font-bold text-sm tracking-widest uppercase">No Data Loaded</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatabasePage;
