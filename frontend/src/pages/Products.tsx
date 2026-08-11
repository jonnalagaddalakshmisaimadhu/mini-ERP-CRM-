import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Search, Image as ImageIcon } from 'lucide-react';
import ProductModal from '../components/ProductModal';

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Products & Inventory</h1>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Product
        </button>
      </div>
      
      <div className="card">
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', maxWidth: '400px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search products or SKU..." 
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
                  <th style={{ padding: '1rem', width: '60px' }}></th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Product</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Category</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Unit Price</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Current Stock</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px' }}>
                          <ImageIcon size={20} color="var(--text-muted)" />
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 500 }}>{product.name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{product.sku}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>{product.category}</td>
                    <td style={{ padding: '1rem' }}>${product.unitPrice.toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ fontWeight: 600, color: product.currentStock <= product.minStockAlert ? 'var(--danger-color)' : 'inherit' }}>
                        {product.currentStock}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      {product.currentStock <= product.minStockAlert ? (
                        <span style={{ padding: '0.25rem 0.5rem', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>Low Stock</span>
                      ) : (
                        <span style={{ padding: '0.25rem 0.5rem', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>In Stock</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ProductModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            fetchProducts();
          }} 
        />
      )}
    </div>
  );
};

export default Products;
