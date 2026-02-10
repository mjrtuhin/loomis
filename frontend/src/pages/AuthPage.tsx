import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Login } from '../components/auth/Login';
import { Signup } from '../components/auth/Signup';
import { PasswordReset } from '../components/auth/PasswordReset';

type AuthView = 'login' | 'signup' | 'reset';

export function AuthPage() {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">LOOMIS ENGINE</h1>
          <p className="text-gray-600">Free, open-source data visualization platform</p>
        </div>

        {/* Auth Forms */}
        {currentView === 'login' && (
          <Login
            onSwitchToSignup={() => setCurrentView('signup')}
            onSwitchToReset={() => setCurrentView('reset')}
            onLoginSuccess={handleAuthSuccess}
          />
        )}

        {currentView === 'signup' && (
          <Signup
            onSwitchToLogin={() => setCurrentView('login')}
            onSignupSuccess={handleAuthSuccess}
          />
        )}

        {currentView === 'reset' && (
          <PasswordReset onSwitchToLogin={() => setCurrentView('login')} />
        )}
      </div>
    </div>
  );
}
