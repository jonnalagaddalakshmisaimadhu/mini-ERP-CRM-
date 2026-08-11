import React, { useState } from 'react';
import api from '../api/axios';
import { X, Upload } from 'lucide-react';

interface ProductModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unitPrice: '',
    currentStock: '',
    minStockAlert: '',
    location: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = null;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('image', imageFile);

        const uploadRes = await api.post('/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data.imageUrl;
      }

      await api.post('/products', {
        ...formData,
        imageUrl
      });

      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="card" style={{ width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0 }}>Add New Product</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={24} />
          </button>
        </div>

        {error && <div style={{ padding: '1rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500 }}>Product Name *</label>
            <input required type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 500 }}>SKU *</label>
              <input required type="text" name="sku" value={formData.sku} onChange={handleChange} className="form-control" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 500 }}>Category *</label>
              <input required type="text" name="category" value={formData.category} onChange={handleChange} className="form-control" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 500 }}>Unit Price *</label>
              <input required type="number" step="0.01" min="0" name="unitPrice" value={formData.unitPrice} onChange={handleChange} className="form-control" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 500 }}>Current Stock *</label>
              <input required type="number" min="0" name="currentStock" value={formData.currentStock} onChange={handleChange} className="form-control" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 500 }}>Min Stock Alert *</label>
              <input required type="number" min="0" name="minStockAlert" value={formData.minStockAlert} onChange={handleChange} className="form-control" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: 500 }}>Location (Optional)</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="form-control" />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: 500 }}>Product Image (Optional)</label>
            <div style={{ border: '2px dashed var(--border-color)', padding: '1.5rem', textAlign: 'center', borderRadius: '4px', cursor: 'pointer' }} onClick={() => document.getElementById('imageUpload')?.click()}>
              <Upload size={24} style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }} />
              <div style={{ color: 'var(--text-muted)' }}>{imageFile ? imageFile.name : 'Click to upload image'}</div>
              <input id="imageUpload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" onClick={onClose} style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer' }} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
