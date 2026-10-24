export interface FamilyMemberMock {
  id: string;
  publicId: string;
  name: string;
  relationship: string;
  roleInHousehold: string;
  age: number;
  dob: string;
  gender: "Male" | "Female" | "Other";
  verificationStatus: "Verified" | "Under Review" | "Pending";
  mobileNumber?: string;
  aadhaarNumber?: string;
  documentsCount: number;
  benefitsCount: number;
  openIssuesCount: number;
  issueDetails?: string | null;
  declaredIncome?: string;
  lastVerifiedDate?: string;
  avatarInitials: string;
  parentId?: string | null;
  spouseId?: string | null;
}

export interface ApplicationMock {
  id: string;
  scheme: string;
  submittedDate: string;
  status: "Under Verification" | "Approved" | "In Progress";
  lastUpdated: string;
  applicant: string;
  department: string;
  details: string;
  timeline: Array<{ stage: string; date: string; status: "completed" | "current" | "upcoming" }>;
}

export interface BenefitMock {
  id: string;
  schemeName: string;
  beneficiary: string;
  status: "ACTIVE" | "PENDING";
  startDate: string;
  category: string;
  entitlementAmount: string;
  frequency: string;
}

export interface DocumentMock {
  id: string;
  name: string;
  owner: string;
  verificationStatus: "Verified" | "Under Review" | "Pending";
  lastVerified: string;
  issuingAuthority: string;
  documentNumber: string;
  type: string;
}

export interface TimelineEventMock {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  source: string;
  verifiedBy: string;
  status: "Verified" | "Awaiting Review" | "System Recorded";
  category: "civil" | "verification" | "application" | "benefit";
}

export interface AttentionItemMock {
  id: string;
  title: string;
  count: string;
  actionText: string;
  actionType: "member_review" | "event_review" | "address_correction";
  severity: "amber" | "blue" | "red";
  description: string;
}

export interface HouseholdOverviewMock {
  householdPublicId: string;
  familyName: string;
  verificationStatus: "VERIFIED" | "PENDING";
  householdStatus: "ACTIVE" | "INACTIVE";
  stats: {
    headOfHousehold: string;
    totalMembers: number;
    verifiedMembers: number;
    pendingReview: number;
    openIssues: number;
  };
  bplCategory: string;
  incomeTier: string;
  propertyType: string;
  propertyVerificationSubtext: string;
  currentResidence: string;
}

export const householdOverviewMock: HouseholdOverviewMock = {
  householdPublicId: "MIRA-FAM-10482",
  familyName: "Sharma Family",
  verificationStatus: "VERIFIED",
  householdStatus: "ACTIVE",
  stats: {
    headOfHousehold: "Rajesh Sharma",
    totalMembers: 20,
    verifiedMembers: 17,
    pendingReview: 2,
    openIssues: 1,
  },
  bplCategory: "BPL (Priority Household)",
  incomeTier: "Below ₹1,50,000 / year",
  propertyType: "Pucca residential dwelling (HOUSE)",
  propertyVerificationSubtext: "Verified in municipal records",
  currentResidence:
    "House No. 42, Ward 7, Demo District, Demo District, Uttar Pradesh — 201001",
};

export const attentionItemsMock: AttentionItemMock[] = [
  {
    id: "att-1",
    title: "Pending Member Verification",
    count: "2 members",
    actionText: "Review →",
    actionType: "member_review",
    severity: "amber",
    description: "Pooja Sharma & Rohan Sharma need municipal/attestation completion.",
  },
  {
    id: "att-2",
    title: "Life Event Awaiting Confirmation",
    count: "1 life event",
    actionText: "Review →",
    actionType: "event_review",
    severity: "amber",
    description: "New birth registration event pending field verification signal.",
  },
  {
    id: "att-3",
    title: "Address Correction",
    count: "1 correction request",
    actionText: "View case →",
    actionType: "address_correction",
    severity: "blue",
    description: "Ward re-demarcation mismatch correction under municipal review.",
  },
];

