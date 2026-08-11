import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { format } from 'date-fns';
import { Plus, CheckCircle, XCircle, Search } from 'lucide-react';
import ChallanModal from '../components/ChallanModal';

const Challans = () => {
  const [challans, setChallans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchChallans();
  }, []);

  const fetchChallans = async () => {
    try {
      const res = await api.get('/challans');
      setChallans(res.data);
    } catch (error) {
      console.error('Failed to fetch challans', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowModal(false);
    fetchChallans();
  };

  const confirmChallan = async (id: string) => {
    if (!window.confirm('Are you sure you want to confirm this challan? This will deduct stock.')) return;
    try {
      await api.post(`/challans/${id}/confirm`);
      fetchChallans(); // Refresh list
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to confirm challan');
    }
  };

  const filteredChallans = challans.filter(c => 
    c.challanNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.customer && c.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Sales Challans</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Create Challan
        </button>
      </div>
      
      <div className="card">
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', maxWidth: '400px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search challan number or customer..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.25rem' }}
          />
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Challan No.</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Customer</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Qty</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Date</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredChallans.map(challan => (
                  <tr key={challan.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{challan.challanNumber}</td>
                    <td style={{ padding: '1rem' }}>{challan.customer?.name}</td>
                    <td style={{ padding: '1rem' }}>{challan.totalQuantity}</td>
                    <td style={{ padding: '1rem' }}>{format(new Date(challan.createdAt), 'MMM dd, yyyy')}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        backgroundColor: challan.status === 'CONFIRMED' ? '#d1fae5' : challan.status === 'DRAFT' ? '#fef3c7' : '#fee2e2', 
                        color: challan.status === 'CONFIRMED' ? '#065f46' : challan.status === 'DRAFT' ? '#92400e' : '#991b1b', 
                        borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 
                      }}>
                        {challan.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {challan.status === 'DRAFT' && (
                        <button 
                          onClick={() => confirmChallan(challan.id)}
                          className="btn" 
                          style={{ backgroundColor: 'var(--secondary-color)', color: 'white', padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                        >
                          Confirm
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredChallans.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No challans found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && <ChallanModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
    </div>
  );
};

export default Challans;
