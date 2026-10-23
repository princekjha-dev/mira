// Demo data for the prototype. All names, IDs and records are fictional.
import housingImg from "@/assets/s-housing.jpg";
import agriImg from "@/assets/s-agri.jpg";
import healthImg from "@/assets/s-health.jpg";
import eduImg from "@/assets/s-edu.jpg";

export const CATEGORIES = [
  "Housing",
  "Education",
  "Healthcare",
  "Agriculture",
  "Pension",
  "Women & Child",
  "Employment",
  "Rural Development",
  "Social Welfare",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_IMAGE: Record<Category, string> = {
  Housing: housingImg,
  Education: eduImg,
  Healthcare: healthImg,
  Agriculture: agriImg,
  Pension: healthImg,
  "Women & Child": healthImg,
  Employment: agriImg,
  "Rural Development": housingImg,
  "Social Welfare": eduImg,
};

export const STATES = [
  "All States",
  "Uttar Pradesh",
  "Bihar",
  "Maharashtra",
  "West Bengal",
  "Tamil Nadu",
  "Gujarat",
  "Punjab",
  "Telangana",
];

export type Level = "Individual" | "Household";
export interface Scheme {
  id: string;
  name: string;
  department: string;
  level: Level;
  category: Category;
  description: string;
  eligibility: string[];
  documents: string[];
  incomeMax?: number;
  bplRequired?: boolean;
  ageMin?: number;
  ageMax?: number;
  gender?: "Female";
  property?: "no-pucca-house" | "land-under-2ha";
  states: string[];
  householdExclusive?: boolean;
  questions: string[];
  basis: ("Individual" | "Household" | "Property")[];
}

export const SCHEMES: Scheme[] = [
  {
    id: "rural-housing",
    name: "Rural Housing Assistance Scheme",
    department: "Department of Rural Development",
    level: "Household",
    category: "Housing",
    description:
      "Assistance for construction of a pucca house for eligible rural households without adequate housing.",
    eligibility: [
      "Household annual income up to ₹3,00,000",
      "BPL household",
      "No pucca house owned by any household member",
      "No housing benefit previously received by the household",
    ],
    documents: [
      "Aadhaar",
      "Income Certificate",
      "BPL Certificate",
      "Residence Certificate",
      "Property / Land Document",
    ],
    incomeMax: 300000,
    bplRequired: true,
    property: "no-pucca-house",
    states: ["All States"],
    householdExclusive: true,
    questions: [
      "Current type of dwelling",
      "Plot ownership status",
      "Have you received land under any government allotment?",
    ],
    basis: ["Household", "Property"],
  },
  {
    id: "post-matric",
    name: "Post-Matric Scholarship",
    department: "Department of Social Justice & Empowerment",
    level: "Individual",
    category: "Education",
    description:
      "Support for students studying at post-matriculation level towards tuition and maintenance.",
    eligibility: [
      "Student aged 15–30",
      "Household annual income up to ₹2,50,000",
      "Enrolled in a recognised institution",
    ],
    documents: [
      "Aadhaar",
      "Income Certificate",
      "Residence Certificate",
      "Bonafide / Enrollment Certificate",
    ],
    incomeMax: 250000,
    ageMin: 15,
    ageMax: 30,
    states: ["All States"],
    questions: [
      "Institution name",
      "Course and year of study",
      "Previous year marks (%)",
    ],
    basis: ["Individual"],
  },
  {
    id: "health-cover",
    name: "Family Health Insurance Cover",
    department: "Department of Health & Family Welfare",
    level: "Household",
    category: "Healthcare",
    description:
      "Cashless hospital treatment cover for eligible households at empanelled hospitals.",
    eligibility: [
      "BPL household",
      "Household listed in state beneficiary registry",
    ],
    documents: ["Aadhaar", "BPL Certificate", "Residence Certificate"],
    bplRequired: true,
    states: ["All States"],
    householdExclusive: true,
    questions: [
      "Any member with chronic illness?",
      "Preferred empanelled hospital district",
    ],
    basis: ["Household"],
  },
  {
    id: "farmer-support",
    name: "Small Farmer Income Support",
    department: "Department of Agriculture & Farmers Welfare",
    level: "Household",
    category: "Agriculture",
    description:
      "Periodic income support for small and marginal farmer households holding cultivable land.",
    eligibility: [
      "Cultivable land up to 2 hectares in household name",
      "Not an income-tax payer",
    ],
    documents: ["Aadhaar", "Property / Land Document", "Bank Passbook"],
    property: "land-under-2ha",
    states: ["All States"],
    householdExclusive: true,
    questions: [
      "Khasra / survey number",
      "Crops cultivated last season",
      "Irrigation source",
    ],
    basis: ["Household", "Property"],
  },
  {
    id: "old-age-pension",
    name: "Old Age Pension",
    department: "Department of Social Welfare",
    level: "Individual",
    category: "Pension",
    description:
      "Monthly pension for senior citizens from low-income households.",
    eligibility: [
      "Age 60 years or above",
      "Household annual income up to ₹1,80,000",
    ],
    documents: [
      "Aadhaar",
      "Birth Certificate",
      "Income Certificate",
      "Bank Passbook",
    ],
    incomeMax: 180000,
    ageMin: 60,
    states: ["All States"],
    questions: [
      "Are you receiving any other pension?",
      "Bank account for disbursement",
    ],
    basis: ["Individual"],
  },
  {
    id: "maternity",
    name: "Maternity Benefit Programme",
    department: "Department of Women & Child Development",
    level: "Individual",
    category: "Women & Child",
    description:
      "Support for pregnant and lactating women for the first living child, linked to health check-ups.",
    eligibility: [
      "Woman aged 19 or above",
      "Registered pregnancy at a government health facility",
    ],
    documents: ["Aadhaar", "Mother & Child Protection Card", "Bank Passbook"],
    ageMin: 19,
    gender: "Female",
    states: ["All States"],
    questions: ["Expected date of delivery", "Registered health facility"],
    basis: ["Individual"],
  },
  {
    id: "job-card",
    name: "Rural Employment Job Card",
    department: "Department of Rural Development",
    level: "Household",
    category: "Employment",
    description:
      "Job card for rural households seeking wage employment under public works.",
    eligibility: [
      "Rural household",
      "Adult members willing to do unskilled manual work",
    ],
    documents: ["Aadhaar", "Residence Certificate", "Photograph"],
    states: ["All States"],
    householdExclusive: true,
    questions: [
      "Number of adult members seeking work",
      "Preferred work location (Gram Panchayat)",
    ],
    basis: ["Household"],
  },
  {
    id: "sanitation",
    name: "Village Household Sanitation Support",
    department: "Department of Drinking Water & Sanitation",
    level: "Household",
    category: "Rural Development",
    description:
      "Assistance for construction of an individual household toilet in rural areas.",
    eligibility: [
      "Rural household without a toilet",
      "No sanitation benefit previously received",
    ],
    documents: ["Aadhaar", "Residence Certificate", "Bank Passbook"],
    states: ["Uttar Pradesh", "Bihar", "Maharashtra", "West Bengal"],
    householdExclusive: true,
    questions: ["Is there space available for construction?"],
    basis: ["Household", "Property"],
  },
  {
    id: "widow-pension",
    name: "Widow Pension Scheme",
    department: "Department of Social Welfare",
    level: "Individual",
    category: "Social Welfare",
    description:
      "Monthly pension for widowed women from low-income households.",
    eligibility: [
      "Widowed woman aged 18 or above",
      "Household annual income up to ₹2,00,000",
      "Death record of spouse available",
    ],
    documents: [
      "Aadhaar",
      "Death Certificate of Spouse",
      "Income Certificate",
      "Bank Passbook",
    ],
    incomeMax: 200000,
    ageMin: 18,
    gender: "Female",
    states: ["All States"],
    questions: ["Date of spouse's death", "Are you remarried?"],
    basis: ["Individual"],
  },
];

export const getScheme = (id: string) => SCHEMES.find((s) => s.id === id);

export const CITIZEN = {
  id: "C-1001",
  name: "Sunita Devi",
  dob: "1984-03-12",
  gender: "Female",
  mobile: "98XXXXX210",
  email: "sunita.devi@example.in",
  aadhaarMasked: "XXXX XXXX 4821",
  address:
    "House 14, Ward 6, Village Rampur, Block Sadar, District Barabanki, Uttar Pradesh – 225001",
  householdId: "HH-UP-0417-2291",
};

export const HOUSEHOLD = {
  id: "HH-UP-0417-2291",
  address: CITIZEN.address,
  status: "Verified" as const,
  bpl: "BPL (Priority Household)",
  income: "Below ₹1,50,000 per year",
  annualIncome: 120000,
  property:
    "Kutcha house on 0.8 ha ancestral agricultural land (record under verification)",
  registeredOn: "2014-07-02",
};

export type VerifyState = "Verified" | "Pending" | "Not Verified";
export interface Member {
  id: string;
  name: string;
  relationship: string;
  dob: string;
  gender: string;
  identity: VerifyState;
  membership: "Active" | "Former" | "Deceased";
  income?: string;
  benefits: string[];
  history: { date: string; event: string }[];
}
export const MEMBERS: Member[] = [
  {
    id: "C-1001",
    name: "Sunita Devi",
    relationship: "Head of Household",
    dob: "1984-03-12",
    gender: "Female",
    identity: "Verified",
    membership: "Active",
    income: "Daily wage ₹60,000 / yr",
    benefits: ["Rural Employment Job Card"],
    history: [
      { date: "2003-05-10", event: "Marriage recorded with Ramesh Kumar" },
      { date: "2019-11-02", event: "Became head of household" },
    ],
  },
  {
    id: "C-1002",
    name: "Ramesh Kumar",
    relationship: "Spouse",
    dob: "1980-08-21",
    gender: "Male",
    identity: "Verified",
    membership: "Active",
    income: "Agriculture ₹60,000 / yr",
    benefits: [],
    history: [
      { date: "2003-05-10", event: "Marriage recorded with Sunita Devi" },
    ],
  },
  {
    id: "C-1003",
    name: "Pooja Kumari",
    relationship: "Daughter",
    dob: "2006-01-15",
    gender: "Female",
    identity: "Verified",
    membership: "Active",
    benefits: ["Post-Matric Scholarship"],
    history: [{ date: "2006-01-15", event: "Birth registered" }],
  },
  {
    id: "C-1004",
    name: "Aman Kumar",
    relationship: "Son",
    dob: "2012-09-03",
    gender: "Male",
    identity: "Pending",
    membership: "Active",
    benefits: [],
    history: [{ date: "2012-09-03", event: "Birth registered" }],
  },
  {
    id: "C-1005",
    name: "Kamla Devi",
    relationship: "Mother-in-law",
    dob: "1954-04-30",
    gender: "Female",
    identity: "Verified",
    membership: "Active",
    benefits: ["Old Age Pension", "Widow Pension Scheme"],
    history: [
      { date: "2019-10-18", event: "Spouse death recorded (Shiv Prasad)" },
    ],
  },
  {
    id: "C-0988",
    name: "Shiv Prasad",
    relationship: "Father-in-law",
    dob: "1950-02-11",
    gender: "Male",
    identity: "Verified",
    membership: "Deceased",
    benefits: [],
    history: [{ date: "2019-10-18", event: "Death record registered" }],
  },
  {
    id: "C-1010",
    name: "Rajesh Kumar",
    relationship: "Brother-in-law",
    dob: "1985-12-01",
    gender: "Male",
    identity: "Verified",
    membership: "Former",
    benefits: ["Rural Housing Assistance Scheme (in former household)"],
    history: [
      {
        date: "2021-03-14",
        event: "Household split — moved to HH-UP-0417-3380",
      },
    ],
  },
];

export const STATUSES = [
  "Draft",
  "Submitted",
  "Documents Under Review",
  "Verification Required",
  "Officer Review",
  "Approved",
  "Rejected",
  "Additional Evidence Required",
] as const;
export type AppStatus = (typeof STATUSES)[number];

export const TIMELINE_STAGES = [
  "Application Submitted",
  "Documents Received",
  "Identity Verification",
  "Family Verification",
  "Eligibility Evaluation",
  "Officer Review",
  "Clarification Requested",
  "Decision",
  "Benefit Processing",
  "Completed",
];

export interface AppEvent {
  date: string;
  text: string;
  by: string;
}
export interface Application {
  id: string;
  schemeId: string;
  applicant: string;
  citizenId: string;
  householdId: string;
  appliedOn: string;
  updatedOn: string;
  status: AppStatus;
  stage: number;
  declaredIncome: number;
  duplicate?: boolean;
  mismatch?: {
    field: string;
    declared: string;
    document: string;
    source: string;
  };
  events: AppEvent[];
  decision?: {
    outcome: string;
    reason: string;
    note: string;
    by: string;
    date: string;
  };
}

export const APPLICATIONS: Application[] = [
  {
    id: "APP-2026-000318",
    schemeId: "rural-housing",
    applicant: "Sunita Devi",
    citizenId: "C-1001",
    householdId: "HH-UP-0417-2291",
    appliedOn: "2026-09-04",
    updatedOn: "2026-10-15",
    status: "Verification Required",
    stage: 3,
    declaredIncome: 120000,
    duplicate: true,
    mismatch: {
      field: "Annual household income",
      declared: "₹1,20,000",
      document: "₹1,45,000",
      source: "Income Certificate (Tehsil Sadar, 2026)",
    },
    events: [
      {
        date: "2026-09-04 11:20",
        text: "Application submitted",
        by: "Sunita Devi",
      },
      {
        date: "2026-09-06 15:02",
        text: "Documents checked — income value mismatch flagged",
        by: "System validation",
      },
      {
        date: "2026-09-12 10:40",
        text: "Eligibility criteria verified (property pending)",
        by: "System validation",
      },
      {
        date: "2026-10-15 09:12",
        text: "Possible household-level duplicate benefit found",
        by: "Duplicate check",
      },
    ],
  },
  {
    id: "APP-2026-000207",
    schemeId: "post-matric",
    applicant: "Pooja Kumari",
    citizenId: "C-1003",
    householdId: "HH-UP-0417-2291",
    appliedOn: "2026-07-18",
    updatedOn: "2026-08-22",
    status: "Approved",
    stage: 6,
    declaredIncome: 120000,
    events: [
      {
        date: "2026-07-18 09:00",
        text: "Application submitted",
        by: "Sunita Devi (guardian)",
      },
      {
        date: "2026-07-20 12:30",
        text: "Documents verified",
        by: "System validation",
      },
      {
        date: "2026-08-02 14:00",
        text: "Eligibility verified",
        by: "System validation",
      },
      {
        date: "2026-08-02 14:01",
        text: "No duplicate found",
        by: "Duplicate check",
      },
      {
        date: "2026-08-21 16:45",
        text: "Approved by officer",
        by: "A. Mishra, BDO Sadar",
      },
      {
        date: "2026-08-22 10:00",
        text: "Disbursement initiated",
        by: "Treasury",
      },
    ],
    decision: {
      outcome: "Approved",
      reason: "All criteria met",
      note: "Enrollment confirmed with institution.",
      by: "A. Mishra",
      date: "2026-08-21",
    },
  },
  {
    id: "APP-2026-000412",
    schemeId: "health-cover",
    applicant: "Sunita Devi",
    citizenId: "C-1001",
    householdId: "HH-UP-0417-2291",
    appliedOn: "2026-10-01",
    updatedOn: "2026-10-12",
    status: "Additional Evidence Required",
    stage: 1,
    declaredIncome: 120000,
    events: [
      {
        date: "2026-10-01 13:10",
        text: "Application submitted",
        by: "Sunita Devi",
      },
      {
        date: "2026-10-12 11:00",
        text: "Officer requested updated BPL certificate (current one expired)",
        by: "R. Verma, Health Dept.",
      },
    ],
  },
  {
    id: "APP-2026-000455",
    schemeId: "farmer-support",
    applicant: "Ramesh Kumar",
    citizenId: "C-1002",
    householdId: "HH-UP-0417-2291",
    appliedOn: "2026-10-10",
    updatedOn: "2026-10-18",
    status: "Officer Review",
    stage: 4,
    declaredIncome: 120000,
    events: [
      {
        date: "2026-10-10 10:00",
        text: "Application submitted",
        by: "Ramesh Kumar",
      },
      {
        date: "2026-10-11 10:00",
        text: "Documents checked",
        by: "System validation",
      },
      {
        date: "2026-10-14 10:00",
        text: "Eligibility verified",
        by: "System validation",
      },
      {
        date: "2026-10-14 10:01",
        text: "No duplicate found",
        by: "Duplicate check",
      },
      {
        date: "2026-10-18 09:30",
        text: "Assigned to officer for review",
        by: "Workflow",
      },
    ],
  },
  {
    id: "APP-2026-000470",
    schemeId: "sanitation",
    applicant: "Sunita Devi",
    citizenId: "C-1001",
    householdId: "HH-UP-0417-2291",
    appliedOn: "",
    updatedOn: "2026-10-19",
    status: "Draft",
    stage: -1,
    declaredIncome: 120000,
    events: [],
  },
  {
    id: "APP-2026-000391",
    schemeId: "old-age-pension",
    applicant: "Mohan Lal",
    citizenId: "C-2210",
    householdId: "HH-UP-0417-1180",
    appliedOn: "2026-09-20",
    updatedOn: "2026-10-16",
    status: "Documents Under Review",
    stage: 1,
    declaredIncome: 90000,
    events: [
      {
        date: "2026-09-20 10:00",
        text: "Application submitted",
        by: "Mohan Lal",
      },
    ],
  },
  {
    id: "APP-2026-000402",
    schemeId: "rural-housing",
    applicant: "Geeta Yadav",
    citizenId: "C-3140",
    householdId: "HH-UP-0417-2950",
    appliedOn: "2026-09-28",
    updatedOn: "2026-10-17",
    status: "Officer Review",
    stage: 4,
    declaredIncome: 95000,
    events: [
      {
        date: "2026-09-28 10:00",
        text: "Application submitted",
        by: "Geeta Yadav",
      },
      { date: "2026-10-17 10:00", text: "Assigned to officer", by: "Workflow" },
    ],
  },
];

export interface Benefit {
  ref: string;
  scheme: string;
  beneficiary: string;
  type: Level;
  approvedOn: string;
  status:
    | "Active"
    | "Pending"
    | "Under Review"
    | "Approved"
    | "Disbursed"
    | "Completed"
    | "Suspended"
    | "Rejected"
    | "Expired";
  department: string;
  amount?: number | null;
  currency?: string | null;
  applicationId?: string | null;
  validTo?: string | null;
}
export const BENEFITS: Benefit[] = [
  {
    ref: "BEN-UP-2019-55120",
    scheme: "Rural Employment Job Card",
    beneficiary: "Household HH-UP-0417-2291",
    type: "Household",
    approvedOn: "2019-12-05",
    status: "Active",
    department: "Department of Rural Development",
  },
  {
    ref: "BEN-UP-2020-11823",
    scheme: "Old Age Pension",
    beneficiary: "Kamla Devi",
    type: "Individual",
    approvedOn: "2020-02-14",
    status: "Active",
    department: "Department of Social Welfare",
  },
  {
    ref: "BEN-UP-2020-11907",
    scheme: "Widow Pension Scheme",
    beneficiary: "Kamla Devi",
    type: "Individual",
    approvedOn: "2020-03-02",
    status: "Active",
    department: "Department of Social Welfare",
  },
  {
    ref: "BEN-UP-2022-40018",
    scheme: "Family Health Insurance Cover",
    beneficiary: "Household HH-UP-0417-2291",
    type: "Household",
    approvedOn: "2022-06-10",
    status: "Completed",
    department: "Department of Health & Family Welfare",
  },
  {
    ref: "BEN-UP-2026-70231",
    scheme: "Post-Matric Scholarship",
    beneficiary: "Pooja Kumari",
    type: "Individual",
    approvedOn: "2026-08-21",
    status: "Disbursed",
    department: "Department of Social Justice & Empowerment",
  },
];

export interface Notification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  link?: string;
}
export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Verification required",
    body: "APP-2026-000318: A similar household-level benefit may already exist. You can provide clarification.",
    date: "2026-10-15",
    read: false,
    link: "/citizen/applications/APP-2026-000318",
  },
  {
    id: "n2",
    title: "Evidence requested",
    body: "APP-2026-000412: Please upload a current BPL certificate.",
    date: "2026-10-12",
    read: false,
    link: "/citizen/applications/APP-2026-000412",
  },
  {
    id: "n3",
    title: "Application moved to officer review",
    body: "APP-2026-000455 has been assigned to an officer.",
    date: "2026-10-18",
    read: false,
    link: "/citizen/applications/APP-2026-000455",
  },
  {
    id: "n4",
    title: "Document missing",
    body: "Your draft APP-2026-000470 is missing a Residence Certificate.",
    date: "2026-10-19",
    read: true,
    link: "/citizen/applications/APP-2026-000470",
  },
  {
    id: "n5",
    title: "Application approved",
    body: "APP-2026-000207 (Post-Matric Scholarship) has been approved.",
    date: "2026-08-21",
    read: true,
  },
  {
    id: "n6",
    title: "Benefit processed",
    body: "Scholarship disbursement initiated for Pooja Kumari.",
    date: "2026-08-22",
    read: true,
    link: "/citizen/benefits",
  },
  {
    id: "n7",
    title: "Family record update verified",
    body: "Aadhaar seeding for Kamla Devi verified.",
    date: "2026-06-03",
    read: true,
    link: "/citizen/family",
  },
];

