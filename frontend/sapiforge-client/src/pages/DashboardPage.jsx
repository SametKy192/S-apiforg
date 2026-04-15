import React, { useState, useEffect } from 'react';
import { getStats } from '../services/requestService';
import useSettingsStore from '../store/settingsStore';
import { translations } from '../i18n/translations';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';

const DashboardPage = () => {
    const { language } = useSettingsStore();
    const t = translations[language].dashboard;
    const common = translations[language].common;

    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setIsLoading(true);
        try {
            const data = await getStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-[0.2em] mt-6">{common.loading}</p>
            </div>
        );
    }

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const pieData = stats?.methodCounts?.map(mc => ({ name: mc.method, value: mc.count })) || [];
    
    const successRate = stats?.totalRequests > 0 
        ? Math.round((stats.successCount / stats.totalRequests) * 100) 
        : 0;

    return (
        <div className="flex flex-col gap-10 p-8 lg:p-12 max-w-7xl mx-auto animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black text-white tracking-tight uppercase">
                    {t.title}
                </h1>
                <p className="text-slate-500 text-sm mt-2 font-medium">{t.subtitle}</p>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: t.totalRequests, value: stats.totalRequests, icon: '🔥', color: 'from-blue-600/20 to-blue-400/5' },
                    { label: t.successRate, value: `${successRate}%`, icon: '✅', color: 'from-emerald-600/20 to-emerald-400/5' },
                    { label: t.avgLatency, value: `${stats.avgDurationMs}ms`, icon: '⚡', color: 'from-amber-600/20 to-amber-400/5' },
                    { label: t.failedRequests, value: stats.failedCount, icon: '❌', color: 'from-rose-600/20 to-rose-400/5' },
                ].map((card, i) => (
                    <div key={i} className={`glass-card p-6 rounded-3xl border-white/5 bg-gradient-to-br ${card.color} relative overflow-hidden group`}>
                        <div className="absolute -right-4 -top-4 text-6xl opacity-10 group-hover:scale-110 transition-transform duration-500">{card.icon}</div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">{card.label}</p>
                        <h3 className="text-3xl font-black text-white">{card.value}</h3>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Chart */}
                <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem] border-white/5 flex flex-col gap-8 min-h-[400px]">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                            {t.activityTitle}
                        </h3>
                    </div>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.dailyStats}>
                                <defs>
                                    <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorFailed" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#64748b" 
                                    fontSize={10} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    tickFormatter={(val) => val.split('-').slice(1).join('/')}
                                />
                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="success" name={t.success} stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSuccess)" />
                                <Area type="monotone" dataKey="failed" name={t.failed} stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorFailed)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Method Distribution Chart */}
                <div className="glass-card p-8 rounded-[2.5rem] border-white/5 flex flex-col gap-8 min-h-[400px]">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.methodDistribution}</h3>
                    <div className="flex-1 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="45%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    align="center"
                                    iconType="circle"
                                    formatter={(value) => <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Response Time Bar Chart (Simplified) */}
            <div className="glass-card p-8 rounded-[2.5rem] border-white/5">
                 <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Performance Distribution</h3>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.dailyStats}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                stroke="#64748b" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(val) => val.split('-').slice(1).join('/')}
                            />
                            <YAxis hide />
                            <Tooltip 
                                contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', fontSize: '10px' }}
                            />
                            <Bar dataKey="success" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
            </div>
        </div>
    );
};

export default DashboardPage;
