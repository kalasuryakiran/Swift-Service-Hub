import { useRequests } from '@/context/RequestContext';
import { CheckCircle2, Clock, Inbox, LayoutGrid } from 'lucide-react';

export default function Dashboard() {
  const { requests } = useRequests();

  const total = requests.length;
  const open = requests.filter(r => r.status === 'Open').length;
  const inProgress = requests.filter(r => r.status === 'In Progress').length;
  const resolved = requests.filter(r => r.status === 'Resolved').length;

  const byCategory = {
    IT: requests.filter(r => r.category === 'IT').length,
    Admin: requests.filter(r => r.category === 'Admin').length,
    Facilities: requests.filter(r => r.category === 'Facilities').length,
  };

  const stats = [
    { label: 'Total Requests', value: total, icon: LayoutGrid, color: 'text-primary', bg: 'bg-accent' },
    { label: 'Open', value: open, icon: Inbox, color: 'text-[hsl(var(--status-open))]', bg: 'bg-[hsl(var(--status-open-bg))]' },
    { label: 'In Progress', value: inProgress, icon: Clock, color: 'text-[hsl(var(--status-progress))]', bg: 'bg-[hsl(var(--status-progress-bg))]' },
    { label: 'Resolved', value: resolved, icon: CheckCircle2, color: 'text-[hsl(var(--status-resolved))]', bg: 'bg-[hsl(var(--status-resolved-bg))]' },
  ];

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  return (
    <div className="mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 shadow-card">
            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${bg} mb-3`}>
              <Icon className={`w-4.5 h-4.5 ${color}`} />
            </div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* By Category */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-3">By Category</h3>
          <div className="space-y-2">
            {Object.entries(byCategory).map(([cat, count]) => {
              const pct = total > 0 ? (count / total) * 100 : 0;
              const barCls = cat === 'IT' ? 'bg-[hsl(var(--cat-it))]' : cat === 'Admin' ? 'bg-[hsl(var(--cat-admin))]' : 'bg-[hsl(var(--cat-facilities))]';
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{cat}</span>
                    <span className="font-medium text-foreground">{count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${barCls} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resolution Rate */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-card flex flex-col items-center justify-center">
          <div className="relative w-20 h-20 mb-3">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="2.5" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="hsl(var(--status-resolved))"
                strokeWidth="2.5"
                strokeDasharray={`${resolutionRate} ${100 - resolutionRate}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-foreground">{resolutionRate}%</span>
            </div>
          </div>
          <p className="text-sm font-semibold text-foreground">Resolution Rate</p>
          <p className="text-xs text-muted-foreground mt-0.5">{resolved} of {total} resolved</p>
        </div>
      </div>
    </div>
  );
}
