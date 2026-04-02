import { useState, useEffect } from 'react';
import useRequestStore from '../store/requestStore';

// HTTP metodları ve renkleri
const METHODS = [
  { value: 'GET', color: 'text-green-400' },
  { value: 'POST', color: 'text-blue-400' },
  { value: 'PUT', color: 'text-yellow-400' },
  { value: 'DELETE', color: 'text-red-400' },
  { value: 'PATCH', color: 'text-purple-400' },
];

// ── Request Builder ─────────────────────────────────────────────
// Kullanıcının URL, method, header ve body girdiği bileşen
const RequestBuilder = ({ onSend, isLoading }) => {
  // Store'daki currentRequest'i dinle — geçmişten istek yüklenince güncellenir
  const { currentRequest } = useRequestStore();

  const [method, setMethod] = useState(currentRequest.method || 'GET');
  const [url, setUrl] = useState(currentRequest.url || '');
  const [headers, setHeaders] = useState(currentRequest.headers || '');
  const [body, setBody] = useState(currentRequest.body || '');
  const [activeTab, setActiveTab] = useState('headers');

  // Store'daki currentRequest değişince form alanlarını güncelle
  // Geçmişten "Tekrar Gönder" butonuna basılınca tetiklenir
  useEffect(() => {
    setMethod(currentRequest.method || 'GET');
    setUrl(currentRequest.url || '');
    setHeaders(currentRequest.headers || '');
    setBody(currentRequest.body || '');
  }, [currentRequest]);

  // İsteği gönder
  const handleSend = () => {
    if (!url) return;
    onSend({ url, method, headers, body });
  };

  const selectedMethod = METHODS.find((m) => m.value === method);

  return (
    <div className="flex flex-col gap-4 bg-gray-800 rounded-xl border border-gray-700 p-4">
      {/* URL ve method satırı */}
      <div className="flex gap-2">
        {/* Method seçici */}
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={`px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-sm font-mono font-medium focus:outline-none focus:border-blue-500 ${selectedMethod.color}`}
        >
          {METHODS.map((m) => (
            <option key={m.value} value={m.value} className="text-white">
              {m.value}
            </option>
          ))}
        </select>

        {/* URL input */}
        <input
          type="text"
          placeholder="https://api.example.com/endpoint"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500 placeholder-gray-600"
        />

        {/* Gönder butonu */}
        <button
          onClick={handleSend}
          disabled={isLoading || !url}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Gönderiliyor...' : 'Gönder'}
        </button>
      </div>

      {/* Tab menüsü */}
      <div className="flex gap-1 border-b border-gray-700 pb-0">
        {['headers', 'body'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab
                ? 'text-blue-400 border-blue-400'
                : 'text-gray-500 border-transparent hover:text-gray-300'
            }`}
          >
            {tab === 'headers' ? 'Headers' : 'Body'}
          </button>
        ))}
      </div>

      {/* Tab içeriği */}
      {activeTab === 'headers' ? (
        <textarea
          placeholder={'{\n  "Authorization": "Bearer token",\n  "Content-Type": "application/json"\n}'}
          value={headers}
          onChange={(e) => setHeaders(e.target.value)}
          rows={5}
          className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500 placeholder-gray-600 resize-none"
        />
      ) : (
        <textarea
          placeholder={'{\n  "key": "value"\n}'}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500 placeholder-gray-600 resize-none"
        />
      )}
    </div>
  );
};

export default RequestBuilder;