// All 20 Members of Sharma Household
export const allMembersMock: FamilyMemberMock[] = [
  {
    id: "mem-01",
    publicId: "MIRA-MEM-0001",
    name: "Rajesh Sharma",
    relationship: "Household Head",
    roleInHousehold: "Head",
    age: 52,
    dob: "12 Jan 1974",
    gender: "Male",
    verificationStatus: "Verified",
    mobileNumber: "+91 98765 43210",
    aadhaarNumber: "XXXX-XXXX-1234",
    documentsCount: 4,
    benefitsCount: 1,
    openIssuesCount: 0,
    declaredIncome: "₹1,20,000 / year",
    lastVerifiedDate: "18 Oct 2026",
    avatarInitials: "RS",
  },
  {
    id: "mem-02",
    publicId: "MIRA-MEM-0002",
    name: "Sunita Sharma",
    relationship: "Spouse",
    roleInHousehold: "Spouse",
    age: 48,
    dob: "05 Aug 1978",
    gender: "Female",
    verificationStatus: "Verified",
    mobileNumber: "+91 98765 43211",
    aadhaarNumber: "XXXX-XXXX-4567",
    documentsCount: 3,
    benefitsCount: 1,
    openIssuesCount: 0,
    declaredIncome: "Homemaker",
    lastVerifiedDate: "18 Oct 2026",
    avatarInitials: "SS",
    spouseId: "mem-01",
  },
  {
    id: "mem-03",
    publicId: "MIRA-MEM-0003",
    name: "Amit Sharma",
    relationship: "Son",
    roleInHousehold: "Son",
    age: 28,
    dob: "14 Mar 1998",
    gender: "Male",
    verificationStatus: "Verified",
    mobileNumber: "+91 98765 43212",
    aadhaarNumber: "XXXX-XXXX-7890",
    documentsCount: 2,
    benefitsCount: 1,
    openIssuesCount: 0,
    declaredIncome: "₹85,000 / year",
    lastVerifiedDate: "12 Oct 2026",
    avatarInitials: "AS",
    parentId: "mem-01",
  },
  {
    id: "mem-04",
    publicId: "MIRA-MEM-0004",
    name: "Pooja Sharma",
    relationship: "Daughter-in-law",
    roleInHousehold: "Daughter-in-law",
    age: 26,
    dob: "22 Nov 2000",
    gender: "Female",
    verificationStatus: "Under Review",
    mobileNumber: "+91 98765 43213",
    aadhaarNumber: "XXXX-XXXX-2345",
    documentsCount: 1,
    benefitsCount: 0,
    openIssuesCount: 1,
    issueDetails: "Awaiting Marriage Certificate Attestation by local sub-registrar.",
    declaredIncome: "Dependent",
    lastVerifiedDate: "21 Oct 2026",
    avatarInitials: "PS",
    spouseId: "mem-03",
  },
  {
    id: "mem-05",
    publicId: "MIRA-MEM-0005",
    name: "Ananya Sharma",
    relationship: "Daughter",
    roleInHousehold: "Granddaughter (Daughter of Amit)",
    age: 5,
    dob: "18 Jun 2021",
    gender: "Female",
    verificationStatus: "Verified",
    aadhaarNumber: "XXXX-XXXX-3456",
    documentsCount: 1,
    benefitsCount: 1,
    openIssuesCount: 0,
    declaredIncome: "Minor Dependent",
    lastVerifiedDate: "11 Oct 2026",
    avatarInitials: "AS",
    parentId: "mem-03",
  },
  {
    id: "mem-06",
    publicId: "MIRA-MEM-0006",
    name: "Rohan Sharma",
    relationship: "Son",
    roleInHousehold: "Grandson (Son of Amit)",
    age: 2,
    dob: "04 May 2024",
    gender: "Male",
    verificationStatus: "Pending",
    documentsCount: 1,
    benefitsCount: 0,
    openIssuesCount: 0,
    declaredIncome: "Infant Dependent",
    lastVerifiedDate: "Awaiting Verification",
    avatarInitials: "RS",
    parentId: "mem-03",
  },
  {
    id: "mem-07",
    publicId: "MIRA-MEM-0007",
    name: "Ramprasad Sharma",
    relationship: "Father",
    roleInHousehold: "Elder / Patriarch",
    age: 76,
    dob: "10 Feb 1950",
    gender: "Male",
    verificationStatus: "Verified",
    mobileNumber: "+91 98765 43214",
    aadhaarNumber: "XXXX-XXXX-9012",
    documentsCount: 2,
    benefitsCount: 1,
    openIssuesCount: 0,
    declaredIncome: "Old Age Pension",
    lastVerifiedDate: "10 Jul 2026",
    avatarInitials: "RS",
  },
  {
    id: "mem-08",
    publicId: "MIRA-MEM-0008",
    name: "Kaushalya Sharma",
    relationship: "Mother",
    roleInHousehold: "Elder / Matriarch",
    age: 72,
    dob: "25 Sep 1954",
    gender: "Female",
    verificationStatus: "Verified",
    aadhaarNumber: "XXXX-XXXX-8901",
    documentsCount: 2,
    benefitsCount: 1,
    openIssuesCount: 0,
    declaredIncome: "Elder Dependent",
    lastVerifiedDate: "10 Jul 2026",
    avatarInitials: "KS",
    spouseId: "mem-07",
  },
  {
    id: "mem-09",
    publicId: "MIRA-MEM-0009",
    name: "Vikas Sharma",
    relationship: "Son",
    roleInHousehold: "Son",
    age: 24,
    dob: "19 Dec 2001",
    gender: "Male",
    verificationStatus: "Verified",
    mobileNumber: "+91 98765 43215",
    aadhaarNumber: "XXXX-XXXX-6789",
    documentsCount: 2,
    benefitsCount: 0,
    openIssuesCount: 0,
    declaredIncome: "Apprentice / Student",
    lastVerifiedDate: "14 Jul 2026",
    avatarInitials: "VS",
    parentId: "mem-01",
  },
  {
    id: "mem-10",
    publicId: "MIRA-MEM-0010",
    name: "Neha Sharma",
    relationship: "Daughter",
    roleInHousehold: "Daughter",
    age: 22,
    dob: "08 Sep 2004",
    gender: "Female",
    verificationStatus: "Verified",
    mobileNumber: "+91 98765 43216",
    aadhaarNumber: "XXXX-XXXX-5678",
    documentsCount: 2,
    benefitsCount: 1,
    openIssuesCount: 0,
    declaredIncome: "Student",
    lastVerifiedDate: "14 Jul 2026",
    avatarInitials: "NS",
    parentId: "mem-01",
  },
  {
    id: "mem-11",
    publicId: "MIRA-MEM-0011",
    name: "Priya Sharma",
    relationship: "Daughter-in-law",
    roleInHousehold: "Daughter-in-law",
    age: 23,
    dob: "11 Nov 2002",
    gender: "Female",
    verificationStatus: "Under Review",
    mobileNumber: "+91 98765 43217",
    aadhaarNumber: "XXXX-XXXX-4321",
    documentsCount: 1,
    benefitsCount: 0,
    openIssuesCount: 0,
    declaredIncome: "Dependent",
    lastVerifiedDate: "15 Oct 2026",
    avatarInitials: "PS",
  },
  {
    id: "mem-12",
    publicId: "MIRA-MEM-0012",
    name: "Suresh Sharma",
    relationship: "Brother",
    roleInHousehold: "Brother of Head",
    age: 46,
    dob: "17 Apr 1980",
    gender: "Male",
    verificationStatus: "Verified",
    mobileNumber: "+91 98765 43218",
    aadhaarNumber: "XXXX-XXXX-3210",
    documentsCount: 2,
    benefitsCount: 0,
    openIssuesCount: 0,
    declaredIncome: "₹90,000 / year",
    lastVerifiedDate: "10 Jul 2026",
    avatarInitials: "SS",
  },
  {
    id: "mem-13",
    publicId: "MIRA-MEM-0013",
    name: "Geeta Sharma",
    relationship: "Sister-in-law",
    roleInHousehold: "Sister-in-law",
    age: 44,
    dob: "30 Jan 1982",
    gender: "Female",
    verificationStatus: "Verified",
    mobileNumber: "+91 98765 43219",
    aadhaarNumber: "XXXX-XXXX-2109",
    documentsCount: 2,
    benefitsCount: 0,
    openIssuesCount: 0,
    declaredIncome: "Homemaker",
    lastVerifiedDate: "10 Jul 2026",
    avatarInitials: "GS",
    spouseId: "mem-12",
  },
  {
    id: "mem-14",
    publicId: "MIRA-MEM-0014",
    name: "Manoj Sharma",
    relationship: "Nephew",
    roleInHousehold: "Nephew",
    age: 19,
    dob: "03 Oct 2006",
    gender: "Male",
    verificationStatus: "Verified",
    aadhaarNumber: "XXXX-XXXX-1098",
    documentsCount: 1,
    benefitsCount: 0,
    openIssuesCount: 0,
    declaredIncome: "Student",
    lastVerifiedDate: "10 Jul 2026",
    avatarInitials: "MS",
    parentId: "mem-12",
  },
  {
    id: "mem-15",
    publicId: "MIRA-MEM-0015",
    name: "Kavita Sharma",
    relationship: "Niece",
    roleInHousehold: "Niece",
    age: 17,
    dob: "15 Aug 2009",
    gender: "Female",
    verificationStatus: "Verified",
    aadhaarNumber: "XXXX-XXXX-0987",
    documentsCount: 1,
    benefitsCount: 0,
    openIssuesCount: 0,
    declaredIncome: "Student",
    lastVerifiedDate: "10 Jul 2026",
    avatarInitials: "KS",
    parentId: "mem-12",
  },
  {
    id: "mem-16",
    publicId: "MIRA-MEM-0016",
    name: "Deepak Sharma",
    relationship: "Nephew",
    roleInHousehold: "Nephew",
    age: 14,
    dob: "21 Mar 2012",
    gender: "Male",
    verificationStatus: "Verified",
    aadhaarNumber: "XXXX-XXXX-9876",
    documentsCount: 1,
    benefitsCount: 0,
    openIssuesCount: 0,
    declaredIncome: "Minor Student",
    lastVerifiedDate: "10 Jul 2026",
    avatarInitials: "DS",
    parentId: "mem-12",
  },
  {
    id: "mem-17",
    publicId: "MIRA-MEM-0017",
    name: "Suman Sharma",
    relationship: "Sister",
    roleInHousehold: "Sister of Head",
    age: 41,
    dob: "12 May 1985",
    gender: "Female",
    verificationStatus: "Verified",
    mobileNumber: "+91 98765 43220",
    aadhaarNumber: "XXXX-XXXX-8765",
    documentsCount: 2,
    benefitsCount: 0,
    openIssuesCount: 0,
    declaredIncome: "Dependent",
    lastVerifiedDate: "10 Jul 2026",
    avatarInitials: "SS",
  },
  {
    id: "mem-18",
    publicId: "MIRA-MEM-0018",
    name: "Aarti Sharma",
    relationship: "Granddaughter",
    roleInHousehold: "Granddaughter",
    age: 7,
    dob: "14 Jul 2019",
    gender: "Female",
    verificationStatus: "Verified",
    aadhaarNumber: "XXXX-XXXX-7654",
    documentsCount: 1,
    benefitsCount: 0,
    openIssuesCount: 0,
    declaredIncome: "Minor Dependent",
    lastVerifiedDate: "10 Jul 2026",
    avatarInitials: "AS",
  },
  {
    id: "mem-19",
    publicId: "MIRA-MEM-0019",
    name: "Aditya Sharma",
    relationship: "Grandson",
    roleInHousehold: "Grandson",
    age: 4,
    dob: "02 Feb 2022",
    gender: "Male",
    verificationStatus: "Verified",
    aadhaarNumber: "XXXX-XXXX-6543",
    documentsCount: 1,
    benefitsCount: 0,
    openIssuesCount: 0,
    declaredIncome: "Minor Dependent",
    lastVerifiedDate: "10 Jul 2026",
    avatarInitials: "AS",
  },
  {
    id: "mem-20",
    publicId: "MIRA-MEM-0020",
    name: "Baby Sharma",
    relationship: "Infant",
    roleInHousehold: "Great-Grandchild / Infant",
    age: 1,
    dob: "20 May 2025",
    gender: "Male",
    verificationStatus: "Pending",
    documentsCount: 1,
    benefitsCount: 0,
    openIssuesCount: 1,
    issueDetails: "Civil birth registration certificate awaiting biometric parent linkage.",
    declaredIncome: "Infant",
    lastVerifiedDate: "Awaiting Verification",
    avatarInitials: "BS",
  },
];

