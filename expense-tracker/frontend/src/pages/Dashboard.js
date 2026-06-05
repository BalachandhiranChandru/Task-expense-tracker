import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import API from '../api/axios';

const COLORS = ['#38bdf8','#34d399','#f59e0b','#f87171','#a78bfa','#fb923c','#e879f9','#94a3b8'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get('/expenses/stats').then(res => setStats(res.data)).catch(console.error);
  }, []);

  if (!stats) return <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>;

  const pieData = Object.entries(stats.categoryBreakdown).map(([name, value]) => ({ name, value }));
  const barData = stats.recent.map(e => ({ name: e.title.slice(0, 10), amount: e.amount }));

  const card = (title, value, color) => (
    <div style={{ background: '#1e293b', border: `1px solid ${color}33`, borderRadius: '12px', padding: '1.5rem', flex: 1 }}>
      <div style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '0.4rem' }}>{title}</div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color }}>{typeof value === 'number' ? `₹${value.toFixed(2)}` : value}</div>
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem', color: '#e2e8f0' }}>Dashboard</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {card('Total Expenses', stats.total, '#38bdf8')}
        {card('This Month', stats.monthly, '#34d399')}
        {card('Recent Transactions', stats.recent.length, '#f59e0b')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem', border: '1px solid #334155' }}>
          <h3 style={{ marginBottom: '1rem', color: '#94a3b8' }}>Spending by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `₹${v}`} contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem', border: '1px solid #334155' }}>
          <h3 style={{ marginBottom: '1rem', color: '#94a3b8' }}>Recent Expenses</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
              <Tooltip formatter={(v) => `₹${v}`} contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} />
              <Bar dataKey="amount" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem', border: '1px solid #334155' }}>
        <h3 style={{ marginBottom: '1rem', color: '#94a3b8' }}>Recent Transactions</h3>
        {stats.recent.map(e => (
          <div key={e._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #1e293b' }}>
            <div>
              <div style={{ color: '#e2e8f0' }}>{e.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{e.category} · {new Date(e.date).toLocaleDateString()}</div>
            </div>
            <div style={{ color: '#f87171', fontWeight: 'bold' }}>₹{e.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}