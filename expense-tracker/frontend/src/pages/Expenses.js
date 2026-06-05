// import React, { useEffect, useState, useCallback } from 'react';
// import API from '../api/axios';
// import toast from 'react-hot-toast';

// const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Bills', 'Education', 'Other'];
// const empty = { title: '', amount: '', category: 'Other', date: '', description: '' };

// export default function Expenses() {
//   const [expenses, setExpenses] = useState([]);
//   const [form, setForm] = useState(empty);
//   const [editId, setEditId] = useState(null);
//   const [search, setSearch] = useState('');
//   const [filterCat, setFilterCat] = useState('All');
//   const [showForm, setShowForm] = useState(false);

//   // Memoized fetch function to satisfy exhaustive-deps lint rules
//   const fetchExpenses = useCallback(async () => {
//     try {
//       const params = {};
//       if (search) params.search = search;
//       if (filterCat !== 'All') params.category = filterCat;
//       const res = await API.get('/expenses', { params });
//       setExpenses(res.data);
//     } catch { 
//       toast.error('Failed to fetch expenses'); 
//     }
//   }, [search, filterCat]);

//   // Safely trigger fetch when the memoized function reference shifts
//   useEffect(() => { 
//     fetchExpenses(); 
//   }, [fetchExpenses]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.title || !form.amount) return toast.error('Title and amount required');
//     try {
//       if (editId) {
//         await API.put(`/expenses/${editId}`, form);
//         toast.success('Updated!');
//       } else {
//         await API.post('/expenses', form);
//         toast.success('Added!');
//       }
//       setForm(empty); setEditId(null); setShowForm(false);
//       fetchExpenses();
//     } catch { toast.error('Failed to save expense'); }
//   };

//   const handleEdit = (exp) => {
//     setForm({ title: exp.title, amount: exp.amount, category: exp.category, date: exp.date?.slice(0, 10), description: exp.description || '' });
//     setEditId(exp._id); setShowForm(true);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Delete this expense?')) return;
//     try { await API.delete(`/expenses/${id}`); toast.success('Deleted'); fetchExpenses(); }
//     catch { toast.error('Delete failed'); }
//   };

//   const inputStyle = { width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0' };

//   return (
//     <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
//         <h1 style={{ color: '#e2e8f0' }}>Expenses</h1>
//         <button onClick={() => { setShowForm(!showForm); setForm(empty); setEditId(null); }}
//           style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
//           {showForm ? 'Cancel' : '+ Add Expense'}
//         </button>
//       </div>

//       {showForm && (
//         <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #334155' }}>
//           <h3 style={{ marginBottom: '1rem', color: '#94a3b8' }}>{editId ? 'Edit Expense' : 'New Expense'}</h3>
//           <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
//             {[['title', 'text', 'Title'], ['amount', 'number', 'Amount (₹)'], ['date', 'date', 'Date'], ['description', 'text', 'Description']].map(([key, type, label]) => (
//               <div key={key}>
//                 <label style={{ display: 'block', marginBottom: '0.3rem', color: '#94a3b8', fontSize: '0.85rem' }}>{label}</label>
//                 <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputStyle} />
//               </div>
//             ))}
//             <div>
//               <label style={{ display: 'block', marginBottom: '0.3rem', color: '#94a3b8', fontSize: '0.85rem' }}>Category</label>
//               <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
//                 {CATEGORIES.map(c => <option key={c}>{c}</option>)}
//               </select>
//             </div>
//             <div style={{ display: 'flex', alignItems: 'flex-end' }}>
//               <button type="submit" style={{ width: '100%', padding: '0.65rem', background: '#34d399', color: '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
//                 {editId ? 'Update' : 'Add Expense'}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}

//       <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
//         <input placeholder="🔍 Search expenses..." value={search} onChange={e => setSearch(e.target.value)}
//           style={{ ...inputStyle, flex: 1 }} />
//         <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...inputStyle, width: '160px' }}>
//           <option>All</option>
//           {CATEGORIES.map(c => <option key={c}>{c}</option>)}
//         </select>
//       </div>