export interface AuditEvent {
  id: string;
  ts: string;
  actor: string;
  action: string;
  application: string;
  prev: string;
  next: string;
  reason: string;
}
export const AUDIT: AuditEvent[] = [
  {
    id: "AU-90011",
    ts: "2026-10-18 09:30:12",
    actor: "Workflow engine",
    action: "Application assigned",
    application: "APP-2026-000455",
    prev: "Submitted",
    next: "Officer Review",
    reason: "Auto-assignment by block",
  },
  {
    id: "AU-90007",
    ts: "2026-10-15 09:12:44",
    actor: "Duplicate check",
    action: "Duplicate alert created",
    application: "APP-2026-000318",
    prev: "Eligibility Verified",
    next: "Verification Required",
    reason: "Household lineage match with HH-UP-0417-3380",
  },
  {
    id: "AU-90002",
    ts: "2026-10-12 11:00:05",
    actor: "R. Verma (OFF-UP-3301)",
    action: "Officer requested evidence",
    application: "APP-2026-000412",
    prev: "Documents Under Review",
    next: "Additional Evidence Required",
    reason: "BPL certificate expired on 2026-03-31",
  },
  {
    id: "AU-89870",
    ts: "2026-09-06 15:02:10",
    actor: "Sunita Devi (C-1001)",
    action: "Document uploaded",
    application: "APP-2026-000318",
    prev: "—",
    next: "Income Certificate.pdf",
    reason: "Applicant upload",
  },
  {
    id: "AU-89350",
    ts: "2026-08-22 10:00:00",
    actor: "Treasury",
    action: "Benefit disbursed",
    application: "APP-2026-000207",
    prev: "Approved",
    next: "Disbursed",
    reason: "Scheduled DBT batch",
  },
  {
    id: "AU-89341",
    ts: "2026-08-21 16:45:31",
    actor: "A. Mishra (OFF-UP-2291)",
    action: "Application approved",
    application: "APP-2026-000207",
    prev: "Officer Review",
    next: "Approved",
    reason: "All criteria met",
  },
  {
    id: "AU-89120",
    ts: "2026-07-20 12:30:02",
    actor: "System validation",
    action: "Record verified",
    application: "APP-2026-000207",
    prev: "Documents Under Review",
    next: "Documents Checked",
    reason: "Document fields match registry",
  },
];

