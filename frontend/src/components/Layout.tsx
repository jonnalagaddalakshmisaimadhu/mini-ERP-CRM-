import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Box, FileText, ShoppingCart, FileSpreadsheet, LogOut, Menu, X } from 'lucide-react';
import '../index.css';

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) => {
  const location = useLocation();
  const { logout, user } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { name: 'Customers', path: '/customers', icon: <Users size={20} />, roles: ['ADMIN', 'SALES'] },
    { name: 'Products', path: '/products', icon: <Box size={20} />, roles: ['ADMIN', 'WAREHOUSE', 'SALES'] },
    { name: 'Purchase Orders', path: '/pos', icon: <ShoppingCart size={20} />, roles: ['ADMIN', 'WAREHOUSE'] },
    { name: 'Sales Challans', path: '/challans', icon: <FileText size={20} />, roles: ['ADMIN', 'SALES', 'WAREHOUSE'] },
    { name: 'Invoices', path: '/invoices', icon: <FileSpreadsheet size={20} />, roles: ['ADMIN', 'ACCOUNTS'] },
  ];

  const visibleNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}
      
      <div 
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{ 
          width: '260px', 
          backgroundColor: '#1f2937', 
          color: 'white', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transition: 'transform 0.3s ease-in-out',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}
      >
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #374151', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src="/logo.svg" alt="Fundsroom Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold', lineHeight: 1 }}>Fundsroom</span>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>ERP + CRM</span>
            </div>
          </div>
          <button className="mobile-only" onClick={() => setIsOpen(false)} style={{ color: '#d1d5db' }}>
            <X size={24} />
          </button>
        </div>
        <div style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {visibleNavItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <li key={item.name} style={{ marginBottom: '0.5rem' }}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
                      color: isActive ? 'white' : '#d1d5db',
                      transition: 'var(--transition)'
                    }}
                  >
                    <span style={{ marginRight: '0.75rem' }}>{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div style={{ padding: '1rem', borderTop: '1px solid #374151' }}>
          <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#9ca3af' }}>
            Logged in as: <br/><strong style={{color: 'white'}}>{user?.name}</strong> ({user?.role})
          </div>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', color: '#f87171', width: '100%', padding: '0.5rem' }}>
            <LogOut size={20} style={{ marginRight: '0.5rem' }} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

const Layout = () => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Automatically open sidebar on desktop, hide on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div 
        className="main-wrapper" 
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          marginLeft: window.innerWidth >= 1024 ? '260px' : '0',
          transition: 'margin-left 0.3s ease-in-out',
          width: '100%'
        }}
      >
        <header 
          className="mobile-header" 
          style={{ 
            display: window.innerWidth >= 1024 ? 'none' : 'flex',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: 'white',
            borderBottom: '1px solid var(--border-color)',
            position: 'sticky',
            top: 0,
            zIndex: 30
          }}
        >
          <button onClick={() => setSidebarOpen(true)} style={{ marginRight: '1rem' }}>
            <Menu size={24} />
          </button>
          <span style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Fundsroom ERP</span>
        </header>
        
        <main className="main-content" style={{ padding: '1.5rem', flex: 1, overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
