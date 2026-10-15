import { Donor, BloodRequest, SurgeryBloodPlan, BloodInventoryItem, DonorBadge, AppreciationPerk, BloodGroup } from '../types';

export const COMPATIBILITY_MATRIX: Record<BloodGroup, { canGiveTo: BloodGroup[]; canReceiveFrom: BloodGroup[]; isUniversalDonor?: boolean; isUniversalRecipient?: boolean; redCellTraits: string; plasmaTraits: string }> = {
  'O-': {
    canGiveTo: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['O-'],
    isUniversalDonor: true,
    redCellTraits: 'Universal Red Blood Cell Donor. Critical for trauma centers and neonatal ICUs.',
    plasmaTraits: 'Can receive plasma from all types; can only give plasma to O.'
  },
  'O+': {
    canGiveTo: ['O+', 'A+', 'B+', 'AB+'],
    canReceiveFrom: ['O+', 'O-'],
    redCellTraits: 'Most transfused blood type globally. High demand in all acute surgeries.',
    plasmaTraits: 'Can donate plasma to O and A patients.'
  },
  'A-': {
    canGiveTo: ['A-', 'A+', 'AB-', 'AB+'],
    canReceiveFrom: ['A-', 'O-'],
    redCellTraits: 'Essential for A- and AB- patients needing emergency red cells.',
    plasmaTraits: 'Can receive plasma from A and AB types.'
  },
  'A+': {
    canGiveTo: ['A+', 'AB+'],
    canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
    redCellTraits: 'Second most common blood type; vital for oncology and major surgery.',
    plasmaTraits: 'Can donate plasma to A and O patients.'
  },
  'B-': {
    canGiveTo: ['B-', 'B+', 'AB-', 'AB+'],
    canReceiveFrom: ['B-', 'O-'],
    redCellTraits: 'Rare blood group (~1.5% population). Highly prized for sickle cell and oncology.',
    plasmaTraits: 'Can receive plasma from B and AB types.'
  },
  'B+': {
    canGiveTo: ['B+', 'AB+'],
    canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
    redCellTraits: 'Critical for acute trauma and routine elective surgeries in diverse populations.',
    plasmaTraits: 'Can donate plasma to B and O patients.'
  },
  'AB-': {
    canGiveTo: ['AB-', 'AB+'],
    canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'],
    redCellTraits: 'Rarest blood group (~0.6% population). Transfused selectively.',
    plasmaTraits: 'Universal plasma provider to all Rh-negative patients.'
  },
  'AB+': {
    canGiveTo: ['AB+'],
    canReceiveFrom: ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
    isUniversalRecipient: true,
    redCellTraits: 'Universal Red Blood Cell Recipient. Can safely receive RBCs from any blood type.',
    plasmaTraits: 'Universal Plasma Donor (Golden Plasma). Plasma contains no A or B antibodies!'
  }
};

