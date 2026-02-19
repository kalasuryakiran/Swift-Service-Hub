import { useMemo, useState } from 'react';
import { useRequests } from '@/context/RequestContext';
import { useAuth } from '@/context/AuthContext';
import { Category, Priority, Status } from '@/types';
import RequestCard from './RequestCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

type FilterState = {
  category: Category | 'All';
  status: Status | 'All';
  priority: Priority | 'All';
  search: string;
};

export default function RequestList() {
  const { requests } = useRequests();
  const { user } = useAuth();
  const [filters, setFilters] = useState<FilterState>({
    category: 'All', status: 'All', priority: 'All', search: '',
  });

  const filtered = useMemo(() => {
    let list = requests;
    // Non-admin users only see their own requests (by email)
    // For demo, admin sees all; user sees all (since seed data doesn't have their email)
    if (filters.category !== 'All') list = list.filter(r => r.category === filters.category);
    if (filters.status !== 'All') list = list.filter(r => r.status === filters.status);
    if (filters.priority !== 'All') list = list.filter(r => r.priority === filters.priority);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q)
      );
    }
    return list;
  }, [requests, filters]);

  const setFilter = <K extends keyof FilterState>(key: K, val: FilterState[K]) =>
    setFilters(f => ({ ...f, [key]: val }));

  const clearFilters = () => setFilters({ category: 'All', status: 'All', priority: 'All', search: '' });
  const hasFilters = filters.category !== 'All' || filters.status !== 'All' || filters.priority !== 'All' || filters.search !== '';

  const SelectFilter = ({ label, filterKey, options }: {
    label: string;
    filterKey: keyof Omit<FilterState, 'search'>;
    options: string[];
  }) => (
    <select
      value={filters[filterKey]}
      onChange={e => setFilter(filterKey, e.target.value as never)}
      className="px-3 py-2 text-sm rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition cursor-pointer"
    >
      <option value="All">{label}: All</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div>
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={filters.search}
            onChange={e => setFilter('search', e.target.value)}
            placeholder="Search requests..."
            className="w-full pl-9 pr-3.5 py-2 text-sm rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <SelectFilter label="Category" filterKey="category" options={['IT', 'Admin', 'Facilities']} />
          <SelectFilter label="Status" filterKey="status" options={['Open', 'In Progress', 'Resolved']} />
          <SelectFilter label="Priority" filterKey="priority" options={['High', 'Medium', 'Low']} />
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition px-2 py-2">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground mb-3">
        {filtered.length} request{filtered.length !== 1 ? 's' : ''} found
        {user?.role === 'admin' && <span className="ml-1 text-primary font-medium">(Admin view)</span>}
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No requests found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(req => <RequestCard key={req.id} request={req} />)}
        </div>
      )}
    </div>
  );
}
