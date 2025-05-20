import { render, screen } from '@testing-library/react';
import App from './App';

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
});