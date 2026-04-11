import React, { useRef } from 'react';

const DocumentationModal = ({ isOpen, onClose, collection }) => {
  const printRef = useRef();

  if (!isOpen || !collection) return null;

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${collection.name} - API Documentation</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @media print {
              .no-print { display: none; }
              body { background-color: white !important; color: black !important; }
              .glass-card { border: 1px solid #eee !important; box-shadow: none !important; }
            }
            pre { background: #f8f9fa; border-radius: 8px; padding: 1rem; border: 1px solid #e9ecef; }
            .method-badge { padding: 4px 8px; border-radius: 6px; font-weight: 800; font-size: 11px; text-transform: uppercase; }
          </style>
        </head>
        <body class="bg-gray-50 p-8">
          <div class="max-w-4xl mx-auto">
            ${printContent}
          </div>
          <script>
            setTimeout(() => {
               window.print();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
      POST: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      PUT: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      DELETE: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
      PATCH: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    };
    return colors[method?.toUpperCase()] || 'bg-gray-500/10 text-gray-500 border-gray-500/20';
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] w-full max-w-5xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-gray-900/50 backdrop-blur-xl">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>
                </svg>
              </span>
              Documentation Preview
            </h3>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-1">Exporting {collection.name}</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handlePrint}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-400 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              Print / Save PDF
            </button>
            <button onClick={onClose} className="p-2.5 text-slate-500 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-12 bg-white" ref={printRef}>
          {/* Header Section */}
          <div className="mb-16 border-b-4 border-gray-900 pb-12">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Sapiforg Documentation</span>
            </div>
            <h1 className="text-6xl font-black text-gray-900 tracking-tighter mb-4">
              {collection.name}
            </h1>
            <p className="text-gray-500 text-xl font-medium leading-relaxed max-w-2xl">
              {collection.description || "Comprehensive API overview and endpoint technical specifications."}
            </p>
          </div>

          {/* Endpoints List */}
          <div className="space-y-20">
            {collection.items?.map((item, idx) => (
              <div key={item.id} className="relative">
                {/* Endpoint Header */}
                <div className="flex items-start gap-6 mb-8">
                  <span className="text-5xl font-black text-gray-100 absolute -left-12 -top-4 -z-10 select-none">
                    0{idx + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`method-badge border ${getMethodColor(item.request?.method)}`}>
                        {item.request?.method}
                      </span>
                      <code className="text-lg font-bold text-gray-700 font-mono bg-gray-100 px-3 py-1 rounded-lg">
                        {item.request?.url}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Left Column: Headers/Description */}
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Headers</h4>
                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                      {item.request?.headers ? (
                        <pre className="text-xs text-gray-700 bg-transparent border-none p-0">
                          {item.request.headers}
                        </pre>
                      ) : (
                        <p className="text-gray-400 text-xs italic">No custom headers defined.</p>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Body */}
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Request Body</h4>
                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 overflow-hidden">
                      {item.request?.body ? (
                        <pre className="text-xs text-gray-700 bg-transparent border-none p-0 overflow-auto max-h-64">
                          {item.request.body}
                        </pre>
                      ) : (
                        <p className="text-gray-400 text-xs italic">No payload required for this request.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Example Response Preview (Optional) */}
                {item.request?.response && (
                  <div className="mt-8">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Example Response</h4>
                    <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-6">
                       <pre className="text-xs text-emerald-800 bg-transparent border-none p-0">
                        {item.request.response.body}
                       </pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-32 pt-12 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
              Generated by Sapiforg Platform &bull; {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationModal;