// Related Applications (3)
export const applicationsMock: ApplicationMock[] = [
  {
    id: "APP-2026-000318",
    scheme: "Housing Support Scheme",
    submittedDate: "23 Oct 2026",
    status: "Under Verification",
    lastUpdated: "24 Oct 2026",
    applicant: "Rajesh Sharma",
    department: "Department of Rural Development & Housing",
    details:
      "Capital grant subsidy for residential dwelling refurbishment and solar roof electrification. Field inspector site survey scheduled.",
    timeline: [
      { stage: "Application Submitted", date: "23 Oct 2026", status: "completed" },
      { stage: "Municipal & Property Geo-tag Match", date: "23 Oct 2026", status: "completed" },
      { stage: "Field Officer Inspection", date: "24 Oct 2026", status: "current" },
      { stage: "Sanction Order Issuance", date: "Pending", status: "upcoming" },
    ],
  },
  {
    id: "APP-2026-000276",
    scheme: "Ujjwala Yojana",
    submittedDate: "12 Oct 2026",
    status: "Approved",
    lastUpdated: "16 Oct 2026",
    applicant: "Sunita Sharma",
    department: "Ministry of Petroleum & Natural Gas",
    details:
      "Clean household cooking gas connection and subsidized refill entitlement. Sanctioned and dispatched via local distribution agency.",
    timeline: [
      { stage: "Application Submitted", date: "12 Oct 2026", status: "completed" },
      { stage: "BPL & NFSA Cross-Validation", date: "14 Oct 2026", status: "completed" },
      { stage: "Approval & Connection Sanction", date: "16 Oct 2026", status: "completed" },
      { stage: "Kit Dispatched to Consumer", date: "18 Oct 2026", status: "completed" },
    ],
  },
  {
    id: "APP-2026-000254",
    scheme: "Ration Card Update",
    submittedDate: "05 Oct 2026",
    status: "In Progress",
    lastUpdated: "18 Oct 2026",
    applicant: "Rajesh Sharma",
    department: "Department of Food, Civil Supplies & Consumer Affairs",
    details:
      "Endorsement of infant family members (Rohan Sharma & Baby Sharma) onto active Antyodaya / Priority NFSA quota sheet.",
    timeline: [
      { stage: "Modification Requested", date: "05 Oct 2026", status: "completed" },
      { stage: "UIDAI Aadhaar Verification", date: "10 Oct 2026", status: "completed" },
      { stage: "District Supply Officer Approval", date: "18 Oct 2026", status: "current" },
      { stage: "Updated Electronic Ration Slip", date: "Pending", status: "upcoming" },
    ],
  },
];

