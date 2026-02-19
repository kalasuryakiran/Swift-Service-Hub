import React, { createContext, useContext, useState } from 'react';
import { ServiceRequest, Status } from '@/types';
import { detectCategory, detectPriority, getSuggestion, generateId } from '@/utils/aiEngine';

// Sample seed data
const SEED_DATA: ServiceRequest[] = [
  {
    id: 'REQ-SEED001',
    title: 'WiFi not connecting in Block B',
    description: 'The wifi is not working since morning. Multiple users are affected. Urgent fix needed.',
    category: 'IT',
    priority: 'High',
    status: 'In Progress',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    suggestion: 'Try restarting your router and reconnecting. If persistent, check if others are affected.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'REQ-SEED002',
    title: 'AC not working in Room 204',
    description: 'The air conditioning unit in conference room 204 is broken. It is very hot inside.',
    category: 'Facilities',
    priority: 'Medium',
    status: 'Open',
    name: 'Bob Martinez',
    email: 'bob@example.com',
    suggestion: 'Check if the AC settings have been adjusted. Report to Facilities with your room/floor number.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'REQ-SEED003',
    title: 'Salary not credited for December',
    description: 'My December salary has not been credited yet. Please look into it.',
    category: 'Admin',
    priority: 'High',
    status: 'Resolved',
    name: 'Carol White',
    email: 'carol@example.com',
    suggestion: 'Verify your attendance records. Raise ticket with specific month/details for faster resolution.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

interface RequestContextType {
  requests: ServiceRequest[];
  addRequest: (data: { title: string; description: string; name: string; email: string }) => ServiceRequest;
  updateStatus: (id: string, status: Status) => void;
}

const RequestContext = createContext<RequestContextType | null>(null);

export function RequestProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<ServiceRequest[]>(SEED_DATA);

  const addRequest = (data: { title: string; description: string; name: string; email: string }): ServiceRequest => {
    const text = `${data.title} ${data.description}`;
    const newRequest: ServiceRequest = {
      id: generateId(),
      ...data,
      category: detectCategory(text),
      priority: detectPriority(text),
      status: 'Open',
      suggestion: getSuggestion(text),
      createdAt: new Date().toISOString(),
    };
    setRequests(prev => [newRequest, ...prev]);
    return newRequest;
  };

  const updateStatus = (id: string, status: Status) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  return (
    <RequestContext.Provider value={{ requests, addRequest, updateStatus }}>
      {children}
    </RequestContext.Provider>
  );
}

export function useRequests() {
  const ctx = useContext(RequestContext);
  if (!ctx) throw new Error('useRequests must be used within RequestProvider');
  return ctx;
}
