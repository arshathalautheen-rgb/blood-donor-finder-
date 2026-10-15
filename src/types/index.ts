export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type BloodComponent = 'Whole Blood' | 'Red Blood Cells' | 'Platelets' | 'Fresh Frozen Plasma' | 'Cryoprecipitate';

export type UserRole = 'donor' | 'patient' | 'hospital' | 'blood_bank' | 'admin';

export type RequestUrgency = 'Immediate (Within 2 Hours)' | 'Critical (Within 6 Hours)' | 'Urgent (Within 24 Hours)' | 'Advance Planned (2-7 Days)';

export type RequestStatus = 
  | 'Pending Verification'
  | 'Active Broadcast'
  | 'Donors Responded'
  | 'Crossmatching Scheduled'
  | 'Donation Completed'
  | 'Fulfilled'
  | 'Cancelled';

export type ConsentStatus = 'pending' | 'granted' | 'declined' | 'completed';

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  city: string;
  state: string;
  zipCode: string;
  distanceKm: number;
  phoneMasked: string; // privacy-first (e.g. +1 (555) •••-4821)
  emailMasked: string;
  isAvailable: boolean;
  isEmergencyReady: boolean;
  lastDonationDate: string; // ISO date string
  totalDonations: number;
  livesSavedEstimate: number;
  verifiedDonor: boolean;
  healthScreeningStatus: 'verified' | 'pending' | 'deferred';
  nextEligibleDate: string;
  preferredDonationCenter: string;
  consentSharingAllowed: boolean;
  badgeLevel: 'Bronze' | 'Silver' | 'Gold' | 'Century Star';
  recentAchievement?: string;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  component: BloodComponent;
  unitsNeeded: number;
  unitsFulfilled: number;
  hospitalName: string;
  hospitalDepartment: string;
  hospitalCity: string;
  hospitalAddress: string;
  attendingPhysician: string;
  urgency: RequestUrgency;
  neededBy: string; // ISO string
  createdAt: string;
  status: RequestStatus;
  contactRepresentative: {
    relationship: string;
    contactMasked: string;
  };
  matchedDonorsCount: number;
  respondedDonorsCount: number;
  notes: string;
  isEmergencySOS: boolean;
  isSurgeryPlanned?: boolean;
  surgeryPlanId?: string;
}

export interface SurgeryBloodPlan {
  id: string;
  patientName: string;
  patientIdMasked: string;
  scheduledDate: string;
  scheduledTime: string;
  procedureName: string;
  surgicalSpecialty: 'Cardiothoracic' | 'Orthopedics' | 'Neurosurgery' | 'Obstetrics' | 'Oncology' | 'Transplant' | 'Trauma';
  leadSurgeon: string;
  hospitalName: string;
  bloodGroup: BloodGroup;
  estimatedUnitsRBC: number;
  estimatedUnitsFFP: number;
  estimatedUnitsPlatelets: number;
  currentMilestone: 1 | 2 | 3 | 4 | 5;
  milestones: {
    step: number;
    title: string;
    description: string;
    status: 'completed' | 'in_progress' | 'upcoming';
    completedAt?: string;
  }[];
  reservedDonorIds: string[];
  crossmatchStatus: 'Awaiting Samples' | 'Crossmatched & Compatible' | 'In Progress' | 'Action Needed';
  assignedBloodBank: string;
}

export interface BloodInventoryItem {
  id: string;
  bloodGroup: BloodGroup;
  component: BloodComponent;
  unitsAvailable: number;
  reservedUnits: number;
  criticalThreshold: number;
  oldestUnitDays: number;
  maxShelfLifeDays: number;
  status: 'Adequate' | 'Moderate' | 'Critical Shortage' | 'Expiring Soon';
  lastUpdated: string;
  facilityName: string;
}

export interface HealthScreeningAnswer {
  questionId: string;
  questionText: string;
  category: 'vitals' | 'medical' | 'travel' | 'lifestyle';
  answer: boolean | string | number;
  isDisqualifying: boolean;
  deferralDays?: number;
  explanation?: string;
}

export interface ScreeningResult {
  id: string;
  donorName: string;
  bloodGroup: BloodGroup;
  date: string;
  status: 'Eligible' | 'Temporary Deferral' | 'Permanent Deferral';
  reason?: string;
  eligibleFromDate?: string;
  vitalSummary: {
    age: number;
    weightKg: number;
    estimatedHb: number;
    bloodPressure: string;
    pulse: number;
  };
}

export interface CertificateData {
  id: string;
  donorName: string;
  bloodGroup: BloodGroup;
  issueDate: string;
  totalUnitsDonated: number;
  livesImpacted: number;
  certificateType: 'Milestone Honor' | 'Emergency LifeSaver' | 'First Drop Honor' | 'Gallon Milestone';
  verificationCode: string;
  signedByDirector: string;
  institution: string;
}

export interface DonorBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  category: 'milestones' | 'emergency' | 'special';
  color: string;
}

export interface AppreciationPerk {
  id: string;
  title: string;
  partner: string;
  category: 'Wellness & Health' | 'Nutrition' | 'Community' | 'Appreciation';
  description: string;
  code: string;
  validUntil: string;
  badgeRequired: string;
}
