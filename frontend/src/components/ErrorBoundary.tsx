import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', height: '100vh', textAlign: 'center',
          padding: '2rem', backgroundColor: '#f9fafb'
        }}>
          <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>Something went wrong.</h1>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>An unexpected error occurred in the application.</p>
          <pre style={{
            backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem',
            overflowX: 'auto', maxWidth: '100%', marginBottom: '1.5rem',
            textAlign: 'left', fontSize: '0.875rem'
          }}>
            {this.state.error?.toString()}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem', backgroundColor: '#4f46e5', color: 'white',
              border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 500
            }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
