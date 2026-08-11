import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { X, Plus, Trash2 } from 'lucide-react';

interface PurchaseOrderModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const PurchaseOrderModal: React.FC<PurchaseOrderModalProps> = ({ onClose, onSuccess }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [poNumber, setPoNumber] = useState(`PO-${Date.now()}`);
  const [supplierName, setSupplierName] = useState('');
  const [items, setItems] = useState<{ productId: string, quantity: number, unitCost: number }[]>([
    { productId: '', quantity: 1, unitCost: 0 }
  ]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      setError('Failed to load products.');
    }
  };

  const addItem = () => setItems([...items, { productId: '', quantity: 1, unitCost: 0 }]);
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
    if (!supplierName) return setError('Please enter a supplier name.');
    if (items.some(i => !i.productId || i.quantity <= 0 || i.unitCost < 0)) return setError('Invalid items.');

    setLoading(true);
    try {
      await api.post('/pos', { poNumber, supplierName, items });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create PO');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Create Purchase Order</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {error && <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 500 }}>PO Number *</label>
              <input required value={poNumber} onChange={e => setPoNumber(e.target.value)} className="form-control" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 500 }}>Supplier Name *</label>
              <input required value={supplierName} onChange={e => setSupplierName(e.target.value)} className="form-control" />
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Items to Order</h3>
              <button type="button" onClick={addItem} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                <Plus size={16} /> Add Item
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                  <div style={{ flex: 1 }}>
                    <select required value={item.productId} onChange={(e) => handleItemChange(index, 'productId', e.target.value)} className="form-control">
                      <option value="">-- Product --</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div style={{ width: '80px' }}>
                    <input type="number" required min="1" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)} className="form-control" placeholder="Qty" />
                  </div>
                  <div style={{ width: '100px' }}>
                    <input type="number" step="0.01" required min="0" value={item.unitCost} onChange={(e) => handleItemChange(index, 'unitCost', parseFloat(e.target.value) || 0)} className="form-control" placeholder="Cost" />
                  </div>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(index)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} className="btn" style={{ backgroundColor: 'white', border: '1px solid var(--border-color)' }}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Create PO'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PurchaseOrderModal;
