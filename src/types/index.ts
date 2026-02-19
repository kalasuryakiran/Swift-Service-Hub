export type Category = 'IT' | 'Admin' | 'Facilities';
export type Priority = 'High' | 'Medium' | 'Low';
export type Status = 'Open' | 'In Progress' | 'Resolved';
export type Role = 'admin' | 'user';

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: Category;
  priority: Priority;
  status: Status;
  name: string;
  email: string;
  suggestion?: string;
  createdAt: string;
}

export interface User {
  username: string;
  role: Role;
  displayName: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
