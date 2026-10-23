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
  "Documents Checked",
  "Eligibility Verified",
  "Duplicate Check",
  "Officer Review",
  "Decision",
  "Benefit / Disbursement",
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
export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