export const INITIAL_DONORS: Donor[] = [
  {
    id: 'donor-1',
    name: 'Marcus Vance',
    bloodGroup: 'O-',
    city: 'Boston',
    state: 'MA',
    zipCode: '02115',
    distanceKm: 2.4,
    phoneMasked: '+1 (617) •••-3829',
    emailMasked: 'm••••••e@gmail.com',
    isAvailable: true,
    isEmergencyReady: true,
    lastDonationDate: '2026-07-10',
    totalDonations: 14,
    livesSavedEstimate: 42,
    verifiedDonor: true,
    healthScreeningStatus: 'verified',
    nextEligibleDate: '2026-09-05',
    preferredDonationCenter: 'Massachusetts General Transfusion Center',
    consentSharingAllowed: true,
    badgeLevel: 'Century Star',
    recentAchievement: 'Universal Lifesaver Award 2026'
  },
  {
    id: 'donor-2',
    name: 'Elena Rostova',
    bloodGroup: 'A+',
    city: 'Cambridge',
    state: 'MA',
    zipCode: '02138',
    distanceKm: 4.8,
    phoneMasked: '+1 (617) •••-8104',
    emailMasked: 'e••••••a@outlook.com',
    isAvailable: true,
    isEmergencyReady: true,
    lastDonationDate: '2026-08-01',
    totalDonations: 6,
    livesSavedEstimate: 18,
    verifiedDonor: true,
    healthScreeningStatus: 'verified',
    nextEligibleDate: '2026-09-26',
    preferredDonationCenter: 'Mount Auburn Regional Blood Center',
    consentSharingAllowed: true,
    badgeLevel: 'Silver',
    recentAchievement: 'Triple Platelet Champion'
  },
  {
    id: 'donor-3',
    name: 'Devon Bradley',
    bloodGroup: 'B-',
    city: 'Brookline',
    state: 'MA',
    zipCode: '02445',
    distanceKm: 6.2,
    phoneMasked: '+1 (617) •••-9932',
    emailMasked: 'd••••••y@yahoo.com',
    isAvailable: true,
    isEmergencyReady: true,
    lastDonationDate: '2026-06-15',
    totalDonations: 9,
    livesSavedEstimate: 27,
    verifiedDonor: true,
    healthScreeningStatus: 'verified',
    nextEligibleDate: '2026-08-10',
    preferredDonationCenter: 'Brigham and Women’s Donor Pavilion',
    consentSharingAllowed: true,
    badgeLevel: 'Gold',
    recentAchievement: 'Rare Blood Hero'
  },
  {
    id: 'donor-4',
    name: 'Sophia Chen',
    bloodGroup: 'AB+',
    city: 'Somerville',
    state: 'MA',
    zipCode: '02143',
    distanceKm: 5.1,
    phoneMasked: '+1 (617) •••-4277',
    emailMasked: 's••••••n@mit.edu',
    isAvailable: true,
    isEmergencyReady: false,
    lastDonationDate: '2026-09-02',
    totalDonations: 4,
    livesSavedEstimate: 12,
    verifiedDonor: true,
    healthScreeningStatus: 'verified',
    nextEligibleDate: '2026-10-28',
    preferredDonationCenter: 'Cambridge Health Alliance Blood Bank',
    consentSharingAllowed: true,
    badgeLevel: 'Silver',
    recentAchievement: 'Universal Plasma Provider'
  },
  {
    id: 'donor-5',
    name: 'Tariq Al-Mansoor',
    bloodGroup: 'O+',
    city: 'Newton',
    state: 'MA',
    zipCode: '02458',
    distanceKm: 8.5,
    phoneMasked: '+1 (617) •••-5510',
    emailMasked: 't••••••r@gmail.com',
    isAvailable: true,
    isEmergencyReady: true,
    lastDonationDate: '2026-07-22',
    totalDonations: 18,
    livesSavedEstimate: 54,
    verifiedDonor: true,
    healthScreeningStatus: 'verified',
    nextEligibleDate: '2026-09-16',
    preferredDonationCenter: 'Newton-Wellesley Hospital Blood Hub',
    consentSharingAllowed: true,
    badgeLevel: 'Century Star',
    recentAchievement: '5-Gallon Lifesaver Medal'
  },
  {
    id: 'donor-6',
    name: 'Chloe Tremblay',
    bloodGroup: 'A-',
    city: 'Quincy',
    state: 'MA',
    zipCode: '02169',
    distanceKm: 11.2,
    phoneMasked: '+1 (617) •••-1288',
    emailMasked: 'c••••••y@gmail.com',
    isAvailable: true,
    isEmergencyReady: true,
    lastDonationDate: '2026-06-30',
    totalDonations: 3,
    livesSavedEstimate: 9,
    verifiedDonor: true,
    healthScreeningStatus: 'verified',
    nextEligibleDate: '2026-08-25',
    preferredDonationCenter: 'South Shore Health Center',
    consentSharingAllowed: true,
    badgeLevel: 'Bronze',
    recentAchievement: 'Emergency Ready Certified'
  },
  {
    id: 'donor-7',
    name: 'Jordan Rivera',
    bloodGroup: 'AB-',
    city: 'Waltham',
    state: 'MA',
    zipCode: '02451',
    distanceKm: 14.0,
    phoneMasked: '+1 (781) •••-7390',
    emailMasked: 'j••••••a@gmail.com',
    isAvailable: false,
    isEmergencyReady: false,
    lastDonationDate: '2026-09-20',
    totalDonations: 8,
    livesSavedEstimate: 24,
    verifiedDonor: true,
    healthScreeningStatus: 'deferred',
    nextEligibleDate: '2026-11-15',
    preferredDonationCenter: 'Boston Children’s Hospital Donor Station',
    consentSharingAllowed: false,
    badgeLevel: 'Gold',
    recentAchievement: 'Ultra Rare Group Champion'
  },
  {
    id: 'donor-8',
    name: 'Amina Osei',
    bloodGroup: 'B+',
    city: 'Everett',
    state: 'MA',
    zipCode: '02149',
    distanceKm: 7.3,
    phoneMasked: '+1 (617) •••-6401',
    emailMasked: 'a••••••i@gmail.com',
    isAvailable: true,
    isEmergencyReady: true,
    lastDonationDate: '2026-07-05',
    totalDonations: 5,
    livesSavedEstimate: 15,
    verifiedDonor: true,
    healthScreeningStatus: 'verified',
    nextEligibleDate: '2026-08-30',
    preferredDonationCenter: 'Boston Medical Transfusion Service',
    consentSharingAllowed: true,
    badgeLevel: 'Silver',
    recentAchievement: 'Weekend Hero 2026'
  }
];