// Recent Life Events Timeline (12 items)
export const timelineEventsMock: TimelineEventMock[] = [
  {
    id: "evt-01",
    date: "23 Oct 2026",
    title: "Address verification completed",
    subtitle: "Municipal records matched",
    source: "System",
    verifiedBy: "Nagar Palika Automated Registry",
    status: "Verified",
    category: "verification",
  },
  {
    id: "evt-02",
    date: "18 Oct 2026",
    title: "Income verification updated",
    subtitle: "Annual household income verified",
    source: "Verification Officer",
    verifiedBy: "Tahsildar Revenue Office (Grade II)",
    status: "Verified",
    category: "verification",
  },
  {
    id: "evt-03",
    date: "11 Oct 2026",
    title: "Family member added",
    subtitle: "Ananya Sharma added as daughter",
    source: "Citizen",
    verifiedBy: "Civil Registrar of Births",
    status: "Verified",
    category: "civil",
  },
  {
    id: "evt-04",
    date: "02 Oct 2026",
    title: "Application submitted",
    subtitle: "APP-2026-000318 — Housing Support Scheme",
    source: "System",
    verifiedBy: "State Welfare Portal Engine",
    status: "System Recorded",
    category: "application",
  },
  {
    id: "evt-05",
    date: "15 Sep 2026",
    title: "Ration card unit addition requested",
    subtitle: "Rohan Sharma submitted for NFSA inclusion",
    source: "Citizen",
    verifiedBy: "Food Inspector Office",
    status: "Awaiting Review",
    category: "civil",
  },
  {
    id: "evt-06",
    date: "28 Aug 2026",
    title: "Biometric e-KYC re-attested",
    subtitle: "Aadhaar authentication refreshed for household head",
    source: "CSC Center",
    verifiedBy: "UIDAI Auth Gateway",
    status: "Verified",
    category: "verification",
  },
  {
    id: "evt-07",
    date: "14 Jul 2026",
    title: "Annual municipal survey matched",
    subtitle: "Dwelling assessment verified by Municipal Corporation",
    source: "Field Inspector",
    verifiedBy: "Municipal Ward Officer 7",
    status: "Verified",
    category: "verification",
  },
  {
    id: "evt-08",
    date: "02 Jun 2026",
    title: "Marriage registered in civil registry",
    subtitle: "Amit Sharma & Pooja Sharma wedding attested",
    source: "Civil Registrar",
    verifiedBy: "Special Marriage Officer",
    status: "Verified",
    category: "civil",
  },
  {
    id: "evt-09",
    date: "19 Apr 2026",
    title: "PM-Kisan beneficiary account verified",
    subtitle: "NPCI Aadhaar-seeded bank account validated",
    source: "PFMS Gateway",
    verifiedBy: "National Payments Corporation",
    status: "Verified",
    category: "benefit",
  },
  {
    id: "evt-10",
    date: "10 Feb 2026",
    title: "Electricity meter ID cross-referenced",
    subtitle: "UPPCL consumer connection mapped to dwelling unit",
    source: "System",
    verifiedBy: "DISCOM Automated Sync",
    status: "Verified",
    category: "verification",
  },
  {
    id: "evt-11",
    date: "18 Nov 2025",
    title: "Ayushman card issued",
    subtitle: "Health coverage cards generated for 5 family members",
    source: "Health Agency",
    verifiedBy: "State Health Authority UP",
    status: "Verified",
    category: "benefit",
  },
  {
    id: "evt-12",
    date: "05 Sep 2025",
    title: "Initial Family360 record constituted",
    subtitle: "Civil registration baseline established",
    source: "System",
    verifiedBy: "District Magistrate Operations",
    status: "Verified",
    category: "civil",
  },
];

