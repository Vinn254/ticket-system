// src/pages/ContractorDashboard.jsx
import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function ContractorDashboard() {
  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = () => {
      API.get('/tickets?assignedTo=' + (JSON.parse(localStorage.getItem('user') || '{}')._id || ''))
        .then(res => {
          let payload = [];
          if (res && Array.isArray(res.tickets)) {
            payload = res.tickets;
          } else if (res && res.data && Array.isArray(res.data.tickets)) {
            payload = res.data.tickets;
          } else if (res && Array.isArray(res.data)) {
            payload = res.data;
          }
          setTickets(payload);
        })
        .catch(console.error);
    };
    fetchTickets();
    let interval = setInterval(fetchTickets, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  React.useEffect(() => {
    if (searchInput === '') setSearch('');
  }, [searchInput]);

  return (
    <>
      <div className="contractor-dashboard-container" style={{
        padding: 32,
        marginTop: 56,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #eafff3 0%, #f7fff7 100%)',
        boxSizing: 'border-box',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ color: '#2d7a3e', margin: 0, fontSize: 32, fontWeight: 800, textShadow: '0 2px 8px rgba(0,0,0,0.1)', letterSpacing: 1 }}>Contractor Dashboard</h1>
          <p style={{ color: '#4a4a4a', fontSize: 16, marginTop: 8, opacity: 0.8 }}>Manage your assigned customer tickets</p>
        </div>
        {/* Search bar for contractor */}
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, marginTop: 0, maxWidth: 500, justifyContent: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search customer by name..."
            style={{ padding: 12, borderRadius: 8, border: '2px solid #43e97b', minWidth: 220, fontSize: 16, background: '#fff', boxShadow: '0 2px 8px rgba(67, 233, 123, 0.1)' }}
          />
          <button type="submit" style={{ padding: '12px 20px', background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)', color: 'white', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 600, boxShadow: '0 4px 12px rgba(67, 233, 123, 0.3)' }}>Search</button>
        </form>
        <div style={{ display: 'grid', gap: 12 }}>
          {tickets
            .filter(t => !search || (t.customer && t.customer.name && t.customer.name.toLowerCase().includes(search.toLowerCase())))
            .map(t => (
              <div key={t._id} style={{ background: 'white', padding: 12, borderRadius: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{t.title || t.issue}</div>
                    <div style={{ color: '#666' }}>{t.description?.slice(0,120)}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#2d7a3e' }}>{t.status}</div>
                    <button style={{ marginTop: 8, padding: '6px 10px', background: '#2d7a3e', color: 'white', border: 'none', borderRadius: 6 }} onClick={() => navigate(`/tickets/${t._id}`)}>Open</button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
