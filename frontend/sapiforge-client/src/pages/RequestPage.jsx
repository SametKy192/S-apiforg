import { useState } from 'react';
import RequestBuilder from '../components/RequestBuilder';
import ResponseViewer from '../components/ResponseViewer';
import { sendRequest } from '../services/requestService';
import useRequestStore from '../store/requestStore';

// ── Request sayfası ─────────────────────────────────────────────
// Kullanıcının API isteği gönderdiği ana sayfa
const RequestPage = () => {
  const { currentResponse, setCurrentResponse, setLoading, setError, isLoading } =
    useRequestStore();

  // Store'daki error state'ini local olarak da takip et
  const [localError, setLocalError] = useState(null);

  // İsteği gönder
  const handleSend = async (requestData) => {
    setLoading(true);
    setError(null);
    setLocalError(null);
    setCurrentResponse(null);

    try {
      const response = await sendRequest(requestData);
      setCurrentResponse(response);
    } catch (err) {
      // Backend'den gelen hata mesajını göster
      const message =
        err.response?.data?.message ||
        'İstek gönderilemedi. Hedef sunucu çalışmıyor olabilir.';
      setError(message);
      setLocalError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* İstek oluşturucu */}
      <RequestBuilder onSend={handleSend} isLoading={isLoading} />

      {/* Hata mesajı — istek gönderilemediğinde gösterilir */}
      {localError && (
        <div className="p-4 bg-red-900/20 border border-red-800 rounded-xl">
          <p className="text-red-400 text-sm font-mono">{localError}</p>
        </div>
      )}

      {/* Response görüntüleyici — başarılı isteklerde gösterilir */}
      {currentResponse && <ResponseViewer response={currentResponse} />}
    </div>
  );
};

export default RequestPage;