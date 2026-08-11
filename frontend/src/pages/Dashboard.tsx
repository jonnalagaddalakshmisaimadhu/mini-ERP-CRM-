import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Box, FileText, Activity } from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCustomers: '...',
    lowStockProducts: '...',
    draftChallans: '...',
    confirmedChallans: '...'
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Total Customers', value: stats.totalCustomers, icon: <Users size={24} color="var(--primary-color)" /> },
    { title: 'Low Stock Products', value: stats.lowStockProducts, icon: <Box size={24} color="var(--danger-color)" /> },
    { title: 'Draft Challans', value: stats.draftChallans, icon: <FileText size={24} color="#f59e0b" /> },
    { title: 'Confirmed Challans', value: stats.confirmedChallans, icon: <Activity size={24} color="var(--secondary-color)" /> },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name}</h1>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {statCards.map((stat, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{stat.title}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{stat.value}</h3>
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: 'rgba(79, 70, 229, 0.1)', borderRadius: '50%' }}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>
      
      <div className="card">
        <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>Quick Actions</h3>
        <p style={{ color: 'var(--text-muted)' }}>Use the sidebar navigation to manage Customers, Products, and Sales Challans.</p>
      </div>
    </div>
  );
};

export default Dashboard;
