import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { format } from 'date-fns';
import { Plus, Check, Search } from 'lucide-react';
import PurchaseOrderModal from '../components/PurchaseOrderModal';

const PurchaseOrders = () => {
  const [pos, setPos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPOs();
  }, []);

  const fetchPOs = async () => {
    try {
      const res = await api.get('/pos');
      setPos(res.data);
    } catch (error) {
      console.error('Failed to fetch POs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReceive = async (id: string) => {
    if (!window.confirm('Mark this PO as received? This will increase product stock.')) return;
    try {
      await api.post(`/pos/${id}/receive`);
      fetchPOs();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to receive PO');
    }
  };

  const filteredPos = pos.filter(p => 
    p.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Purchase Orders</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Create PO
        </button>
      </div>

      <div className="card">
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', maxWidth: '400px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search PO number or supplier..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.25rem' }}
          />
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>PO No.</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Supplier</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Total Items</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPos.map(po => (
                <tr key={po.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{po.poNumber}</td>
                  <td style={{ padding: '1rem' }}>{po.supplierName}</td>
                  <td style={{ padding: '1rem' }}>{po.items.reduce((acc: number, item: any) => acc + item.quantity, 0)}</td>
                  <td style={{ padding: '1rem' }}>{format(new Date(po.createdAt), 'MMM dd, yyyy')}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      backgroundColor: po.status === 'RECEIVED' ? '#d1fae5' : '#fef3c7', 
                      color: po.status === 'RECEIVED' ? '#065f46' : '#92400e', 
                      borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 
                    }}>
                      {po.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {po.status === 'PENDING' && (
                      <button onClick={() => handleReceive(po.id)} className="btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', backgroundColor: '#e0e7ff', color: '#3730a3' }}>
                        Mark Received
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredPos.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No Purchase Orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && <PurchaseOrderModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchPOs(); }} />}
    </div>
  );
};

export default PurchaseOrders;
