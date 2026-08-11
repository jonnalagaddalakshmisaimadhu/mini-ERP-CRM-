import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err: any) {
      if (err.response?.data?.error === 'Internal server error' || !err.response) {
        setError('⚠️ Database is waking up (Supabase free-tier auto-pauses). Please wait 30 seconds and try again. If it persists, restore the Supabase project from the dashboard.');
      } else {
        setError(err.response?.data?.error || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <img src="/logo.svg" alt="Fundsroom Logo" style={{ width: '60px', height: '60px', objectFit: 'contain', marginBottom: '0.5rem' }} />
          <h2 style={{ textAlign: 'center', color: 'var(--primary-color)', margin: 0 }}>Fundsroom</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>ERP + CRM</span>
        </div>
        <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', fontWeight: 500 }}>Sign In</h3>
        
        {error && <div style={{ padding: '0.75rem', backgroundColor: '#fee2e2', color: 'var(--danger-color)', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%' }}
              placeholder="admin@minierp.com"
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%' }}
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', backgroundColor: 'var(--surface-color)', padding: '1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)' }}>
          <div style={{ textAlign: 'center', marginBottom: '0.75rem', fontWeight: 600 }}>Demo Roles & Credentials</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', rowGap: '0.5rem', columnGap: '0.5rem', textAlign: 'left' }}>
            <strong>Admin:</strong> <span>admin@minierp.com / admin123</span>
            <strong>Sales:</strong> <span>sales@minierp.com / sales123</span>
            <strong>Warehouse:</strong> <span>warehouse@minierp.com / warehouse123</span>
            <strong>Accounts:</strong> <span>accounts@minierp.com / accounts123</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
