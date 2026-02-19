import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Monitor, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      const ok = login(username, password);
      if (!ok) setError('Invalid username or password.');
      setLoading(false);
    }, 400);
  };

  const fillDemo = (u: string, p: string) => { setUsername(u); setPassword(p); setError(''); };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary mb-4 shadow-modal">
            <Monitor className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Service Request Portal</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to raise or manage service requests</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-modal border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-destructive/10 text-destructive text-sm px-3 py-2.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg text-sm hover:opacity-90 active:scale-[0.98] transition disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Admin', u: 'admin', p: 'admin123', badge: 'admin' },
                { label: 'User (John)', u: 'john', p: 'john123', badge: 'user' },
              ].map(({ label, u, p, badge }) => (
                <button
                  key={u}
                  onClick={() => fillDemo(u, p)}
                  className="flex flex-col items-start px-3 py-2.5 rounded-lg border border-border hover:bg-muted transition text-left"
                >
                  <span className="text-xs font-semibold text-foreground">{label}</span>
                  <span className="text-xs text-muted-foreground">{u} / {p}</span>
                  <span className={`mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${badge === 'admin' ? 'badge-progress' : 'badge-open'}`}>
                    {badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
