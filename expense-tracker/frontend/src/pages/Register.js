import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    try {
      const res = await API.post('/auth/register', form);
      login(res.data.user, res.data.token);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ background: '#1e293b', padding: '2rem', borderRadius: '12px', width: '360px', border: '1px solid #334155' }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#38bdf8' }}>Register</h2>
        <form onSubmit={handleSubmit}>
          {['name', 'email', 'password'].map(field => (
            <div key={field} style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', color: '#94a3b8', textTransform: 'capitalize' }}>{field}</label>
              <input
                type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                required
                style={{ width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0' }}
              />
            </div>
          ))}
          <button type="submit" style={{ width: '100%', padding: '0.7rem', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>
            Register
          </button>
        </form>
        <p style={{ marginTop: '1rem', color: '#64748b', textAlign: 'center' }}>
          Have account? <Link to="/login" style={{ color: '#38bdf8' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}