export interface DuplicateAlert {
  id: string;
  severity: "High" | "Medium" | "Low";
  appId: string;
  scheme: string;
  applicant: string;
  household: string;
  match: string;
  reason: string;
  sources: string[];
  status:
    | "Open"
    | "Investigation Signal"
    | "Legitimate Overlap"
    | "Not Duplicate"
    | "Confirmed Duplicate"
    | "Evidence Requested"
    | "Escalated";
  compare: {
    field: string;
    current: string;
    existing: string;
    same: boolean;
  }[];
}
export const DUPLICATE_ALERTS: DuplicateAlert[] = [
  {
    id: "DA-2026-10483",
    severity: "Medium",
    appId: "APP-2026-10482",
    scheme: "National Food Security Mission (NFSA Priority Ration)",
    applicant: "Rajesh Sharma",
    household: "MIRA-FAM-10482",
    match:
      "Potential duplicate detected: Sunita Sharma (Spouse) in active Antyodaya Ration Scheme under legacy district registry",
    reason:
      "Potential duplicate detected because two applications share matching identity reference and overlapping benefit period under Sharma household. Requires Human-in-the-Loop review.",
    sources: [
      "NFSA Registry Database",
      "Civil Registration System",
      "Municipal Household Survey",
    ],
    status: "Investigation Signal",
    compare: [
      {
        field: "Household ID",
        current: "MIRA-FAM-10482",
        existing: "MIRA-FAM-10482 (Pre-unification registry)",
        same: true,
      },
      {
        field: "Identity Reference",
        current: "XXXX-XXXX-4821 (Rajesh Sharma)",
        existing: "XXXX-XXXX-4821 (Linked Family Card)",
        same: true,
      },
      {
        field: "Family Relationship",
        current: "Rajesh Sharma (Household Head)",
        existing: "Sunita Sharma (Spouse / Card Member)",
        same: false,
      },
      {
        field: "Address",
        current: "House No. 42, Ward 7, Demo District",
        existing: "House No. 42, Ward 7, Demo District",
        same: true,
      },
      {
        field: "Benefit Period",
        current: "2026-2027 (Active application)",
        existing: "2024-2026 (Expiring legacy entitlement)",
        same: true,
      },
      {
        field: "Statutory Rule",
        current: "NFSA Rule 4(b) Single Family Quota",
        existing: "Subsumes prior district card",
        same: false,
      },
    ],
  },
  {
    id: "DA-2026-0091",
    severity: "High",
    appId: "APP-2026-000318",
    scheme: "Rural Housing Assistance Scheme",
    applicant: "Sunita Devi",
    household: "HH-UP-0417-2291",
    match:
      "BEN-UP-2019-30412 — Rural Housing Assistance to HH-UP-0417-2291 (pre-split), beneficiary Rajesh Kumar",
    reason:
      "Household HH-UP-0417-3380 was split from the applicant's household in 2021. A housing benefit was approved in 2019 when both families were one household.",
    sources: [
      "Household lineage register",
      "Benefit registry (Rural Development)",
      "Land records (Tehsil Sadar)",
    ],
    status: "Open",
    compare: [
      {
        field: "Household ID",
        current: "HH-UP-0417-2291",
        existing: "HH-UP-0417-2291 (at time of benefit)",
        same: true,
      },
      {
        field: "Family relationship",
        current: "Applicant is sister-in-law of prior beneficiary",
        existing: "Rajesh Kumar, then member",
        same: false,
      },
      {
        field: "Property",
        current: "Kutcha house, Khasra 214",
        existing: "Pucca house, Khasra 214/2",
        same: false,
      },
      {
        field: "Address",
        current: "House 14, Ward 6, Rampur",
        existing: "House 14-A, Ward 6, Rampur",
        same: false,
      },
      {
        field: "Benefit",
        current: "Housing assistance (requested)",
        existing: "Housing assistance (completed)",
        same: true,
      },
      {
        field: "Scheme",
        current: "Rural Housing Assistance Scheme",
        existing: "Rural Housing Assistance Scheme",
        same: true,
      },
      {
        field: "Date",
        current: "2026-09-04",
        existing: "2019-02-11",
        same: false,
      },
    ],
  },
  {
    id: "DA-2026-0088",
    severity: "Medium",
    appId: "APP-2026-000402",
    scheme: "Rural Housing Assistance Scheme",
    applicant: "Geeta Yadav",
    household: "HH-UP-0417-2950",
    match: "Similar address in pending application APP-2026-000377",
    reason: "Same plot number reported by another household application.",
    sources: ["Application registry", "Land records (Tehsil Sadar)"],
    status: "Open",
    compare: [
      {
        field: "Household ID",
        current: "HH-UP-0417-2950",
        existing: "HH-UP-0417-2951",
        same: false,
      },
      {
        field: "Family relationship",
        current: "No recorded relation",
        existing: "No recorded relation",
        same: true,
      },
      {
        field: "Property",
        current: "Khasra 302",
        existing: "Khasra 302",
        same: true,
      },
      {
        field: "Address",
        current: "Ward 3, Rampur",
        existing: "Ward 3, Rampur",
        same: true,
      },
      {
        field: "Benefit",
        current: "Housing assistance",
        existing: "Housing assistance (pending)",
        same: true,
      },
      {
        field: "Scheme",
        current: "Rural Housing Assistance Scheme",
        existing: "Rural Housing Assistance Scheme",
        same: true,
      },
      {
        field: "Date",
        current: "2026-09-28",
        existing: "2026-09-15",
        same: false,
      },
    ],
  },
];