export const INITIAL_REQUESTS: BloodRequest[] = [
  {
    id: 'req-sos-101',
    patientName: 'Hannah Abbott (Trauma ICU)',
    patientAge: 29,
    patientGender: 'Female',
    bloodGroup: 'O-',
    component: 'Red Blood Cells',
    unitsNeeded: 4,
    unitsFulfilled: 2,
    hospitalName: 'Massachusetts General Hospital',
    hospitalDepartment: 'Emergency Trauma Surgical Unit',
    hospitalCity: 'Boston, MA',
    hospitalAddress: '55 Fruit St, Boston, MA 02114',
    attendingPhysician: 'Dr. Gregory Sterling, MD (Trauma Lead)',
    urgency: 'Immediate (Within 2 Hours)',
    neededBy: '2026-10-15T04:30:00Z',
    createdAt: '2026-10-15T01:10:00Z',
    status: 'Active Broadcast',
    contactRepresentative: {
      relationship: 'ICU Charge Nurse / Coordinator',
      contactMasked: '+1 (617) •••-2000'
    },
    matchedDonorsCount: 8,
    respondedDonorsCount: 3,
    notes: 'Severe multi-vehicle collision with internal hemorrhage. O-negative urgently required for emergency exploratory laparotomy.',
    isEmergencySOS: true
  },
  {
    id: 'req-surg-202',
    patientName: 'Robert Vance Jr.',
    patientAge: 64,
    patientGender: 'Male',
    bloodGroup: 'A+',
    component: 'Red Blood Cells',
    unitsNeeded: 3,
    unitsFulfilled: 3,
    hospitalName: 'Brigham and Women’s Hospital',
    hospitalDepartment: 'Cardiothoracic Surgery Wing',
    hospitalCity: 'Boston, MA',
    hospitalAddress: '75 Francis St, Boston, MA 02115',
    attendingPhysician: 'Dr. Aris Thorne, MD (Chief of Cardiac Surgery)',
    urgency: 'Advance Planned (2-7 Days)',
    neededBy: '2026-10-18T07:00:00Z',
    createdAt: '2026-10-14T10:00:00Z',
    status: 'Crossmatching Scheduled',
    contactRepresentative: {
      relationship: 'Spouse (Margaret Vance)',
      contactMasked: '+1 (617) •••-9122'
    },
    matchedDonorsCount: 12,
    respondedDonorsCount: 4,
    notes: 'Scheduled Quadruple Coronary Artery Bypass Graft (CABG). Crossmatch reserve confirmed with hospital transfusion committee.',
    isEmergencySOS: false,
    isSurgeryPlanned: true,
    surgeryPlanId: 'plan-cabg-01'
  },
  {
    id: 'req-urgent-303',
    patientName: 'Liam Morales (Oncology Day Center)',
    patientAge: 8,
    patientGender: 'Male',
    bloodGroup: 'B-',
    component: 'Platelets',
    unitsNeeded: 2,
    unitsFulfilled: 1,
    hospitalName: 'Boston Children’s Hospital',
    hospitalDepartment: 'Pediatric Hematology / Oncology',
    hospitalCity: 'Boston, MA',
    hospitalAddress: '300 Longwood Ave, Boston, MA 02115',
    attendingPhysician: 'Dr. Priya Ramamurthy, MD',
    urgency: 'Critical (Within 6 Hours)',
    neededBy: '2026-10-15T09:00:00Z',
    createdAt: '2026-10-15T00:30:00Z',
    status: 'Donors Responded',
    contactRepresentative: {
      relationship: 'Parent / Authorized Guardian',
      contactMasked: '+1 (617) •••-4481'
    },
    matchedDonorsCount: 4,
    respondedDonorsCount: 2,
    notes: 'Post-chemotherapy severe thrombocytopenia with platelet count under 10k/uL. Single-donor apheresis platelets required.',
    isEmergencySOS: true
  }
];

