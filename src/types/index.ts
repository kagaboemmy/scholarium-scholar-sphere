
export type UserRole = 'admin' | 'student' | 'school';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  isApproved: boolean;
  createdAt: string;
  profile: StudentProfile | SchoolProfile | AdminProfile;
}

export interface StudentProfile {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gpa: number;
  major: string;
  university: string;
  phone: string;
  address: string;
  documents: UploadedDocument[];
}

export interface SchoolProfile {
  name: string;
  description: string;
  website: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
}

export interface AdminProfile {
  firstName: string;
  lastName: string;
  department: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  base64Data: string;
  uploadedAt: string;
}

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  amount: number;
  deadline: string;
  eligibilityCriteria: string;
  requirements: string[];
  universityId: string;
  universityName: string;
  isActive: boolean;
  createdAt: string;
  applicationCount: number;
}

export interface Application {
  id: string;
  scholarshipId: string;
  studentId: string;
  status: 'pending' | 'accepted' | 'rejected';
  essay: string;
  submittedAt: string;
  documents: UploadedDocument[];
  studentName: string;
  scholarshipName: string;
}