export interface VaultDoc {
  id: string;
  name: string;
  type: string;
  size: string;
  uploaded: string;
  status:
    | "Verified"
    | "Manual verification required"
    | "Expired document"
    | "Mismatch detected";
}
export const VAULT: VaultDoc[] = [
  {
    id: "d1",
    name: "Aadhaar_Sunita.pdf",
    type: "Aadhaar",
    size: "412 KB",
    uploaded: "2026-03-02",
    status: "Verified",
  },
  {
    id: "d2",
    name: "Income_Certificate_2026.pdf",
    type: "Income Certificate",
    size: "286 KB",
    uploaded: "2026-09-04",
    status: "Mismatch detected",
  },
  {
    id: "d3",
    name: "BPL_Card_2023.jpg",
    type: "BPL Certificate",
    size: "1.2 MB",
    uploaded: "2023-04-11",
    status: "Expired document",
  },
  {
    id: "d4",
    name: "Residence_Certificate.pdf",
    type: "Residence Certificate",
    size: "198 KB",
    uploaded: "2026-01-20",
    status: "Verified",
  },
  {
    id: "d5",
    name: "Khatauni_214.pdf",
    type: "Property / Land Document",
    size: "904 KB",
    uploaded: "2026-09-04",
    status: "Manual verification required",
  },
];

