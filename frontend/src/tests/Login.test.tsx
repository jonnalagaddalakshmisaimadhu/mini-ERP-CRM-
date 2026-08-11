import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import { AuthProvider } from '../context/AuthContext';

describe('Login Component', () => {
  it('renders login form', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </AuthProvider>
    );
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
