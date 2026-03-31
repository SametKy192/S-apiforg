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

  // İsteği gönder
  const handleSend = async (requestData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await sendRequest(requestData);
      setCurrentResponse(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* İstek oluşturucu */}
      <RequestBuilder onSend={handleSend} isLoading={isLoading} />

      {/* Response görüntüleyici */}
      {currentResponse && <ResponseViewer response={currentResponse} />}
    </div>
  );
};

export default RequestPage;