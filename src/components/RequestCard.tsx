import { ServiceRequest, Status } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight, Lightbulb } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRequests } from '@/context/RequestContext';

const STATUS_FLOW: Record<Status, Status | null> = {
  'Open': 'In Progress',
  'In Progress': 'Resolved',
  'Resolved': null,
};

const STATUS_LABELS: Record<Status, string> = {
  'Open': 'Mark In Progress',
  'In Progress': 'Mark Resolved',
  'Resolved': 'Resolved ✓',
};

function CategoryBadge({ cat }: { cat: ServiceRequest['category'] }) {
  const cls = cat === 'IT' ? 'badge-it' : cat === 'Admin' ? 'badge-admin' : 'badge-facilities';
  return <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{cat}</span>;
}

function PriorityBadge({ p }: { p: ServiceRequest['priority'] }) {
  const cls = p === 'High' ? 'badge-high' : p === 'Medium' ? 'badge-medium' : 'badge-low';
  return <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{p}</span>;
}

function StatusBadge({ s }: { s: Status }) {
  const cls = s === 'Open' ? 'badge-open' : s === 'In Progress' ? 'badge-progress' : 'badge-resolved';
  return <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${cls}`}>{s}</span>;
}

export default function RequestCard({ request }: { request: ServiceRequest }) {
  const { user } = useAuth();
  const { updateStatus } = useRequests();
  const next = STATUS_FLOW[request.status];
  const isAdmin = user?.role === 'admin';

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs text-muted-foreground font-mono">{request.id}</span>
            <CategoryBadge cat={request.category} />
            <PriorityBadge p={request.priority} />
            <StatusBadge s={request.status} />
          </div>
          <h3 className="font-semibold text-foreground text-base leading-snug truncate">{request.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{request.description}</p>

          {request.suggestion && (
            <div className="mt-3 flex gap-2 bg-accent rounded-lg px-3 py-2.5">
              <Lightbulb className="w-4 h-4 text-accent-foreground flex-shrink-0 mt-0.5" />
              <p className="text-xs text-accent-foreground leading-relaxed">{request.suggestion}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
            <span>{request.name}</span>
            <span>{request.email}</span>
            <span>{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
          </div>
        </div>

        {isAdmin && next && (
          <button
            onClick={() => updateStatus(request.id, next)}
            className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:opacity-90 active:scale-[0.97] transition whitespace-nowrap"
          >
            {STATUS_LABELS[request.status]}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
        {isAdmin && !next && (
          <span className="flex-shrink-0 text-xs font-semibold text-muted-foreground px-3 py-2 rounded-lg bg-muted">
            {STATUS_LABELS[request.status]}
          </span>
        )}
      </div>
    </div>
  );
}