// Benefits (4 items)
export const benefitsMock: BenefitMock[] = [
  {
    id: "ben-01",
    schemeName: "Ujjwala Yojana",
    beneficiary: "Rajesh Sharma",
    status: "ACTIVE",
    startDate: "16 Oct 2026",
    category: "LPG Clean Cooking Subsidy",
    entitlementAmount: "₹300 / refill",
    frequency: "Monthly Subsidized Quota",
  },
  {
    id: "ben-02",
    schemeName: "National Food Security Scheme (NFSA)",
    beneficiary: "Rajesh Sharma (Household Head)",
    status: "ACTIVE",
    startDate: "01 Jan 2021",
    category: "Subsidized Food Grains",
    entitlementAmount: "35 kg / month",
    frequency: "Monthly",
  },
  {
    id: "ben-03",
    schemeName: "Ayushman Bharat PM-JAY",
    beneficiary: "Sharma Family (All Members)",
    status: "ACTIVE",
    startDate: "18 Nov 2025",
    category: "Secondary & Tertiary Healthcare",
    entitlementAmount: "Up to ₹5,00,000 / year",
    frequency: "Annual Family Floater",
  },
  {
    id: "ben-04",
    schemeName: "PM Kisan Samman Nidhi",
    beneficiary: "Rajesh Sharma",
    status: "PENDING",
    startDate: "Under Re-validation",
    category: "Direct Income Support",
    entitlementAmount: "₹6,000 / year",
    frequency: "3 Equal Installments",
  },
];

