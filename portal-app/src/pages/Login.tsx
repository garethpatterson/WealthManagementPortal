import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Lock, Activity } from 'lucide-react';

export const Login: React.FC = () => {
  const { loginDemo } = useAuth();
  const [email, setEmail] = useState('client@example.com');
  const [password, setPassword] = useState('password123'); // Demo defaults
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      if (auth) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Demo mode fallback
        await new Promise(resolve => setTimeout(resolve, 800));
        loginDemo();
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      setError('Failed to securely authenticate. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background overflow-hidden relative">
      {/* Premium Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-800/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 w-full max-w-md p-8 sm:p-10 bg-card rounded-2xl border border-border/50 shadow-premium relative">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-50 dark:bg-slate-800 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100 dark:border-slate-700">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Secure Client Portal</h1>
          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-success" />
            256-bit Encrypted Connection
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg flex items-start gap-3">
            <Shield className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground tracking-wide">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
              placeholder="name@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground tracking-wide">Password</label>
            <div className="relative">
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none pl-11"
                placeholder="••••••••"
              />
              <Lock className="w-5 h-5 text-muted-foreground absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl py-3.5 px-4 transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            Data resides exclusively in Canada to ensure maximum privacy and regulatory compliance.
          </p>
        </div>
      </div>
    </div>
  );
};
