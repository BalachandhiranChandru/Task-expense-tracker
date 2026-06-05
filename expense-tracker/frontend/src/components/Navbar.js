import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav style={{
      background: '#1e293b', padding: '1rem 2rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: '1px solid #334155'
    }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <span style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#38bdf8' }}>💰 ExpenseTracker</span>
        <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none' }}>Dashboard</Link>
        <Link to="/expenses" style={{ color: '#94a3b8', textDecoration: 'none' }}>Expenses</Link>
      </div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <span style={{ color: '#64748b' }}>Hi, {user?.name}</span>
        <button onClick={handleLogout} style={{
          background: '#ef4444', color: 'white', border: 'none',
          padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer'
        }}>Logout</button>
      </div>
    </nav>
  );
}