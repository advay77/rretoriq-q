/**
 * API client for institutional admin endpoints
 */

const API_BASE = import.meta.env.VITE_API_PROXY_BASE || 'https://rretoriq-backend-api.vercel.app/api';

export interface Institution {
  id: string;
  institutionName: string;
  adminUserId: string;
  adminEmail: string;
  seatsPurchased: number;
  students: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionalStudent {
  username: string;
  email: string;
  displayName: string;
  institutionId?: string;
}

export interface CreateInstitutionRequest {
  institutionName: string;
  seatsPurchased: number;
  adminUserId: string;
  adminEmail?: string;
}

export interface AddStudentRequest {
  institutionId: string;
  username: string; // email or username
}

export interface RemoveStudentRequest {
  institutionId: string;
  username: string;
}

/**
 * Create or update institution profile
 */
export async function createInstitution(data: CreateInstitutionRequest): Promise<Institution> {
  const response = await fetch(`${API_BASE}/admin/create-institution`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create institution');
  }

  const result = await response.json();
  return result.institution;
}

/**
 * Add student to institution by username/email
 */
export async function addStudent(data: AddStudentRequest): Promise<{ remainingSeats: number }> {
  const response = await fetch(`${API_BASE}/admin/add-student`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add student');
  }

  return response.json();
}

/**
 * Remove student from institution
 */
export async function removeStudent(data: RemoveStudentRequest): Promise<void> {
  const response = await fetch(`${API_BASE}/admin/remove-student`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to remove student');
  }
}

/**
 * Get institution data with student details
 * Can query by institutionId or adminUserId
 */
export async function getInstitution(adminUserId: string): Promise<{
  institution: Institution | null;
  studentDetails: InstitutionalStudent[];
  hasInstitution: boolean;
}> {
  const response = await fetch(`${API_BASE}/admin/get-institution?adminUserId=${adminUserId}`);

  if (response.status === 404) {
    // No institution found - this is ok, just means not created yet
    return {
      institution: null,
      studentDetails: [],
      hasInstitution: false
    };
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch institution data');
  }

  const data = await response.json();
  
  return {
    institution: data.institution ? {
      id: data.institution.id,
      institutionName: data.institution.name,
      adminUserId: data.institution.adminUserId,
      adminEmail: '',
      seatsPurchased: data.institution.seatsPurchased,
      students: data.institution.students?.map((s: any) => s.email) || [],
      createdAt: data.institution.createdAt,
      updatedAt: data.institution.updatedAt
    } : null,
    studentDetails: data.institution?.students || [],
    hasInstitution: data.success
  };
}