export const OFFICER = {
  id: "OFF-UP-2291",
  name: "Arvind Mishra",
  designation: "Block Development Officer",
  department: "Department of Rural Development",
  office: "Block Office, Sadar, Barabanki",
};
export const DEPARTMENTS = [
  "Department of Rural Development",
  "Department of Social Welfare",
  "Department of Health & Family Welfare",
  "Department of Agriculture & Farmers Welfare",
  "Department of Women & Child Development",
  "Department of Social Justice & Empowerment",
];

export const fmtDate = (d: string) => {
  if (!d) return "—";
  const dt = new Date(d.slice(0, 10) + "T00:00:00");
  return dt.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ============================================================================
// 1. Inbox & Mail System Models and Seed Data
// ============================================================================

export interface MailAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface MailMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  timestamp: string;
  body: string;
  attachments?: MailAttachment[];
}

export interface MessageThread {
  id: string;
  subject: string;
  sender: {
    name: string;
    email: string;
    role: string;
    department?: string;
    avatar?: string;
  };
  recipient: {
    name: string;
    email: string;
    role: string;
  };
  preview: string;
  timestamp: string;
  status: "unread" | "read";
  isStarred?: boolean;
  isArchived?: boolean;
  folder: "inbox" | "sent" | "starred" | "archived" | "important";
  applicationId?: string;
  tags?: string[];
  messages: MailMessage[];
}

