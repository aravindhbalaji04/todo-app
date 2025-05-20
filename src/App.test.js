import { render, screen } from '@testing-library/react';
import App from './App';
import { render, screen, cleanup } from '@testing-library/react';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
jest.mock('./supabaseClient', () => ({
  supabase: {
    auth: {
      session: jest.fn(),
      onAuthStateChange: jest.fn()
    }
  }
}));

jest.mock('./components/Todo', () => () => <div>Todo Component</div>);
jest.mock('./components/Login', () => ({ setUser }) => <div>Login Component</div>);

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test('renders header', () => {
    require('./supabaseClient').supabase.auth.session.mockReturnValue(null);
    require('./supabaseClient').supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } });
    render(<App />);
    expect(screen.getByText(/DoItASAP/i)).toBeInTheDocument();
  });

  test('shows Login when user is not authenticated', () => {
    require('./supabaseClient').supabase.auth.session.mockReturnValue(null);
    require('./supabaseClient').supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } });
    render(<App />);
    expect(screen.getByText(/Login Component/i)).toBeInTheDocument();
  });

  test('shows Todo when user is authenticated', () => {
    require('./supabaseClient').supabase.auth.session.mockReturnValue({ user: { id: '123' } });
    require('./supabaseClient').supabase.auth.onAuthStateChange.mockImplementation((cb) => {
      cb('SIGNED_IN', { user: { id: '123' } });
      return { data: { subscription: { unsubscribe: jest.fn() } } };
    });
    render(<App />);
    expect(screen.getByText(/Todo Component/i)).toBeInTheDocument();
  });

  test('calls setUser on mount with session user', () => {
    const sessionUser = { id: 'abc' };
    require('./supabaseClient').supabase.auth.session.mockReturnValue({ user: sessionUser });
    require('./supabaseClient').supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } });
    render(<App />);
    expect(screen.getByText(/Todo Component/i)).toBeInTheDocument();
  });

  test('unsubscribes from authListener on unmount', () => {
    const unsubscribe = jest.fn();
    require('./supabaseClient').supabase.auth.session.mockReturnValue(null);
    require('./supabaseClient').supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe } } });
    const { unmount } = render(<App />);
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });

  test('renders main and header containers', () => {
    require('./supabaseClient').supabase.auth.session.mockReturnValue(null);
    require('./supabaseClient').supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } });
    render(<App />);
    expect(document.querySelector('.app')).toBeInTheDocument();
    expect(document.querySelector('.app-header')).toBeInTheDocument();
    expect(document.querySelector('.app-main')).toBeInTheDocument();
  });

  test('renders Login if session is undefined', () => {
    require('./supabaseClient').supabase.auth.session.mockReturnValue(undefined);
    require('./supabaseClient').supabase.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } });
    render(<App />);
    expect(screen.getByText(/Login Component/i)).toBeInTheDocument();
  });
});