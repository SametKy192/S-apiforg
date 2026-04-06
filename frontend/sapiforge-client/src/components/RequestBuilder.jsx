import { useState, useEffect } from 'react';
import useRequestStore from '../store/requestStore';
import { getAllEnvironments } from '../services/environmentService';

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
  const [environments, setEnvironments] = useState([]);
  const [activeEnvId, setActiveEnvId] = useState('');

  // Ortamları çek ve aktif olanı bul
  const fetchEnvs = async () => {
    try {
      const envs = await getAllEnvironments();
      setEnvironments(envs);
      const active = envs.find((e) => e.isActive);
      if (active) setActiveEnvId(active.id.toString());
      else setActiveEnvId('');
    } catch (err) {
      console.error('Active env fetch error:', err);
    }
  };

  useEffect(() => {
    fetchEnvs();
  }, []);

  // Ortam değiştir
  const handleEnvChange = async (envId) => {
    // Eğer "Seçiniz..." seçildiyse mevcut aktif olanı pasife çek
    if (!envId) {
      if (activeEnvId) {
        const active = environments.find((e) => e.id === parseInt(activeEnvId));
        if (active) {
          try {
            await updateEnvironment(active.id, { ...active, isActive: false });
            setActiveEnvId('');
          } catch (err) {
            console.error('Env set passive error:', err);
          }
        }
      }
      return;
    }

    // Yeni ortam seç
    const selected = environments.find((e) => e.id === parseInt(envId));
    if (selected) {
      try {
        await updateEnvironment(selected.id, { ...selected, isActive: true });
        
        // Backend'deki agresif temizliğin sonuçlarını al ve UI'ı güncelle
        const updatedEnvs = await getAllEnvironments();
        setEnvironments(updatedEnvs);
        
        const newActive = updatedEnvs.find(e => e.isActive);
        if (newActive) setActiveEnvId(newActive.id.toString());

      } catch (err) {
        console.error('Env change error:', err);
      }
    }
  };

  // Store'daki currentRequest değişince form alanlarını güncelle
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
          placeholder="https://api.example.com/endpoint veya {{baseUrl}}/users"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500 placeholder-gray-600"
        />

        {/* Ortam Seçici */}
        <div className="flex items-center px-1 bg-gray-900 border border-gray-700 rounded-lg focus-within:border-blue-500">
          <span className="text-[9px] text-gray-500 uppercase font-bold ml-2 mr-1">Env:</span>
          <select
            value={activeEnvId}
            onChange={(e) => handleEnvChange(e.target.value)}
            className="bg-transparent text-xs text-blue-400 font-medium py-1 px-1 focus:outline-none min-w-[100px] cursor-pointer"
          >
            <option value="" className="bg-gray-900 text-gray-400">Seçiniz...</option>
            {environments.map((env) => (
              <option key={env.id} value={env.id} className="bg-gray-900 text-white">
                {env.name}
              </option>
            ))}
          </select>
        </div>

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