export const SEED_MESSAGES: MessageThread[] = [
  {
    id: "MSG-2026-901",
    subject: "Clarification: Income Certificate Document for Application APP-2026-000318",
    sender: {
      name: "Neha Verma",
      email: "verifier@mira.local",
      role: "verifier",
      department: "Social Welfare Verification Cell",
    },
    recipient: {
      name: "Ananya Sharma",
      email: "citizen@mira.local",
      role: "citizen",
    },
    preview: "Please upload a clearer copy of your Tehsil-issued income certificate. The seal on Page 1 is partially obscured.",
    timestamp: "2026-10-22 14:30",
    status: "unread",
    isStarred: true,
    folder: "inbox",
    applicationId: "APP-2026-000318",
    tags: ["Action Required", "Evidence"],
    messages: [
      {
        id: "M-1",
        senderName: "Neha Verma",
        senderEmail: "verifier@mira.local",
        senderRole: "verifier",
        timestamp: "2026-10-22 10:15",
        body: "Namaste Ananya ji, during document verification for your Rural Housing Assistance application (APP-2026-000318), we noticed the municipal seal on Page 1 of the Income Certificate is partially obscured. Kindly upload a clear scanned copy or attested certificate so we can advance your file to sanction.",
        attachments: [
          {
            id: "att-1",
            name: "income_sample_spec.pdf",
            size: 142000,
            type: "application/pdf",
          },
        ],
      },
      {
        id: "M-1-REPLY",
        senderName: "Ananya Sharma",
        senderEmail: "citizen@mira.local",
        senderRole: "citizen",
        timestamp: "2026-10-22 12:40",
        body: "Respected Neha ji, I have obtained the re-attested income certificate directly from Tehsil Sadar office with the official seal clearly visible on both pages. Kindly confirm if this satisfies the verification requirement.",
        attachments: [
          {
            id: "att-2",
            name: "attested_income_oct2026.pdf",
            size: 198000,
            type: "application/pdf",
          },
        ],
      },
      {
        id: "M-1-FINAL",
        senderName: "Neha Verma",
        senderEmail: "verifier@mira.local",
        senderRole: "verifier",
        timestamp: "2026-10-22 14:30",
        body: "Ananya ji, thank you for the prompt re-submission. The revenue seal and Tehsil registration number have been verified against the state database. Your application APP-2026-000318 is now approved for second-stage sanction.",
      },
    ],
  },
  {
    id: "MSG-2026-902",
    subject: "Field Verification Visit Scheduled: Lucknow Urban Zone 3",
    sender: {
      name: "Ravi Kumar",
      email: "officer@mira.local",
      role: "officer",
      department: "District Welfare Office",
    },
    recipient: {
      name: "Ananya Sharma",
      email: "citizen@mira.local",
      role: "citizen",
    },
    preview: "Physical household inspection scheduled for 24 Oct 2026 between 10:00 AM and 1:00 PM.",
    timestamp: "2026-10-21 11:15",
    status: "read",
    isStarred: false,
    folder: "inbox",
    applicationId: "APP-2026-000318",
    tags: ["Field Visit", "Schedule"],
    messages: [
      {
        id: "M-2",
        senderName: "Ravi Kumar",
        senderEmail: "officer@mira.local",
        senderRole: "officer",
        timestamp: "2026-10-21 11:15",
        body: "Hello Ananya ji, this is Field Official Ravi Kumar from the District Welfare Office. I have been assigned to verify your household residence and physical dwelling condition for your housing grant application. I will visit House No. 42, Ward 7 tomorrow between 10:00 AM and 1:00 PM. Please have original identity proofs ready for inspection.",
      },
    ],
  },
  {
    id: "MSG-2026-903",
    subject: "Household Survey Lineage Attestation Confirmed",
    sender: {
      name: "Arjun Mehta",
      email: "admin@mira.local",
      role: "admin",
      department: "Department of Social Welfare",
    },
    recipient: {
      name: "Neha Verma",
      email: "verifier@mira.local",
      role: "verifier",
    },
    preview: "State family register synchronised for Lucknow district. Household SH-HH-10482 attested.",
    timestamp: "2026-10-20 16:45",
    status: "read",
    isStarred: false,
    folder: "inbox",
    applicationId: "APP-2026-000318",
    tags: ["Operations", "System"],
    messages: [
      {
        id: "M-3",
        senderName: "Arjun Mehta",
        senderEmail: "admin@mira.local",
        senderRole: "admin",
        timestamp: "2026-10-20 16:45",
        body: "Neha, the automated batch reconciliation with Tehsil Sadar Land Registry completed successfully. Any pending cross-scheme checks on household SH-HH-10482 can now proceed under Rule Version 3.2.",
      },
    ],
  },
  {
    id: "MSG-2026-904",
    subject: "Audit Query: High-impact Sanction Sampling for Q3 2026",
    sender: {
      name: "Priya Nair",
      email: "auditor@mira.local",
      role: "auditor",
      department: "Office of the Principal Accountant General",
    },
    recipient: {
      name: "Arjun Mehta",
      email: "admin@mira.local",
      role: "admin",
    },
    preview: "Requesting immutable decision exports for block grants exceeding ₹1,00,000.",
    timestamp: "2026-10-19 09:30",
    status: "read",
    isStarred: true,
    folder: "inbox",
    tags: ["Compliance", "Audit"],
    messages: [
      {
        id: "M-4",
        senderName: "Priya Nair",
        senderEmail: "auditor@mira.local",
        senderRole: "auditor",
        timestamp: "2026-10-19 09:30",
        body: "Director Mehta, as part of the statutory quarterly audit under the Public Welfare Transparency Act, please ensure all second-tier supervisor reviews for rural housing grants sanctioned between July and September are accessible in the read-only audit partition.",
      },
    ],
  },
];

// ============================================================================
// 2. Threaded Comments System with @mentions
// ============================================================================

export interface CommentReply {
  id: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  timestamp: string;
  text: string;
  mentions?: string[];
}

export interface CommentItem {
  id: string;
  recordType: "application" | "document" | "task" | "visit" | "scheme" | "rule";
  recordId: string;
  author: {
    name: string;
    role: string;
    department?: string;
    avatar?: string;
  };
  timestamp: string;
  text: string;
  mentions?: string[];
  replies: CommentReply[];
  isResolved?: boolean;
}

export const SEED_COMMENTS: CommentItem[] = [
  {
    id: "COM-01",
    recordType: "application",
    recordId: "APP-2026-000318",
    author: {
      name: "Neha Verma",
      role: "verifier",
      department: "Verification Cell",
    },
    timestamp: "2026-10-22 11:20",
    text: "Income certificate declared ₹1,40,000, but electricity billing indicates urban tariff connection. @Ravi please check dwelling type during field visit.",
    mentions: ["Ravi"],
    isResolved: false,
    replies: [
      {
        id: "REP-01-1",
        author: {
          name: "Ravi Kumar",
          role: "officer",
        },
        timestamp: "2026-10-22 13:40",
        text: "Understood @Neha. I have added a physical inspection check for meter installation at House 42, Ward 7.",
        mentions: ["Neha"],
      },
    ],
  },
  {
    id: "COM-02",
    recordType: "application",
    recordId: "APP-2026-000318",
    author: {
      name: "Ananya Sharma",
      role: "citizen",
    },
    timestamp: "2026-10-22 15:05",
    text: "I have uploaded the renewed Tahsildar income certificate with clear official stamp. Please review.",
    mentions: ["Neha"],
    isResolved: true,
    replies: [
      {
        id: "REP-02-1",
        author: {
          name: "Neha Verma",
          role: "verifier",
        },
        timestamp: "2026-10-22 16:10",
        text: "Document received and authenticated. Thank you Ananya ji.",
      },
    ],
  },
  {
    id: "COM-03",
    recordType: "rule",
    recordId: "rural-housing",
    author: {
      name: "Arjun Mehta",
      role: "admin",
      department: "Directorate",
    },
    timestamp: "2026-10-15 10:00",
    text: "Rule version 3.2 raises household annual threshold from ₹1,20,000 to ₹1,50,000 per Cabinet Order 2026/SW-941. @Priya audit note updated.",
    mentions: ["Priya"],
    isResolved: true,
    replies: [],
  },
];

// ============================================================================
// 3. Field Official Visits & Operational Workflow
// ============================================================================

export interface FieldVisitChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  notes?: string;
}

