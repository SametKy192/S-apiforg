// ── Response Viewer ─────────────────────────────────────────────
// Backend'den dönen response'u görsel olarak gösterir
const ResponseViewer = ({ response }) => {
  // Status koduna göre renk belirle
  const getStatusColor = (status) => {
    if (status < 300) return 'text-green-400 bg-green-900/30';
    if (status < 400) return 'text-yellow-400 bg-yellow-900/30';
    if (status < 500) return 'text-orange-400 bg-orange-900/30';
    return 'text-red-400 bg-red-900/30';
  };

  // JSON'u güzel formatla
  const formatBody = (body) => {
    try {
      return JSON.stringify(JSON.parse(body), null, 2);
    } catch {
      return body;
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-gray-800 rounded-xl border border-gray-700 p-4">
      {/* Response meta bilgileri */}
      <div className="flex items-center gap-4">
        {/* Status kodu */}
        <span className={`px-3 py-1 rounded-lg text-sm font-medium font-mono ${getStatusColor(response.statusCode)}`}>
          {response.statusCode}
        </span>

        {/* Süre */}
        <span className="text-gray-400 text-sm">
          {response.durationMs} ms
        </span>

        {/* Boyut */}
        <span className="text-gray-400 text-sm">
          {response.sizeBytes < 1024
            ? `${response.sizeBytes} B`
            : `${(response.sizeBytes / 1024).toFixed(1)} KB`}
        </span>
      </div>

      {/* Response body */}
      <div className="flex flex-col gap-2">
        <span className="text-gray-500 text-xs uppercase tracking-wider">Response</span>
        <pre className="px-4 py-3 bg-gray-900 rounded-lg text-green-300 text-sm font-mono overflow-x-auto whitespace-pre-wrap break-words">
          {formatBody(response.body)}
        </pre>
      </div>

      {/* Response headers */}
      {response.headers && (
        <div className="flex flex-col gap-2">
          <span className="text-gray-500 text-xs uppercase tracking-wider">Headers</span>
          <pre className="px-4 py-3 bg-gray-900 rounded-lg text-gray-300 text-sm font-mono overflow-x-auto whitespace-pre-wrap">
            {formatBody(response.headers)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ResponseViewer;