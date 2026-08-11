import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { format } from 'date-fns';
import { Plus, Search } from 'lucide-react';
import CustomerModal from '../components/CustomerModal';

const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (error) {
      console.error('Failed to fetch customers', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setShowModal(false);
    fetchCustomers();
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.businessName && c.businessName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Customers</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Add Customer
        </button>
      </div>
      
      <div className="card">
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', maxWidth: '400px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search customers..." 
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
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Name</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Business</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Type</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
                  <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>Follow-up</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 500 }}>{customer.name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{customer.mobile}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>{customer.businessName || '-'}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.25rem 0.5rem', backgroundColor: '#e0e7ff', color: '#3730a3', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {customer.type}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ padding: '0.25rem 0.5rem', backgroundColor: customer.status === 'ACTIVE' ? '#d1fae5' : '#fef3c7', color: customer.status === 'ACTIVE' ? '#065f46' : '#92400e', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {customer.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{customer.followUpDate ? format(new Date(customer.followUpDate), 'MMM dd, yyyy') : '-'}</td>
                  </tr>
                ))}
                {filteredCustomers.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No customers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && <CustomerModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />}
    </div>
  );
};

export default Customers;