export interface FieldVisit {
  id: string;
  applicationId: string;
  citizenName: string;
  citizenPhone: string;
  address: string;
  ward: string;
  scheduledDate: string;
  scheduledTime: string;
  status: "Today" | "Upcoming" | "Completed" | "Escalated";
  purpose: string;
  schemeName: string;
  dwellingType: "Kutcha" | "Semi-Pucca" | "Pucca";
  checklist: FieldVisitChecklistItem[];
  officerNotes: string;
  evidencePhotos: string[];
  citizenConfirmation: {
    confirmed: boolean;
    signedBy?: string;
    timestamp?: string;
  };
}

export const SEED_FIELD_VISITS: FieldVisit[] = [
  {
    id: "FV-2026-0041",
    applicationId: "APP-2026-000318",
    citizenName: "Ananya Sharma",
    citizenPhone: "+91 98765 43210",
    address: "House No. 42, Ward 7, Rampur, Sadar Tehsil",
    ward: "Ward 7",
    scheduledDate: "2026-10-23",
    scheduledTime: "10:30 AM",
    status: "Today",
    purpose: "Dwelling condition and household co-residence inspection",
    schemeName: "Rural Housing Assistance Scheme",
    dwellingType: "Kutcha",
    checklist: [
      { id: "c1", label: "Verify physical co-residence of all 5 household members", checked: true },
      { id: "c2", label: "Confirm absence of pucca RCC roof dwelling on plot", checked: true },
      { id: "c3", label: "Inspect electricity meter and domestic load (< 1 kW)", checked: false },
      { id: "c4", label: "Verify Khasra land title boundary with neighbouring plots", checked: true },
    ],
    officerNotes: "Household resides in ancestral thatched/mud dwelling. Family members present. High priority for pucca housing sanction under state guidelines.",
    evidencePhotos: ["/hero/civic-1.jpg", "/hero/civic-2.jpg"],
    citizenConfirmation: {
      confirmed: true,
      signedBy: "Ananya Sharma",
      timestamp: "2026-10-23 11:15",
    },
  },
  {
    id: "FV-2026-0042",
    applicationId: "APP-2026-000402",
    citizenName: "Geeta Yadav",
    citizenPhone: "+91 98111 22334",
    address: "Plot 302, Rampur Khurd, Near Water Tank",
    ward: "Ward 3",
    scheduledDate: "2026-10-24",
    scheduledTime: "02:00 PM",
    status: "Upcoming",
    purpose: "Boundary demarcation and land ownership survey",
    schemeName: "Rural Housing Assistance Scheme",
    dwellingType: "Semi-Pucca",
    checklist: [
      { id: "c1", label: "Inspect Khasra 302 boundary stones", checked: false },
      { id: "c2", label: "Verify neighbor partition declaration", checked: false },
      { id: "c3", label: "Check prior benefit receipt from Nagar Panchayat", checked: false },
    ],
    officerNotes: "Cross-check plot overlap alert DA-2026-0088 with adjacent household application.",
    evidencePhotos: [],
    citizenConfirmation: { confirmed: false },
  },
  {
    id: "FV-2026-0039",
    applicationId: "APP-2026-000391",
    citizenName: "Mohan Lal",
    citizenPhone: "+91 94555 67890",
    address: "House 18, Ward 4, Old Tehsil Colony",
    ward: "Ward 4",
    scheduledDate: "2026-10-18",
    scheduledTime: "11:00 AM",
    status: "Completed",
    purpose: "Senior Citizen Age and Caregiver Independence Verification",
    schemeName: "National Old Age Pension",
    dwellingType: "Pucca",
    checklist: [
      { id: "c1", label: "Inspect civil hospital age certificate", checked: true },
      { id: "c2", label: "Confirm bank account linkage with Aadhaar", checked: true },
    ],
    officerNotes: "Applicant is 68 years old. Living with dependent spouse. Bank DBT details verified.",
    evidencePhotos: ["/hero/civic-3.jpg"],
    citizenConfirmation: {
      confirmed: true,
      signedBy: "Mohan Lal",
      timestamp: "2026-10-18 11:45",
    },
  },
];

// ============================================================================
// 4. Files Explorer & Versioning System
// ============================================================================

export interface FileVersionEntry {
  versionNumber: number;
  filename: string;
  sizeBytes: number;
  uploadedBy: string;
  uploadedAt: string;
  reason: string;
}

export interface FileRecord {
  id: string;
  name: string;
  category: "My Files" | "Application Files" | "Household Files" | "Evidence" | "Shared With Me" | "Requested Documents" | "Archived";
  type: string;
  mimeType: string;
  sizeBytes: number;
  uploadedBy: string;
  uploadedRole: string;
  uploadedDate: string;
  verificationStatus: "Verified" | "Pending Review" | "Action Required" | "Mismatch Detected";
  relatedRecordId?: string;
  currentVersion: number;
  versions: FileVersionEntry[];
}

export const SEED_FILES: FileRecord[] = [
  {
    id: "FIL-01",
    name: "Aadhaar_Card_Rajesh_Sharma.pdf",
    category: "Household Files",
    type: "Aadhaar Card",
    mimeType: "application/pdf",
    sizeBytes: 348160,
    uploadedBy: "Ananya Sharma",
    uploadedRole: "citizen",
    uploadedDate: "2026-01-15",
    verificationStatus: "Verified",
    relatedRecordId: "MIRA-FAM-10482",
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        filename: "Aadhaar_Card_Rajesh_Sharma.pdf",
        sizeBytes: 348160,
        uploadedBy: "Ananya Sharma",
        uploadedAt: "2026-01-15 10:20",
        reason: "Initial identity verification during citizen onboarding",
      },
    ],
  },
  {
    id: "FIL-02",
    name: "Income_Certificate_2026_Attested.pdf",
    category: "Application Files",
    type: "Income Certificate",
    mimeType: "application/pdf",
    sizeBytes: 292864,
    uploadedBy: "Ananya Sharma",
    uploadedRole: "citizen",
    uploadedDate: "2026-10-22",
    verificationStatus: "Verified",
    relatedRecordId: "APP-2026-000318",
    currentVersion: 2,
    versions: [
      {
        versionNumber: 2,
        filename: "Income_Certificate_2026_Attested.pdf",
        sizeBytes: 292864,
        uploadedBy: "Ananya Sharma",
        uploadedAt: "2026-10-22 15:00",
        reason: "Uploaded high-resolution attested copy per Officer Neha Verma request",
      },
      {
        versionNumber: 1,
        filename: "Income_Certificate_2026_Scan.pdf",
        sizeBytes: 286720,
        uploadedBy: "Ananya Sharma",
        uploadedAt: "2026-09-04 11:30",
        reason: "Original draft upload (seal partially obscured)",
      },
    ],
  },
  {
    id: "FIL-03",
    name: "Field_Inspection_Dwelling_Photos.zip",
    category: "Evidence",
    type: "Field Evidence Photos",
    mimeType: "application/zip",
    sizeBytes: 1945600,
    uploadedBy: "Ravi Kumar",
    uploadedRole: "officer",
    uploadedDate: "2026-10-23",
    verificationStatus: "Verified",
    relatedRecordId: "FV-2026-0041",
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        filename: "Field_Inspection_Dwelling_Photos.zip",
        sizeBytes: 1945600,
        uploadedBy: "Ravi Kumar",
        uploadedAt: "2026-10-23 11:30",
        reason: "Geotagged physical inspection photographic evidence",
      },
    ],
  },
  {
    id: "FIL-04",
    name: "Land_Record_Khatauni_214.pdf",
    category: "Application Files",
    type: "Land Records / Title",
    mimeType: "application/pdf",
    sizeBytes: 925696,
    uploadedBy: "Ananya Sharma",
    uploadedRole: "citizen",
    uploadedDate: "2026-09-04",
    verificationStatus: "Verified",
    relatedRecordId: "APP-2026-000318",
    currentVersion: 1,
    versions: [
      {
        versionNumber: 1,
        filename: "Land_Record_Khatauni_214.pdf",
        sizeBytes: 925696,
        uploadedBy: "Ananya Sharma",
        uploadedAt: "2026-09-04 11:45",
        reason: "Tehsil certified copy of Khasra land parcel 214",
      },
    ],
  },
];

