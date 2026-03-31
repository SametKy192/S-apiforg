import { useState } from 'react';
import { createMock } from '../services/mockService';

// HTTP metodları
const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

// ── Mock Form ───────────────────────────────────────────────────
// Yeni mock endpoint oluşturmak için form bileşeni
const MockForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    path: '',
    method: 'GET',
    responseBody: '{\n  "message": "Hello World"\n}',
    statusCode: 200,
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form alanını güncelle
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Formu gönder
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await createMock({
        ...formData,
        statusCode: parseInt(formData.statusCode),
      });
      onSuccess();
    } catch (err) {
      setError('Mock endpoint oluşturulamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 bg-gray-800 rounded-xl border border-gray-700"
    >
      {/* Path ve method */}
      <div className="flex gap-2">
        <select
          name="method"
          value={formData.method}
          onChange={handleChange}
          className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-green-400 text-sm font-mono focus:outline-none focus:border-blue-500"
        >
          {METHODS.map((m) => (
            <option key={m} value={m} className="text-white">
              {m}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="path"
          placeholder="/api/users"
          value={formData.path}
          onChange={handleChange}
          required
          className="flex-1 px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500 placeholder-gray-600"
        />

        <input
          type="number"
          name="statusCode"
          value={formData.statusCode}
          onChange={handleChange}
          min={100}
          max={599}
          className="w-20 px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Response body */}
      <textarea
        name="responseBody"
        value={formData.responseBody}
        onChange={handleChange}
        rows={6}
        className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-blue-500 resize-none"
      />

      {/* Aktif toggle */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          id="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="w-4 h-4 accent-blue-500"
        />
        <label htmlFor="isActive" className="text-gray-400 text-sm">
          Aktif
        </label>
      </div>

      {/* Hata mesajı */}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      {/* Butonlar */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Oluşturuluyor...' : 'Oluştur'}
        </button>
      </div>
    </form>
  );
};

export default MockForm;