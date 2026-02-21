// User types
export type UserRole = 'ADMIN' | 'MEMBER';

export interface User {
  id: string;
  email: string;
  name: string;
  organizationId: string;
  role: UserRole;
  createdAt: string;
}

// Organization types
export interface Organization {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationWithMembers extends Organization {
  users: User[];
}

// Task types
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  organizationId: string;
  assignedToId: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  isOverdue: boolean;
  assignedTo: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  organizationName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  organization: Organization;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Task form types
export interface CreateTaskData {
  title: string;
  description?: string;
  status: TaskStatus;       
  priority: TaskPriority;    
  dueDate?: string;
  assignedToId?: string;
}

export interface UpdateTaskData {
  title?: string;        
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  assignedToId?: string;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedToId?: string;
  searchTerm?: string;
}


// Invite member types
export interface InviteMemberData {
  email: string;
  name: string;
  role?: UserRole;
}

export interface InviteMemberResponse {
  member: User;
  temporaryPassword: string;
}

// Dashboard stats
export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  highPriority: number;
}

// Update profile types
export interface UpdateProfileData {
  name?: string;
  email?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Update organization type
export interface UpdateOrganizationData {
  name: string;
}
