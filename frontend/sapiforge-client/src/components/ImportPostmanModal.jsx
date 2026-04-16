import React, { useState } from 'react';
import { createCollection, addItemToCollection } from '../services/collectionService';
import api from '../services/api';

const ImportPostmanModal = ({ isOpen, onClose, onImportSuccess }) => {
  const [jsonContent, setJsonContent] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleImport = async () => {
    setIsImporting(true);
    setError(null);
    try {
      const data = JSON.parse(jsonContent);
      
      // Basic check if it's a postman collection
      const collectionName = data.info?.name || 'Imported Collection';
      
      // 1. Create Collection
      const newCol = await createCollection({
        name: collectionName,
        description: data.info?.description || 'Imported from Postman'
      });

      const items = data.item || [];
      
      // 2. Process items (this is a simplified recursive parser)
      const processItems = async (itemList) => {
        for (const item of itemList) {
          if (item.request) {
            // It's a request
            const req = item.request;
            const bodyContent = req.body?.raw || '';
            const headerContent = (req.header || []).map(h => `${h.key}: ${h.value}`).join('\n');
            const url = typeof req.url === 'string' ? req.url : req.url?.raw || '';

            // We need to create the ApiRequest in the DB first
            // Since we don't have a direct "Save" endpoint without Send, 
            // we will use the SEND endpoint but the backend will save it to history.
            // THIS IS A WORKAROUND. Ideally we'd have a Save endpoint.
            try {
                const response = await api.post('/Request/send', {
                    url,
                    method: req.method,
                    headers: headerContent,
                    body: bodyContent,
                    name: item.name
                });
                
                if (response.data?.apiRequestId) {
                    await addItemToCollection(newCol.id, response.data.apiRequestId);
                }
            } catch (e) {
                console.error('Failed to import item:', item.name, e);
            }
          } else if (item.item) {
            // It's a folder
            await processItems(item.item);
          }
        }
      };

      await processItems(items);
      
      onImportSuccess();
      onClose();
    } catch (err) {
      setError('Invalid JSON or Postman format');
      console.error(err);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col">
        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Import Postman Collection</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-gray-400 text-sm">Paste your Postman Collection JSON (v2.1) or upload a file:</p>
            <label className="cursor-pointer px-3 py-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all">
                Select File
                <input 
                    type="file" 
                    className="hidden" 
                    accept=".json"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => setJsonContent(event.target.result);
                            reader.readAsText(file);
                        }
                    }}
                />
            </label>
          </div>
          <textarea
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            placeholder='{ "info": { ... }, "item": [ ... ] }'
            className="w-full h-64 px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-blue-300 text-xs font-mono focus:outline-none focus:border-blue-500 resize-none overflow-auto custom-scrollbar"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>

        <div className="p-5 border-t border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={isImporting || !jsonContent}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-blue-900/40"
          >
            {isImporting ? 'Importing...' : 'Import Collection'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportPostmanModal;