// ============================================================================
// 5. Auditor Forensic Decision Records
// ============================================================================

export interface DecisionRecord {
  id: string;
  applicationId: string;
  schemeName: string;
  applicantName: string;
  decision: "APPROVED" | "REJECTED" | "EVIDENCE_REQUESTED" | "ESCALATED";
  decidedBy: string;
  officerRole: string;
  decidedAt: string;
  justification: string;
  statutoryRuleRef: string;
  benefitAmount?: number;
  auditHash: string;
}

export const SEED_DECISIONS: DecisionRecord[] = [
  {
    id: "DEC-2026-0091",
    applicationId: "APP-2026-000391",
    schemeName: "National Old Age Pension",
    applicantName: "Mohan Lal",
    decision: "APPROVED",
    decidedBy: "Sunita Verma (Scheme Officer)",
    officerRole: "SCHEME_OFFICER",
    decidedAt: "2026-10-18 16:30",
    justification: "Applicant meets age criterion (>65 years) and BPL priority household threshold. Aadhaar biometric authentication attested.",
    statutoryRuleRef: "NOAPS Guidelines Section 3(a)",
    benefitAmount: 1000,
    auditHash: "SHA256:7f9a2b8c4d1e3f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
  },
  {
    id: "DEC-2026-0089",
    applicationId: "APP-2026-000318",
    schemeName: "Rural Housing Assistance Scheme",
    applicantName: "Ananya Sharma",
    decision: "EVIDENCE_REQUESTED",
    decidedBy: "Neha Verma (Verification Officer)",
    officerRole: "VERIFICATION_OFFICER",
    decidedAt: "2026-10-22 14:35",
    justification: "Income certificate stamp partially obscured. Clarification required before second-stage approval per Verification Cell protocol.",
    statutoryRuleRef: "Verification Manual Circular 42/2025",
    auditHash: "SHA256:4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b",
  },
  {
    id: "DEC-2026-0074",
    applicationId: "APP-2026-000214",
    schemeName: "National Health Protection (PM-JAY)",
    applicantName: "Sanjay Gupta",
    decision: "REJECTED",
    decidedBy: "Sunita Verma (Scheme Officer)",
    officerRole: "SCHEME_OFFICER",
    decidedAt: "2026-10-14 11:20",
    justification: "Household declared income exceeds SECC 2011 deprivation criteria. Non-qualifying household under state health rules.",
    statutoryRuleRef: "PM-JAY Deprivation Criteria D1-D7 Exclusion",
    auditHash: "SHA256:1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
  },
];

// ============================================================================
// 6. Believable Demo Personas for All 5 Roles
// ============================================================================

export interface DemoProfile {
  name: string;
  email: string;
  role: string;
  title: string;
  department: string;
  location: string;
  phone: string;
  householdId?: string;
  badge: string;
  avatarSeed: string;
  description: string;
  accessScope: string;
}

export const DEMO_PROFILES: Record<string, DemoProfile> = {
  citizen: {
    name: "Ananya Sharma",
    email: "citizen@mira.local",
    role: "citizen",
    title: "Primary Applicant / Citizen",
    department: "Citizen Services",
    location: "Lucknow, Uttar Pradesh",
    phone: "+91 98765 43210",
    householdId: "SH-HH-10482",
    badge: "Verified Citizen",
    avatarSeed: "Ananya",
    description: "Citizen managing household family tree, housing grant applications, and benefit tracking.",
    accessScope: "Personal Household Record (SH-HH-10482) & Self Applications",
  },
  officer: {
    name: "Ravi Kumar",
    email: "officer@mira.local",
    role: "officer",
    title: "Field Verification Official",
    department: "District Welfare Office (Lucknow Urban Zone 3)",
    location: "Sadar Tehsil, Lucknow",
    phone: "+91 94150 11223",
    badge: "Field Official",
    avatarSeed: "Ravi",
    description: "Conducts on-site dwelling inspections, household member checks, and GPS evidence logging.",
    accessScope: "Assigned Field Verification Workstation (Lucknow Urban Zone 3)",
  },
  verifier: {
    name: "Neha Verma",
    email: "verifier@mira.local",
    role: "verifier",
    title: "Verification Officer",
    department: "Social Welfare Verification Cell",
    location: "State Secretariat, Lucknow",
    phone: "+91 94520 33445",
    badge: "Verification Cell",
    avatarSeed: "Neha",
    description: "Examines OCR extracted certificates, verifies family lineage, and resolves mismatch signals.",
    accessScope: "State Intake Queue, OCR Extractor & Document Intelligence Workstation",
  },
  admin: {
    name: "Arjun Mehta",
    email: "admin@mira.local",
    role: "admin",
    title: "Department Administrator",
    department: "Directorate of Social Welfare & Public Benefits",
    location: "Lucknow, Uttar Pradesh",
    phone: "+91 94151 55667",
    badge: "System Authority",
    avatarSeed: "Arjun",
    description: "Configures welfare schemes, manages eligibility rules and workflow routing, monitors queues.",
    accessScope: "Department-Wide Scheme Master, Rule Engine & Operational Configuration",
  },
  auditor: {
    name: "Priya Nair",
    email: "auditor@mira.local",
    role: "auditor",
    title: "Senior Audit Officer",
    department: "Office of the Principal Accountant General",
    location: "Audit Bhavan, Lucknow",
    phone: "+91 94152 77889",
    badge: "Read-Only Compliance",
    avatarSeed: "Priya",
    description: "Inspects immutable audit trails, historical decisions, rule versions, and officer actions.",
    accessScope: "STRICTLY READ-ONLY: All Historical Decisional Timelines & Audit Ledgers",
  },
};

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