export const INITIAL_SURGERY_PLANS: SurgeryBloodPlan[] = [
  {
    id: 'plan-cabg-01',
    patientName: 'Robert Vance Jr.',
    patientIdMasked: 'PT-8829-MR',
    scheduledDate: '2026-10-18',
    scheduledTime: '07:30 AM',
    procedureName: 'Off-Pump Quadruple Coronary Bypass (CABG)',
    surgicalSpecialty: 'Cardiothoracic',
    leadSurgeon: 'Dr. Aris Thorne, MD (FACS)',
    hospitalName: 'Brigham and Women’s Hospital',
    bloodGroup: 'A+',
    estimatedUnitsRBC: 3,
    estimatedUnitsFFP: 2,
    estimatedUnitsPlatelets: 1,
    currentMilestone: 4,
    milestones: [
      {
        step: 1,
        title: 'Surgical Plan & Blood Requisition Created',
        description: 'Estimated blood loss calculated; pre-op blood requisition issued by surgical coordinator.',
        status: 'completed',
        completedAt: '2026-10-12 09:15'
      },
      {
        step: 2,
        title: 'Voluntary Donors Matched & Consented',
        description: '3 verified A+ voluntary donors confirmed their reservation through privacy handshake.',
        status: 'completed',
        completedAt: '2026-10-13 14:20'
      },
      {
        step: 3,
        title: 'Clinical Donation & Apheresis Processing',
        description: 'Units collected at authorized regional blood hub with strict infectious disease screening.',
        status: 'completed',
        completedAt: '2026-10-14 16:45'
      },
      {
        step: 4,
        title: 'Hospital Immunohematology Crossmatch',
        description: 'Patient serum tested against donor units for major/minor anti-A antibodies and atypical screen.',
        status: 'in_progress'
      },
      {
        step: 5,
        title: 'Operating Room Blood Units Tagged & Reserved',
        description: 'Barcoded units allocated in hospital transfusion refrigerator ready for morning incision.',
        status: 'upcoming'
      }
    ],
    reservedDonorIds: ['donor-2'],
    crossmatchStatus: 'In Progress',
    assignedBloodBank: 'American Red Cross Massachusetts Blood Hub'
  },
  {
    id: 'plan-ortho-02',
    patientName: 'Grace Kensington',
    patientIdMasked: 'PT-4109-GK',
    scheduledDate: '2026-10-21',
    scheduledTime: '10:00 AM',
    procedureName: 'Revision Total Hip Arthroplasty with Bone Grafting',
    surgicalSpecialty: 'Orthopedics',
    leadSurgeon: 'Dr. Cynthia Zhao, MD',
    hospitalName: 'Massachusetts General Hospital',
    bloodGroup: 'O+',
    estimatedUnitsRBC: 2,
    estimatedUnitsFFP: 0,
    estimatedUnitsPlatelets: 0,
    currentMilestone: 2,
    milestones: [
      {
        step: 1,
        title: 'Surgical Plan & Blood Requisition Created',
        description: 'Anticipated 600-900ml surgical blood loss requiring type-and-screen backup.',
        status: 'completed',
        completedAt: '2026-10-14 11:00'
      },
      {
        step: 2,
        title: 'Voluntary Donors Matched & Consented',
        description: 'Contacting compatible O+ donors in Boston metro for designated voluntary donation backup.',
        status: 'in_progress'
      },
      {
        step: 3,
        title: 'Clinical Donation & Apheresis Processing',
        description: 'Donors arrive at partner transfusion facility for collection.',
        status: 'upcoming'
      },
      {
        step: 4,
        title: 'Hospital Immunohematology Crossmatch',
        description: 'Laboratory compatibility testing prior to surgery date.',
        status: 'upcoming'
      },
      {
        step: 5,
        title: 'Operating Room Blood Units Tagged & Reserved',
        description: 'Reserved in cold chain ready for surgery day dispatch.',
        status: 'upcoming'
      }
    ],
    reservedDonorIds: ['donor-5'],
    crossmatchStatus: 'Awaiting Samples',
    assignedBloodBank: 'Mass General Transfusion Center'
  }
];

