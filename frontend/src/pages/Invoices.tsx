import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { format } from 'date-fns';
import { Plus, Search } from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';

const Invoices = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/invoices');
      setInvoices(res.data);
    } catch (error) {
      console.error('Failed to fetch invoices', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (id: string) => {
    if (!window.confirm('Mark this invoice as Paid?')) return;
    try {
      await api.put(`/invoices/${id}/pay`);
      fetchInvoices();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to pay invoice');
    }
  };

  const filteredInvoices = invoices.filter(i => 
    i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (i.customer && i.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Invoices</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} /> Create Invoice
        </button>
      </div>

      <div className="card">
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', maxWidth: '400px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '10px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search invoice number or customer..." 
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
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Invoice No.</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Customer</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Challan Ref</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Amount</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map(inv => (
                <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{inv.invoiceNumber}</td>
                  <td style={{ padding: '1rem' }}>{inv.customer?.name}</td>
                  <td style={{ padding: '1rem' }}>{inv.challan ? inv.challan.challanNumber : '-'}</td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>${inv.totalAmount.toFixed(2)}</td>
                  <td style={{ padding: '1rem' }}>{format(new Date(inv.createdAt), 'MMM dd, yyyy')}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      backgroundColor: inv.status === 'PAID' ? '#d1fae5' : '#fee2e2', 
                      color: inv.status === 'PAID' ? '#065f46' : '#991b1b', 
                      borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 
                    }}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {inv.status === 'UNPAID' && (
                      <button onClick={() => handlePay(inv.id)} className="btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', backgroundColor: '#e0e7ff', color: '#3730a3' }}>
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No Invoices found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && <InvoiceModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchInvoices(); }} />}
    </div>
  );
};

export default Invoices;
