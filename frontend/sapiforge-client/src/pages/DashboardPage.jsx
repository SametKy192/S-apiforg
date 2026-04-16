import { translations } from '../i18n/translations';
import useSettingsStore from '../store/settingsStore';

const DashboardPage = () => {
  const { language } = useSettingsStore();
  const t = translations[language].dashboard;

  const stats = [
    { label: t.totalRequests, value: '2,842', color: 'text-indigo-500', icon: '↗' },
    { label: t.successRate, value: '98.4%', color: 'text-emerald-500', icon: '✓' },
    { label: t.avgLatency, value: '42ms', color: 'text-blue-500', icon: '⏱' },
    { label: t.failedRequests, value: '12', color: 'text-rose-500', icon: '✕' },
  ];

  return (
    <div className="p-8 lg:p-16 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Signature Header */}
      <div className="mb-16 border-l-4 border-[var(--accent)] pl-8">
        <h1 className="text-5xl font-black text-[var(--text-primary)] tracking-tighter font-space uppercase">
          {t.title}
        </h1>
        <p className="text-[var(--text-secondary)] text-sm mt-3 font-medium max-w-lg leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Modern Grid - No blurs, just clean cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-8 group hover:border-[var(--accent)] transition-all duration-300">
             <div className="flex justify-between items-start mb-4">
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.icon}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Auto</span>
             </div>
             <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1">{stat.label}</p>
             <h3 className="text-3xl font-black text-[var(--text-primary)] font-space tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card p-8">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">{t.activityTitle}</h3>
                <div className="flex gap-2">
                    <div className="px-3 py-1 bg-[var(--accent-soft)] text-[var(--accent)] text-[9px] font-bold rounded-full">Weekly</div>
                </div>
            </div>
            {/* Visual placeholder for chart - Clean Geometric style */}
            <div className="h-64 flex items-end gap-3 px-2">
                {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                    <div key={i} className="flex-1 group relative">
                        <div 
                            className="bg-[var(--accent)] w-full rounded-t-lg transition-all duration-500 group-hover:opacity-80" 
                            style={{ height: `${h}%` }}
                        ></div>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all text-[10px] font-bold">
                            {h}%
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
        </div>

        <div className="glass-card p-8 flex flex-col">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-primary)] mb-8">{t.methodDistribution}</h3>
            <div className="flex-1 flex flex-col justify-center gap-6">
                {[
                    { label: 'GET', val: 65, color: 'bg-emerald-500' },
                    { label: 'POST', val: 25, color: 'bg-blue-500' },
                    { label: 'DEL', val: 10, color: 'bg-rose-500' },
                ].map((item, i) => (
                    <div key={i}>
                        <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest">
                            <span>{item.label}</span>
                            <span className="text-[var(--text-secondary)]">{item.val}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
