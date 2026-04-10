import { useState } from 'react';
import { getAllCollections, createCollection } from '../services/collectionService';
import { getAllEnvironments, createEnvironment } from '../services/environmentService';
import { getAllMocks, createMock } from '../services/mockService';

const BackupModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  if (!isOpen) return null;

  const handleExport = async () => {
    setLoading(true);
    setStatus('Preparing data...');
    try {
      const collections = await getAllCollections();
      const environments = await getAllEnvironments();
      const mocks = await getAllMocks();

      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        collections,
        environments,
        mocks
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sapiforge_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus('Backup downloaded successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setStatus('Export failed. Check console.');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setStatus('Importing data...');
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        
        // Import Collections
        if (data.collections) {
          for (const col of data.collections) {
            // Remove ID to create as new
            const { id, ...newCol } = col;
            await createCollection(newCol);
          }
        }

        // Import Environments
        if (data.environments) {
          for (const env of data.environments) {
            const { id, ...newEnv } = env;
            await createEnvironment(newEnv);
          }
        }

        // Import Mocks
        if (data.mocks) {
          for (const mock of data.mocks) {
            const { id, ...newMock } = mock;
            await createMock(newMock);
          }
        }

        setStatus('Import completed successfully! Reloading...');
        setTimeout(() => window.location.reload(), 2000);
      } catch (error) {
        console.error('Import failed:', error);
        setStatus('Import failed. Invalid file format.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Backup & Restore</h2>
              <p className="text-slate-400 text-sm mt-1">Manage your Sapiforge data.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          <div className="space-y-6">
            <div className="glass-item p-6 rounded-2xl group cursor-pointer" onClick={handleExport}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold">Export Data</h3>
                  <p className="text-slate-500 text-xs">Download all collections, envs, and mocks.</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </div>
            </div>

            <label className="block">
              <div className="glass-item p-6 rounded-2xl group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Restore Data</h3>
                    <p className="text-slate-500 text-xs">Upload a previous Sapiforge backup file.</p>
                  </div>
                  <input type="file" className="hidden" accept=".json" onChange={handleImport} disabled={loading} />
                </div>
              </div>
            </label>
          </div>

          {status && (
            <div className={`mt-6 p-4 rounded-xl text-center text-sm font-medium ${status.includes('failed') ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
              {status}
            </div>
          )}

          {loading && (
            <div className="mt-6 flex justify-center">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <button onClick={onClose} className="btn-ghost text-sm">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupModal;
