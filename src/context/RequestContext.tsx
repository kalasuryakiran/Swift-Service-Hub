import React, { createContext, useContext, useState, useEffect } from 'react';
import { ServiceRequest, Status } from '@/types';
import { detectCategory, detectPriority, getSuggestion, generateId } from '@/utils/aiEngine';

interface RequestContextType {
  requests: ServiceRequest[];
  addRequest: (data: { title: string; description: string; name: string; email: string }) => Promise<ServiceRequest>;
  updateStatus: (id: string, status: Status) => Promise<void>;
}

const RequestContext = createContext<RequestContextType | null>(null);

export function RequestProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    fetch('/api/requests')
      .then(res => res.json())
      .then(data => setRequests(data))
      .catch(err => console.error('Failed to fetch requests', err));
  }, []);

  const addRequest = async (data: { title: string; description: string; name: string; email: string }): Promise<ServiceRequest> => {
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

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest),
      });

      if (response.ok) {
        setRequests(prev => [newRequest, ...prev]);
        return newRequest;
      } else {
        throw new Error('Failed to create request');
      }
    } catch (error) {
      console.error('Error adding request:', error);
      throw error;
    }
  };

  const updateStatus = async (id: string, status: Status) => {
    try {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r)); // Optimistic update
      await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Error updating status:', error);
      // Revert if needed (not implemented here for simplicity)
    }
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
