import { useState, FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validators';

interface PasswordResetProps {
  onSwitchToLogin: () => void;
}

export function PasswordReset({ onSwitchToLogin }: PasswordResetProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setResetError(null);

    // Validate email
    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }

    setLoading(true);

    try {
      await resetPassword(email);
      setEmailSent(true);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setResetError('No account found with this email');
      } else {
        setResetError(err.message || 'Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Email Sent!</h2>
          <p className="text-gray-600 mb-6">
            Check your inbox for instructions to reset your password. The link expires in 1 hour.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setEmailSent(false)}
              className="w-full py-2 px-4 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Resend Email
            </button>
            <button
              onClick={onSwitchToLogin}
              className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Reset Password</h2>
      <p className="text-gray-600 text-center mb-6">
        Enter your email and we'll send you instructions to reset your password.
      </p>

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

        {/* Reset Error */}
        {resetError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{resetError}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      {/* Back to Login */}
      <div className="mt-6 text-center">
        <button
          onClick={onSwitchToLogin}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to login
        </button>
      </div>
    </div>
  );
}