export const INITIAL_INVENTORY: BloodInventoryItem[] = [
  {
    id: 'inv-1',
    bloodGroup: 'O-',
    component: 'Red Blood Cells',
    unitsAvailable: 6,
    reservedUnits: 4,
    criticalThreshold: 12,
    oldestUnitDays: 14,
    maxShelfLifeDays: 42,
    status: 'Critical Shortage',
    lastUpdated: '10 minutes ago',
    facilityName: 'Metro Boston Central Blood Bank'
  },
  {
    id: 'inv-2',
    bloodGroup: 'O+',
    component: 'Red Blood Cells',
    unitsAvailable: 34,
    reservedUnits: 18,
    criticalThreshold: 25,
    oldestUnitDays: 18,
    maxShelfLifeDays: 42,
    status: 'Adequate',
    lastUpdated: '25 minutes ago',
    facilityName: 'Metro Boston Central Blood Bank'
  },
  {
    id: 'inv-3',
    bloodGroup: 'A+',
    component: 'Red Blood Cells',
    unitsAvailable: 28,
    reservedUnits: 12,
    criticalThreshold: 20,
    oldestUnitDays: 16,
    maxShelfLifeDays: 42,
    status: 'Adequate',
    lastUpdated: '15 minutes ago',
    facilityName: 'Metro Boston Central Blood Bank'
  },
  {
    id: 'inv-4',
    bloodGroup: 'A-',
    component: 'Red Blood Cells',
    unitsAvailable: 8,
    reservedUnits: 5,
    criticalThreshold: 10,
    oldestUnitDays: 22,
    maxShelfLifeDays: 42,
    status: 'Moderate',
    lastUpdated: '30 minutes ago',
    facilityName: 'Metro Boston Central Blood Bank'
  },
  {
    id: 'inv-5',
    bloodGroup: 'B+',
    component: 'Red Blood Cells',
    unitsAvailable: 15,
    reservedUnits: 6,
    criticalThreshold: 12,
    oldestUnitDays: 19,
    maxShelfLifeDays: 42,
    status: 'Adequate',
    lastUpdated: '1 hour ago',
    facilityName: 'Metro Boston Central Blood Bank'
  },
  {
    id: 'inv-6',
    bloodGroup: 'B-',
    component: 'Red Blood Cells',
    unitsAvailable: 4,
    reservedUnits: 3,
    criticalThreshold: 8,
    oldestUnitDays: 9,
    maxShelfLifeDays: 42,
    status: 'Critical Shortage',
    lastUpdated: '40 minutes ago',
    facilityName: 'Metro Boston Central Blood Bank'
  },
  {
    id: 'inv-7',
    bloodGroup: 'AB+',
    component: 'Fresh Frozen Plasma',
    unitsAvailable: 42,
    reservedUnits: 10,
    criticalThreshold: 15,
    oldestUnitDays: 120,
    maxShelfLifeDays: 365,
    status: 'Adequate',
    lastUpdated: '2 hours ago',
    facilityName: 'Metro Boston Central Blood Bank'
  },
  {
    id: 'inv-8',
    bloodGroup: 'O+',
    component: 'Platelets',
    unitsAvailable: 5,
    reservedUnits: 3,
    criticalThreshold: 8,
    oldestUnitDays: 4,
    maxShelfLifeDays: 5,
    status: 'Expiring Soon',
    lastUpdated: '12 minutes ago',
    facilityName: 'Metro Boston Central Blood Bank'
  }
];

