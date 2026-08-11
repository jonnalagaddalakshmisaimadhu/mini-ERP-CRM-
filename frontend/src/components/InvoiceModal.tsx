import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { X } from 'lucide-react';

interface InvoiceModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ onClose, onSuccess }) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [challans, setChallans] = useState<any[]>([]);
  
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now()}`);
  const [customerId, setCustomerId] = useState('');
  const [challanId, setChallanId] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [custRes, chalRes] = await Promise.all([
        api.get('/customers'),
        api.get('/challans')
      ]);
      setCustomers(custRes.data);
      // Only confirmed challans can be invoiced (optionally you could filter on backend)
      setChallans(chalRes.data.filter((c: any) => c.status === 'CONFIRMED'));
    } catch (err) {
      setError('Failed to load data.');
    }
  };

  const handleChallanSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cid = e.target.value;
    setChallanId(cid);
    
    if (cid) {
      const selectedChallan = challans.find(c => c.id === cid);
      if (selectedChallan) {
        setCustomerId(selectedChallan.customerId);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return setError('Please select a customer.');
    if (!totalAmount || parseFloat(totalAmount) <= 0) return setError('Please enter a valid amount.');

    setLoading(true);
    try {
      await api.post('/invoices', { invoiceNumber, customerId, challanId: challanId || null, totalAmount });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create Invoice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Create Invoice</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {error && <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500 }}>Invoice Number *</label>
            <input required value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} className="form-control" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500 }}>Link to Confirmed Challan (Optional)</label>
            <select value={challanId} onChange={handleChallanSelect} className="form-control">
              <option value="">-- No Challan / Direct Invoice --</option>
              {challans.map(c => <option key={c.id} value={c.id}>{c.challanNumber} - {c.customer?.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500 }}>Customer *</label>
            <select required value={customerId} onChange={e => setCustomerId(e.target.value)} className="form-control" disabled={!!challanId}>
              <option value="">-- Select Customer --</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500 }}>Total Amount *</label>
            <input type="number" step="0.01" required min="0" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} className="form-control" placeholder="e.g. 150.00" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn" style={{ backgroundColor: 'white', border: '1px solid var(--border-color)' }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Create Invoice'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default InvoiceModal;
