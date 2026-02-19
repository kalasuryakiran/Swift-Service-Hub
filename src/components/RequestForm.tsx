import { useState } from 'react';
import { useRequests } from '@/context/RequestContext';
import { useAuth } from '@/context/AuthContext';
import { detectCategory, detectPriority, getSuggestion } from '@/utils/aiEngine';
import { Sparkles, Send, X } from 'lucide-react';
import { ServiceRequest } from '@/types';

interface Props {
  onClose: () => void;
  onCreated: (req: ServiceRequest) => void;
}

export default function RequestForm({ onClose, onCreated }: Props) {
  const { addRequest } = useRequests();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    name: user?.displayName || '',
    email: '',
  });
  const [preview, setPreview] = useState<{ category: string; priority: string; suggestion?: string } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    if (updated.title || updated.description) {
      const text = `${updated.title} ${updated.description}`;
      setPreview({
        category: detectCategory(text),
        priority: detectPriority(text),
        suggestion: getSuggestion(text),
      });
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const req = addRequest(form);
    setSubmitted(true);
    setTimeout(() => onCreated(req), 800);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-[hsl(var(--status-resolved-bg))] flex items-center justify-center mb-4">
          <Send className="w-6 h-6 text-[hsl(var(--status-resolved))]" />
        </div>
        <h3 className="font-semibold text-foreground text-lg">Request Submitted!</h3>
        <p className="text-sm text-muted-foreground mt-1">We'll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">New Service Request</h2>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Your Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Brief title of the issue..."
            required
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the issue in detail..."
            required
            rows={4}
            className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition resize-none"
          />
        </div>

        {/* AI Preview */}
        {preview && (
          <div className="bg-accent border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-accent-foreground" />
              <span className="text-xs font-semibold text-accent-foreground uppercase tracking-wide">AI Detection Preview</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="font-medium text-muted-foreground">Category:</span>
              <span className={`font-semibold px-2 py-0.5 rounded-full ${preview.category === 'IT' ? 'badge-it' : preview.category === 'Admin' ? 'badge-admin' : 'badge-facilities'}`}>{preview.category}</span>
              <span className="font-medium text-muted-foreground ml-2">Priority:</span>
              <span className={`font-semibold px-2 py-0.5 rounded-full ${preview.priority === 'High' ? 'badge-high' : preview.priority === 'Medium' ? 'badge-medium' : 'badge-low'}`}>{preview.priority}</span>
            </div>
            {preview.suggestion && (
              <p className="text-xs text-accent-foreground mt-1 leading-relaxed">
                💡 <em>{preview.suggestion}</em>
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-lg text-sm hover:opacity-90 active:scale-[0.98] transition flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          Submit Request
        </button>
      </form>
    </div>
  );
}
