import React, { useState } from 'react';
import { createMock } from '../services/mockService';
import useSettingsStore from '../store/settingsStore';
import { translations } from '../i18n/translations';

const METHODS = [
    { value: 'GET', color: 'text-emerald-400' },
    { value: 'POST', color: 'text-blue-400' },
    { value: 'PUT', color: 'text-amber-400' },
    { value: 'DELETE', color: 'text-rose-400' },
    { value: 'PATCH', color: 'text-violet-400' },
];

const MockForm = ({ onSuccess }) => {
  const { language } = useSettingsStore();
  const t = translations[language].mock;
  const common = translations[language].common;

  const [formData, setFormData] = useState({
    path: '',
    method: 'GET',
    responseBody: '{\n  "message": "Hello World"\n}',
    statusCode: 200,
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

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
      setError(language === 'tr' ? 'Mock endpoint oluşturulamadı.' : 'Failed to create mock endpoint.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 animate-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Method & Path Selector */}
        <div className="flex-1 flex gap-3 p-1.5 glass-item rounded-2xl items-center focus-within:ring-2 ring-blue-500/20 transition-all">
          <select
            name="method"
            value={formData.method}
            onChange={handleChange}
            className="w-28 pl-4 pr-2 py-2 bg-transparent border-none rounded-xl text-xs font-black tracking-widest focus:ring-0 cursor-pointer text-blue-400"
          >
            {METHODS.map((m) => (
              <option key={m.value} value={m.value} className="bg-[var(--bg-sidebar)] text-[var(--text-primary)]">
                {m.value}
              </option>
            ))}
          </select>

          <div className="w-px h-6 bg-[var(--border-glass)]"></div>

          <input
            type="text"
            name="path"
            placeholder="/api/v1/users"
            value={formData.path}
            onChange={handleChange}
            required
            className="flex-1 bg-transparent border-none text-[var(--text-primary)] text-sm font-mono placeholder-[var(--text-secondary)]/30 focus:ring-0 ml-2"
          />
        </div>

        {/* Status Code */}
        <div className="w-full md:w-32 flex flex-col gap-2">
           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">HTTP STATUS</label>
           <input
                type="number"
                name="statusCode"
                value={formData.statusCode}
                onChange={handleChange}
                min={100}
                max={599}
                className="px-4 py-3 glass-item rounded-2xl text-[var(--text-primary)] text-sm font-mono border-none focus:ring-2 ring-blue-500/20"
            />
        </div>
      </div>

      {/* Response Body Editor */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">RESPONSE BODY (JSON)</label>
        <div className="glass-item rounded-[2rem] p-4 min-h-[160px] flex focus-within:ring-1 ring-white/10 transition-all overflow-hidden">
            <textarea
                name="responseBody"
                value={formData.responseBody}
                onChange={handleChange}
                className="flex-1 bg-transparent border-none text-[var(--text-primary)] text-xs font-mono placeholder-[var(--text-secondary)]/30 resize-none focus:ring-0 leading-relaxed custom-scrollbar"
                placeholder='{"key": "value"}'
            />
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4 px-4 py-2 glass-item rounded-2xl">
          <input
            type="checkbox"
            name="isActive"
            id="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="w-4 h-4 accent-blue-500 rounded border-none focus:ring-0"
          />
          <label htmlFor="isActive" className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest cursor-pointer select-none">
            {language === 'tr' ? 'Endpoint Aktif' : 'Endpoint Active'}
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary px-12 py-3 flex items-center gap-3"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M5 12h14m-7-7 7 7-7 7"/>
            </svg>
          )}
          <span className="text-xs font-black uppercase tracking-widest">
            {isLoading ? common.loading : common.create}
          </span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex items-center gap-3">
             <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
             <p className="text-rose-400 text-[10px] font-bold uppercase tracking-widest">{error}</p>
        </div>
      )}
    </form>
  );
};

export default MockForm;