import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthPage } from '@/pages/AuthPage';
import { BrowserRouter } from 'react-router-dom';

// Mock useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: vi.fn(),
    signUp: vi.fn(),
    user: null,
  }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AuthPage - Email Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject invalid email format', async () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    // Should show validation error
    await waitFor(() => {
      expect(screen.queryByText(/valid email/i)).toBeTruthy();
    });
  });

  it('should accept valid email format', async () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    // Should not show email validation error
    await waitFor(() => {
      expect(screen.queryByText(/valid email/i)).toBeFalsy();
    });
  });

  it('should reject blank email', async () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText(/password/i);
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInButton);

    await waitFor(() => {
      expect(screen.queryByText(/required/i)).toBeTruthy();
    });
  });
});

describe('AuthPage - Password Validation', () => {
  it('should reject weak passwords on signup', async () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    // Switch to signup tab
    const signUpTab = screen.getByRole('tab', { name: /sign up/i });
    fireEvent.click(signUpTab);

    const passwordInput = screen.getByPlaceholderText(/^password$/i);
    fireEvent.change(passwordInput, { target: { value: 'weak' } });

    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(signUpButton);

    await waitFor(() => {
      expect(screen.queryByText(/8 characters/i)).toBeTruthy();
    });
  });

  it('should accept strong passwords', async () => {
    render(
      <BrowserRouter>
        <AuthPage />
      </BrowserRouter>
    );

    const signUpTab = screen.getByRole('tab', { name: /sign up/i });
    fireEvent.click(signUpTab);

    const nameInput = screen.getByPlaceholderText(/full name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/^password$/i);

    fireEvent.change(nameInput, { target: { value: 'Test User' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'StrongPass123' } });

    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(signUpButton);

    // Should not show password strength error
    await waitFor(() => {
      expect(screen.queryByText(/8 characters/i)).toBeFalsy();
    });
  });
});
