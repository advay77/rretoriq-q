// Institution Admin Types

export interface InstitutionStudent {
  id: string;
  username: string;
  email: string;
  displayName: string;
  createdAt?: string;
}

export interface Institution {
  id: string;
  name: string;
  adminUserId: string;
  seatsPurchased: number;
  seatsUsed: number;
  seatsRemaining: number;
  students: InstitutionStudent[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateInstitutionRequest {
  institutionName: string;
  seatsPurchased: number;
  adminUserId: string;
}

export interface AddStudentRequest {
  institutionId: string;
  username: string;
}

export interface RemoveStudentRequest {
  institutionId: string;
  username: string;
}