// Documents (18 items)
export const documentsMock: DocumentMock[] = [
  {
    id: "doc-01",
    name: "Aadhaar Card",
    owner: "Rajesh Sharma",
    verificationStatus: "Verified",
    lastVerified: "18 Oct 2026",
    issuingAuthority: "UIDAI Vault",
    documentNumber: "XXXX-XXXX-1234",
    type: "Identity Proof",
  },
  {
    id: "doc-02",
    name: "Aadhaar Card",
    owner: "Sunita Sharma",
    verificationStatus: "Verified",
    lastVerified: "18 Oct 2026",
    issuingAuthority: "UIDAI Vault",
    documentNumber: "XXXX-XXXX-4567",
    type: "Identity Proof",
  },
  {
    id: "doc-03",
    name: "Aadhaar Card",
    owner: "Amit Sharma",
    verificationStatus: "Verified",
    lastVerified: "12 Oct 2026",
    issuingAuthority: "UIDAI Vault",
    documentNumber: "XXXX-XXXX-7890",
    type: "Identity Proof",
  },
  {
    id: "doc-04",
    name: "Aadhaar Card",
    owner: "Pooja Sharma",
    verificationStatus: "Under Review",
    lastVerified: "21 Oct 2026",
    issuingAuthority: "UIDAI Vault (e-KYC Pending)",
    documentNumber: "XXXX-XXXX-2345",
    type: "Identity Proof",
  },
  {
    id: "doc-05",
    name: "Aadhaar Card",
    owner: "Ramprasad Sharma",
    verificationStatus: "Verified",
    lastVerified: "10 Jul 2026",
    issuingAuthority: "UIDAI Vault",
    documentNumber: "XXXX-XXXX-9012",
    type: "Identity Proof",
  },
  {
    id: "doc-06",
    name: "Aadhaar Card",
    owner: "Kaushalya Sharma",
    verificationStatus: "Verified",
    lastVerified: "10 Jul 2026",
    issuingAuthority: "UIDAI Vault",
    documentNumber: "XXXX-XXXX-8901",
    type: "Identity Proof",
  },
  {
    id: "doc-07",
    name: "Birth Certificate",
    owner: "Ananya Sharma",
    verificationStatus: "Verified",
    lastVerified: "11 Oct 2026",
    issuingAuthority: "Nagar Nigam Civil Registrar",
    documentNumber: "BC-2021-99824",
    type: "Civil Registry",
  },
  {
    id: "doc-08",
    name: "Birth Certificate Memo",
    owner: "Rohan Sharma",
    verificationStatus: "Pending",
    lastVerified: "05 Oct 2026",
    issuingAuthority: "District Women's Hospital",
    documentNumber: "HOSP-MED-4410",
    type: "Civil Registry",
  },
  {
    id: "doc-09",
    name: "Address Proof (Electricity Bill)",
    owner: "Rajesh Sharma",
    verificationStatus: "Verified",
    lastVerified: "23 Oct 2026",
    issuingAuthority: "UP Power Corporation (UPPCL)",
    documentNumber: "CA-1009845112",
    type: "Residence Proof",
  },
  {
    id: "doc-10",
    name: "Annual Income Certificate",
    owner: "Rajesh Sharma",
    verificationStatus: "Verified",
    lastVerified: "18 Oct 2026",
    issuingAuthority: "Revenue Department Tahsildar",
    documentNumber: "INC-2026-78411",
    type: "Income Attestation",
  },
  {
    id: "doc-11",
    name: "Property Ownership Deed / Khatauni",
    owner: "Rajesh Sharma",
    verificationStatus: "Verified",
    lastVerified: "15 Oct 2026",
    issuingAuthority: "Bhulekh Land Records UP",
    documentNumber: "KH-42-W7-2024",
    type: "Property Record",
  },
  {
    id: "doc-12",
    name: "NFSA Ration Card",
    owner: "Sharma Family",
    verificationStatus: "Verified",
    lastVerified: "01 Oct 2026",
    issuingAuthority: "Department of Food & Civil Supplies",
    documentNumber: "RC-UP-0910482",
    type: "Entitlement Card",
  },
  {
    id: "doc-13",
    name: "Marriage Certificate",
    owner: "Amit & Pooja Sharma",
    verificationStatus: "Under Review",
    lastVerified: "14 Oct 2026",
    issuingAuthority: "Special Marriage Registrar",
    documentNumber: "MR-2026-1189",
    type: "Civil Registry",
  },
  {
    id: "doc-14",
    name: "Caste Certificate (OBC Category)",
    owner: "Rajesh Sharma",
    verificationStatus: "Verified",
    lastVerified: "12 Jan 2025",
    issuingAuthority: "District Magistrate Sub-division",
    documentNumber: "CC-2025-00412",
    type: "Category Certificate",
  },
  {
    id: "doc-15",
    name: "Bank Passbook & Mandate",
    owner: "Rajesh Sharma",
    verificationStatus: "Verified",
    lastVerified: "19 Apr 2026",
    issuingAuthority: "State Bank of India (PFMS Seeded)",
    documentNumber: "SB-30911849102",
    type: "Financial Proof",
  },
  {
    id: "doc-16",
    name: "Municipal House Tax Receipt",
    owner: "Rajesh Sharma",
    verificationStatus: "Verified",
    lastVerified: "20 Jul 2026",
    issuingAuthority: "Nagar Palika Parishad",
    documentNumber: "HT-2026-9931",
    type: "Municipal Record",
  },
  {
    id: "doc-17",
    name: "LPG Subscription Voucher",
    owner: "Sunita Sharma",
    verificationStatus: "Verified",
    lastVerified: "16 Oct 2026",
    issuingAuthority: "Indian Oil Indane Agency",
    documentNumber: "LPG-IND-77821",
    type: "Benefit Record",
  },
  {
    id: "doc-18",
    name: "Disability Certificate (Nil/Exemption)",
    owner: "Rajesh Sharma",
    verificationStatus: "Verified",
    lastVerified: "05 Aug 2025",
    issuingAuthority: "Chief Medical Officer (CMO)",
    documentNumber: "DIS-EX-1049",
    type: "Medical Record",
  },
];
