import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [mode, setMode] = useState('signin');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'signin') {
        const { error } = await signIn(form.email, form.password);
        if (error) setError(error.message);
      } else {
        const { error } = await signUp(form.email, form.password);
        if (error) setError(error.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  if (user) {
    return null; // Redirect handled by useEffect
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>
        {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="email"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="current-password"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold mb-4"
        >
          {submitting ? (mode === 'signin' ? 'Signing In...' : 'Signing Up...') : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
        </button>
        <div className="text-center text-sm">
          {mode === 'signin' ? (
            <>
              Don&apos;t have an account?{' '}
              <button type="button" className="text-blue-600 hover:underline" onClick={() => setMode('signup')}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" className="text-blue-600 hover:underline" onClick={() => setMode('signin')}>
                Sign In
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
} 