//       <div style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
//         {expenses.length === 0
//           ? <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No expenses found.</div>
//           : expenses.map((exp, i) => (
//             <div key={exp._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: i < expenses.length - 1 ? '1px solid #0f172a' : 'none' }}>
//               <div>
//                 <div style={{ color: '#e2e8f0', fontWeight: '500' }}>{exp.title}</div>
//                 <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{exp.category} · {new Date(exp.date).toLocaleDateString()} {exp.description && `· ${exp.description}`}</div>
//               </div>
//               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//                 <span style={{ color: '#f87171', fontWeight: 'bold', fontSize: '1.1rem' }}>₹{exp.amount}</span>
//                 <button onClick={() => handleEdit(exp)} style={{ background: '#1d4ed8', color: 'white', border: 'none', padding: '0.3rem 0.7rem', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
//                 <button onClick={() => handleDelete(exp._id)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '0.3rem 0.7rem', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
//               </div>
//             </div>
//           ))
//         }
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Bills', 'Education', 'Other'];
const empty = { title: '', amount: '', category: 'Other', date: '', description: '' };

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('All');
  const [showForm, setShowForm] = useState(false);

  const fetchExpenses = async () => {
    try {
      const params = {};
      if (search) params.search = search;
      if (filterCat !== 'All') params.category = filterCat;
      const res = await API.get('/expenses', { params });
      setExpenses(res.data);
    } catch { toast.error('Failed to fetch expenses'); }
  };

  useEffect(() => { fetchExpenses(); }, [search, filterCat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return toast.error('Title and amount required');
    try {
      if (editId) {
        await API.put(`/expenses/${editId}`, form);
        toast.success('Updated!');
      } else {
        await API.post('/expenses', form);
        toast.success('Added!');
      }
      setForm(empty); setEditId(null); setShowForm(false);
      fetchExpenses();
    } catch { toast.error('Failed to save expense'); }
  };

  const handleEdit = (exp) => {
    setForm({ title: exp.title, amount: exp.amount, category: exp.category, date: exp.date?.slice(0, 10), description: exp.description || '' });
    setEditId(exp._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try { await API.delete(`/expenses/${id}`); toast.success('Deleted'); fetchExpenses(); }
    catch { toast.error('Delete failed'); }
  };

  const inputStyle = { width: '100%', padding: '0.6rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#e2e8f0' };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ color: '#e2e8f0' }}>Expenses</h1>
        <button onClick={() => { setShowForm(!showForm); setForm(empty); setEditId(null); }}
          style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.5rem 1.2rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          {showForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', border: '1px solid #334155' }}>
          <h3 style={{ marginBottom: '1rem', color: '#94a3b8' }}>{editId ? 'Edit Expense' : 'New Expense'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[['title', 'text', 'Title'], ['amount', 'number', 'Amount (₹)'], ['date', 'date', 'Date'], ['description', 'text', 'Description']].map(([key, type, label]) => (
              <div key={key}>
                <label style={{ display: 'block', marginBottom: '0.3rem', color: '#94a3b8', fontSize: '0.85rem' }}>{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inputStyle} />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', marginBottom: '0.3rem', color: '#94a3b8', fontSize: '0.85rem' }}>Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button type="submit" style={{ width: '100%', padding: '0.65rem', background: '#34d399', color: '#0f172a', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                {editId ? 'Update' : 'Add Expense'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input placeholder="🔍 Search expenses..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: 1 }} />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...inputStyle, width: '160px' }}>
          <option>All</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
        {expenses.length === 0
          ? <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No expenses found.</div>
          : expenses.map((exp, i) => (
            <div key={exp._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: i < expenses.length - 1 ? '1px solid #0f172a' : 'none' }}>
              <div>
                <div style={{ color: '#e2e8f0', fontWeight: '500' }}>{exp.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{exp.category} · {new Date(exp.date).toLocaleDateString()} {exp.description && `· ${exp.description}`}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: '#f87171', fontWeight: 'bold', fontSize: '1.1rem' }}>₹{exp.amount}</span>
                <button onClick={() => handleEdit(exp)} style={{ background: '#1d4ed8', color: 'white', border: 'none', padding: '0.3rem 0.7rem', borderRadius: '5px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(exp._id)} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '0.3rem 0.7rem', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
