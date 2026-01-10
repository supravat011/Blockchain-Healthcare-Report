export type UserRole = 'patient' | 'doctor' | 'hospital';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  walletAddress?: string;
  name: string;
  createdAt: Date;
}

export interface Patient extends User {
  role: 'patient';
  dateOfBirth?: string;
  bloodType?: string;
  emergencyContact?: string;
}

export interface Doctor extends User {
  role: 'doctor';
  licenseNumber: string;
  specialization: string;
  hospital?: string;
  isVerified: boolean;
}

export interface HospitalAdmin extends User {
  role: 'hospital';
  hospitalName: string;
  hospitalId: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  title: string;
  description: string;
  fileType: 'pdf' | 'image';
  fileName: string;
  fileSize: string;
  uploadDate: Date;
  ipfsHash: string;
  transactionHash: string;
  accessList: AccessPermission[];
}

export interface AccessPermission {
  id: string;
  reportId: string;
  doctorId: string;
  doctorName: string;
  grantedAt: Date;
  expiresAt?: Date;
  status: 'active' | 'pending' | 'revoked' | 'expired';
}

export interface AccessRequest {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  reportId?: string;
  reason: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ActivityLog {
  id: string;
  action: 'upload' | 'view' | 'grant_access' | 'revoke_access' | 'request_access';
  userId: string;
  userName: string;
  userRole: UserRole;
  reportId?: string;
  reportTitle?: string;
  details: string;
  timestamp: Date;
  transactionHash?: string;
}

export interface Diagnosis {
  id: string;
  reportId: string;
  doctorId: string;
  doctorName: string;
  content: string;
  prescription?: string;
  createdAt: Date;
  transactionHash: string;
}
