import { useState } from 'react';
import RequestBuilder from '../components/RequestBuilder';
import ResponseViewer from '../components/ResponseViewer';
import { sendRequest } from '../services/requestService';
import useRequestStore from '../store/requestStore';

// ── Request sayfası ─────────────────────────────────────────────
// Kullanıcının API isteği gönderdiği ana sayfa
const RequestPage = () => {
  const { 
    tabs, 
    activeTabId, 
    setActiveTab, 
    addTab, 
    closeTab, 
    setLoading, 
    setError, 
    setCurrentResponse 
  } = useRequestStore();

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  const { response: currentResponse, isLoading, error: localError } = activeTab;

  // İsteği gönder
  const handleSend = async (requestData) => {
    setLoading(true);
    setError(null);
    setCurrentResponse(null);

    try {
      const response = await sendRequest(requestData);
      setCurrentResponse(response);
      if (requestData.onSuccess) {
        requestData.onSuccess(response);
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'İstek gönderilemedi. Hedef sunucu çalışmıyor olabilir.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Tab bar - Enhanced Visibility */}
      <div className="flex items-center gap-0 px-2 pt-2 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              group relative flex items-center gap-3 px-6 py-3 text-sm font-semibold cursor-pointer transition-all duration-200 rounded-t-xl
              ${activeTabId === tab.id 
                ? 'bg-gray-950 text-blue-400 border-t-2 border-t-blue-500 border-x border-gray-800 z-10 shadow-[0_-4px_12px_rgba(59,130,246,0.1)]' 
                : 'text-gray-500 hover:text-gray-200 hover:bg-gray-800/40 border-t-2 border-t-transparent'}
            `}
          >
            {/* Status dot or icon */}
            <div className={`w-1.5 h-1.5 rounded-full ${activeTabId === tab.id ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-gray-700'}`}></div>
            
            <span className="truncate max-w-[140px] tracking-tight">{tab.name || 'New Request'}</span>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className={`
                p-1 ml-2 rounded-md transition-all duration-200
                ${activeTabId === tab.id 
                  ? 'text-gray-600 hover:text-red-400 hover:bg-red-400/10' 
                  : 'opacity-0 group-hover:opacity-100 text-gray-700 hover:text-red-400 hover:bg-red-400/10'}
              `}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Inactive tab separator */}
            {activeTabId !== tab.id && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 bg-gray-800 group-hover:hidden"></div>
            )}
          </div>
        ))}

        {/* New Tab Button - More prominent */}
        <button
          onClick={addTab}
          className="flex items-center gap-2 px-4 py-2 ml-4 text-xs font-bold text-gray-500 hover:text-blue-400 hover:bg-blue-500/5 border border-transparent hover:border-blue-500/20 rounded-xl transition-all active:scale-95"
          title="New Request Tab"
        >
          <svg className="w-5 h-5 p-1 bg-gray-800 rounded-lg group-hover:bg-blue-500/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="12 4v16m8-8H4" />
          </svg>
          <span className="uppercase tracking-widest hidden lg:block">Add Tab</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* İstek oluşturucu */}
        <RequestBuilder 
          key={activeTabId} // Reset component state when switching tabs
          initialData={activeTab.request}
          onSend={handleSend} 
          isLoading={isLoading} 
        />

        {/* Hata mesajı */}
        {localError && (
          <div className="p-4 bg-red-900/20 border border-red-800 rounded-xl">
            <p className="text-red-400 text-sm font-mono">{localError}</p>
          </div>
        )}

        {/* Response görüntüleyici */}
        {currentResponse && (
          <ResponseViewer
            response={currentResponse}
            requestId={currentResponse.apiRequestId}
          />
        )}
      </div>
    </div>
  );
};

export default RequestPage;