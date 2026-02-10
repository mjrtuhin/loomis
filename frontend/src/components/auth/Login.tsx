import { useState, FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validators';

interface LoginProps {
  onSwitchToSignup: () => void;
  onSwitchToReset: () => void;
  onLoginSuccess: () => void;
}

export function Login({ onSwitchToSignup, onSwitchToReset, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setLoginError(null);

    // Validate email
    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }

    // Validate password is not empty
    if (!password) {
      setLoginError('Password is required');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setLoginError('Invalid email or password');
      } else if (err.code === 'auth/too-many-requests') {
        setLoginError('Too many failed attempts. Please try again later.');
      } else {
        setLoginError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Log In</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              emailError
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
            }`}
            placeholder="you@example.com"
          />
          {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-600 hover:text-gray-900"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <button
            type="button"
            onClick={onSwitchToReset}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Error */}
        {loginError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{loginError}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      {/* Switch to Signup */}
      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToSignup}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Sign up
        </button>
      </p>
    </div>
  );
}
