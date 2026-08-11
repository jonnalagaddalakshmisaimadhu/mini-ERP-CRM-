import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { X, Plus, Trash2 } from 'lucide-react';

interface ChallanModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ChallanModal: React.FC<ChallanModalProps> = ({ onClose, onSuccess }) => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<{ productId: string, quantity: number }[]>([
    { productId: '', quantity: 1 }
  ]);
  const [status, setStatus] = useState('DRAFT');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [custRes, prodRes] = await Promise.all([
        api.get('/customers'),
        api.get('/products')
      ]);
      setCustomers(custRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
      setError('Failed to load customers and products.');
    }
  };

  const addItem = () => {
    setItems([...items, { productId: '', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return setError('Please select a customer.');
    if (items.length === 0) return setError('Please add at least one product.');
    if (items.some(item => !item.productId || item.quantity <= 0)) {
      return setError('Please ensure all items have a selected product and valid quantity.');
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/challans', {
        customerId,
        items,
        status
      });
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to create challan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Create Sales Challan</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        {error && <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 500 }}>Customer *</label>
              <select required value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="form-control">
                <option value="">-- Select Customer --</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} {c.businessName ? `(${c.businessName})` : ''}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 500 }}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="form-control">
                <option value="DRAFT">Draft (Stock NOT deducted)</option>
                <option value="CONFIRMED">Confirmed (Stock Deducted)</option>
              </select>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Products</h3>
              <button type="button" onClick={addItem} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', backgroundColor: '#e0e7ff', color: '#3730a3' }}>
                <Plus size={16} style={{ marginRight: '0.25rem' }} /> Add Item
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                  <div style={{ flex: 1 }}>
                    <select required value={item.productId} onChange={(e) => handleItemChange(index, 'productId', e.target.value)} className="form-control">
                      <option value="">-- Select Product --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Stock: {p.stockQuantity})</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ width: '100px' }}>
                    <input 
                      type="number" 
                      required 
                      min="1" 
                      value={item.quantity} 
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)} 
                      className="form-control" 
                      placeholder="Qty"
                    />
                  </div>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(index)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer' }} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Challan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChallanModal;