export const DONOR_BADGES: DonorBadge[] = [
  {
    id: 'badge-1',
    name: 'First Drop Honor',
    description: 'Completed your verified maiden blood donation and saved up to 3 lives.',
    icon: 'Droplet',
    unlocked: true,
    unlockedDate: '2024-03-12',
    category: 'milestones',
    color: '#E11D48'
  },
  {
    id: 'badge-2',
    name: 'Silver Lifeline',
    description: 'Achieved 5 lifetime donations. You are a steady pillar of emergency preparedness.',
    icon: 'Award',
    unlocked: true,
    unlockedDate: '2025-06-20',
    category: 'milestones',
    color: '#94A3B8'
  },
  {
    id: 'badge-3',
    name: 'Golden Vanguard',
    description: 'Surpassed 10 donations! Direct lifeline contributor to pediatric and surgical wards.',
    icon: 'ShieldCheck',
    unlocked: true,
    unlockedDate: '2026-02-14',
    category: 'milestones',
    color: '#D4A72C'
  },
  {
    id: 'badge-4',
    name: 'Emergency Rapid Responder',
    description: 'Responded to an SOS trauma call within 45 minutes of notification broadcast.',
    icon: 'Flame',
    unlocked: true,
    unlockedDate: '2026-05-18',
    category: 'emergency',
    color: '#BE123C'
  },
  {
    id: 'badge-5',
    name: 'Century Lifesaver Star',
    description: 'Credited with saving or sustaining over 40 surgical and emergency patients.',
    icon: 'Sparkles',
    unlocked: true,
    unlockedDate: '2026-07-10',
    category: 'special',
    color: '#14213D'
  },
  {
    id: 'badge-6',
    name: 'Universal Shield (O-)',
    description: 'Recognized for contributing rare universal red cells to neonatal and trauma ICUs.',
    icon: 'HeartHandshake',
    unlocked: false,
    category: 'special',
    color: '#0284C7'
  }
];

export const APPRECIATION_PERKS: AppreciationPerk[] = [
  {
    id: 'perk-1',
    title: 'Comprehensive CBC & Iron Screening Panel',
    partner: 'Boston Clinical Laboratories',
    category: 'Wellness & Health',
    description: 'Free complimentary annual complete blood count, ferritin, and lipid profile for active donors.',
    code: 'BLOODLINK-CBC-WELLNESS',
    validUntil: '2026-12-31',
    badgeRequired: 'First Drop Honor'
  },
  {
    id: 'perk-2',
    title: 'Hydration & Post-Donation Nutritional Care Pack',
    partner: 'Revitalize Organics & Electrolytes',
    category: 'Nutrition',
    description: 'A complimentary box of organic iron-fortified botanical supplements and hydration salts.',
    code: 'RECOVER-STRONG-2026',
    validUntil: '2026-11-30',
    badgeRequired: 'Silver Lifeline'
  },
  {
    id: 'perk-3',
    title: 'Express Health Pass & Fast-Track Check-in',
    partner: 'Metro Regional Health Network',
    category: 'Community',
    description: 'VIP priority reception pass at 18 participating hospital outpatient screening centers.',
    code: 'HEALTH-VIP-LINK',
    validUntil: '2027-01-15',
    badgeRequired: 'Golden Vanguard'
  }
];
