import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RequestProvider } from '@/context/RequestContext';
import LoginPage from '@/components/LoginPage';
import RequestForm from '@/components/RequestForm';
import RequestList from '@/components/RequestList';
import Dashboard from '@/components/Dashboard';
import { ServiceRequest } from '@/types';
import { LogOut, Plus, Monitor, Bell } from 'lucide-react';

function PortalApp() {
  const { user, logout } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!user) return <LoginPage />;

  const handleCreated = (req: ServiceRequest) => {
    setShowForm(false);
    setToast(`Request ${req.id} submitted successfully!`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="bg-card border-b border-border sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Monitor className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-foreground text-sm">ServicePortal</span>
              <span className={`ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${user.role === 'admin' ? 'badge-progress' : 'badge-open'}`}>
                {user.role}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Hi, <span className="font-medium text-foreground">{user.displayName}</span>
            </span>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 text-sm font-semibold bg-primary text-primary-foreground px-3.5 py-2 rounded-lg hover:opacity-90 active:scale-[0.98] transition"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Request</span>
            </button>
            <button onClick={logout} className="p-2 rounded-lg hover:bg-muted transition" title="Sign out">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-foreground text-background text-sm font-medium px-4 py-3 rounded-xl shadow-modal">
          <Bell className="w-4 h-4" />
          {toast}
        </div>
      )}

      {/* Modal Overlay */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-foreground/30 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-card rounded-2xl shadow-modal border border-border p-6 max-h-[90vh] overflow-y-auto">
            <RequestForm onClose={() => setShowForm(false)} onCreated={handleCreated} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">
            {user.role === 'admin' ? 'Admin Dashboard' : 'My Requests'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {user.role === 'admin'
              ? 'Manage and update all service requests'
              : 'Raise and track your service requests'}
          </p>
        </div>

        {/* Dashboard (always visible) */}
        <Dashboard />

        {/* Request List */}
        <div className="bg-card border border-border rounded-2xl shadow-card p-5">
          <h2 className="text-base font-semibold text-foreground mb-4">All Requests</h2>
          <RequestList />
        </div>
      </main>
    </div>
  );
}

export default function Index() {
  return (
    <RequestProvider>
      <PortalApp />
    </RequestProvider>
  );
}
