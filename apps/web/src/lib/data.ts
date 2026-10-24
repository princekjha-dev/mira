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
export type BenefitType =
  | "Direct Benefit Transfer (DBT)"
  | "Subsidy / Grant"
  | "In-kind Assistance"
  | "Financial Assistance"
  | "Healthcare Coverage"
  | "Monthly Pension";

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
  keyBenefit: string;
  benefitType: BenefitType;
  targetAudience: string;
  benefitsSummary: string[];
  howToApply: string[];
  deadlines?: string;
  status: "Active" | "Accepting Applications" | "Rolling" | "Verification Underway";
}

export const SCHEMES: Scheme[] = [
  {
    id: "rural-housing",
    name: "Rural Housing Assistance Scheme",
    department: "Department of Rural Development",
    level: "Household",
    category: "Housing",
    description:
      "Assistance for construction of a permanent pucca house for eligible rural households without adequate shelter.",
    eligibility: [
      "Household annual income up to ₹3,00,000",
      "BPL household status or Priority Living list",
      "No pucca house owned by any household member anywhere in India",
      "No housing benefit previously received by the household under state or central scheme",
    ],
    documents: [
      "Aadhaar Card",
      "Income Certificate",
      "BPL / Priority Ration Card",
      "Residence Certificate",
      "Land / Homestead Possession Document",
    ],
    incomeMax: 300000,
    bplRequired: true,
    property: "no-pucca-house",
    states: ["All States"],
    householdExclusive: true,
    questions: [
      "Current type of dwelling (Kutcha / Semi-pucca / Homeless)",
      "Homestead plot ownership status",
      "Have you received housing subsidy under any prior government programme?",
    ],
    basis: ["Household", "Property"],
    keyBenefit: "Financial grant of ₹1,20,000 for construction of a permanent pucca dwelling",
    benefitType: "Subsidy / Grant",
    targetAudience: "Rural homeless households or families residing in kutcha and dilapidated structures",
    benefitsSummary: [
      "Financial assistance of ₹1,20,000 disbursed in three milestone-linked installments via DBT",
      "Additional 90 to 95 person-days of unskilled wage employment support under MGNREGS",
      "Dedicated grant of ₹12,000 for construction of sanitary latrine via Swachh Bharat Mission",
    ],
    howToApply: [
      "Submit application online or through Common Service Centre (CSC) with household ID",
      "Field official conducts geo-tagged inspection of existing living site and landholding",
      "Gram Sabha ratifies beneficiary list; verification officer reviews registry records",
      "Sanction order issued and first installment released to verified Aadhaar-seeded bank account",
    ],
    deadlines: "Rolling annual sanction cycle. Current batch applications close 31 March 2027",
    status: "Accepting Applications",
  },
  {
    id: "post-matric",
    name: "Post-Matric Scholarship",
    department: "Department of Social Justice & Empowerment",
    level: "Individual",
    category: "Education",
    description:
      "Statutory educational scholarship covering tuition fee reimbursement and monthly maintenance for post-matriculation study.",
    eligibility: [
      "Student aged 15–30 enrolled in higher secondary, graduation, or professional courses",
      "Household annual income up to ₹2,50,000",
      "Enrolled in a recognised government or UGC/AICTE approved educational institution",
    ],
    documents: [
      "Aadhaar Card",
      "Income Certificate (Current Year)",
      "Residence / Domicile Certificate",
      "Bonafide / Enrollment Certificate from Institution",
      "Previous Year Mark Sheet",
    ],
    incomeMax: 250000,
    ageMin: 15,
    ageMax: 30,
    states: ["All States"],
    questions: [
      "Institution name and AISHE code",
      "Course and current year of study",
      "Previous year academic score / grade",
    ],
    basis: ["Individual"],
    keyBenefit: "100% tuition reimbursement plus annual maintenance allowance up to ₹13,500",
    benefitType: "Direct Benefit Transfer (DBT)",
    targetAudience: "Post-secondary students from economically weaker sections pursuing higher education",
    benefitsSummary: [
      "Full reimbursement of non-refundable tuition and institutional fees directly to student account",
      "Annual maintenance allowance of up to ₹13,500 based on hosteller or day-scholar status",
      "Supplementary allowance for study tour expenses and disability-specific assist devices",
    ],
    howToApply: [
      "Register with Aadhaar and educational institution bonafide certificate",
      "Verification of enrollment by college nodal officer through National Scholarship Portal",
      "District Social Welfare Officer determination and state treasury clearance",
      "Annual disbursement directly into student's Aadhaar-linked bank account",
    ],
    deadlines: "Academic Year 2026-27: Application window open until 30 November 2026",
    status: "Accepting Applications",
  },
  {
    id: "health-cover",
    name: "Family Health Insurance Cover",
    department: "Department of Health & Family Welfare",
    level: "Household",
    category: "Healthcare",
    description:
      "Comprehensive cashless secondary and tertiary inpatient medical cover for eligible families at empanelled hospitals.",
    eligibility: [
      "BPL or low-income household verified in socioeconomic registry",
      "Household listed in state beneficiary database (NFSA / SECC)",
    ],
    documents: [
      "Aadhaar Card (all family members)",
      "Ration Card / BPL Certificate",
      "Residence Certificate",
    ],
    bplRequired: true,
    states: ["All States"],
    householdExclusive: true,
    questions: [
      "Any member with existing chronic or critical illness?",
      "Preferred district for empanelled secondary hospital access",
    ],
    basis: ["Household"],
    keyBenefit: "Cashless health insurance coverage of up to ₹5,00,000 per family per year",
    benefitType: "Healthcare Coverage",
    targetAudience: "Economically vulnerable households requiring secondary and tertiary medical protection",
    benefitsSummary: [
      "Cashless inpatient hospital care up to ₹5,00,000 annually per family with zero copay",
      "Coverage extends to pre-existing conditions from day one across 1,949 medical packages",
      "Portable nationwide across all 28,000+ empanelled public and private healthcare facilities",
    ],
    howToApply: [
      "Check household inclusion in beneficiary registry using Ration Card or Aadhaar",
      "Generate Ayushman digital health card at any empanelled hospital or CSC kiosk",
      "Present digital card at hospital Helpdesk (Aayushman Mitra) for paperless admission",
    ],
    deadlines: "Ongoing entitlement; renewal is automated annually by state health agency",
    status: "Active",
  },
  {
    id: "farmer-support",
    name: "Small Farmer Income Support",
    department: "Department of Agriculture & Farmers Welfare",
    level: "Household",
    category: "Agriculture",
    description:
      "Direct income support of ₹6,000 per annum for small and marginal landholding farmer households to meet farm inputs and domestic needs.",
    eligibility: [
      "Operational cultivable landholding up to 2 hectares recorded in land revenue records",
      "Not an income-tax payer and not holding constitutional post",
    ],
    documents: [
      "Aadhaar Card",
      "Land Ownership Document (Khatauni / Khasra)",
      "Bank Account Passbook / Mandate",
    ],
    property: "land-under-2ha",
    states: ["All States"],
    householdExclusive: true,
    questions: [
      "Khasra / land survey number and sub-division",
      "Crops cultivated in current agricultural season",
      "Irrigation source (canal, tubewell, rainfed)",
    ],
    basis: ["Household", "Property"],
    keyBenefit: "Direct income support of ₹6,000 per year delivered in three four-monthly installments",
    benefitType: "Direct Benefit Transfer (DBT)",
    targetAudience: "Small and marginal operational landholding farmer families across rural jurisdictions",
    benefitsSummary: [
      "Annual financial support of ₹6,000 paid as ₹2,000 every 4 months (April, August, December)",
      "Direct electronic transfer via PFMS directly to verified agricultural bank accounts",
      "Concessional credit access via linked Kisan Credit Card (KCC) scheme",
    ],
    howToApply: [
      "Self-registration through PM-Kisan portal or Block Agriculture Office with land Khasra record",
      "State revenue department authenticates land ownership via Bhulekh registry integration",
      "Aadhaar-based e-KYC validation via OTP or biometric authentication",
      "Installments automatically credited to beneficiary account",
    ],
    deadlines: "Open enrollment; e-KYC mandatory before each disbursement cycle",
    status: "Rolling",
  },
  {
    id: "old-age-pension",
    name: "Old Age Pension",
    department: "Department of Social Welfare",
    level: "Individual",
    category: "Pension",
    description:
      "Statutory monthly social security pension for indigent senior citizens living below poverty threshold.",
    eligibility: [
      "Citizen aged 60 years or above",
      "Household annual income up to ₹1,80,000 (urban) or ₹1,20,000 (rural)",
      "Not recipient of any other regular social pension",
    ],
    documents: [
      "Aadhaar Card",
      "Birth / Age Proof Certificate",
      "Income Certificate",
      "Bank Account Details",
    ],
    incomeMax: 180000,
    ageMin: 60,
    states: ["All States"],
    questions: [
      "Are you currently receiving any other pension from government or EPFO?",
      "Aadhaar-seeded bank account for disbursement",
    ],
    basis: ["Individual"],
    keyBenefit: "Guaranteed monthly social security pension of ₹1,000 to ₹1,500 for senior citizens",
    benefitType: "Monthly Pension",
    targetAudience: "BPL and low-income senior citizens aged 60 and above without adequate familial support",
    benefitsSummary: [
      "Monthly pension of ₹1,000 (aged 60-79) and ₹1,500 (aged 80+) transferred on the 1st of every month",
      "Free annual health screenings at primary health centers for enrolled pension holders",
      "Exemption from local municipal service fees and priority bus transit pass",
    ],
    howToApply: [
      "Submit application with age proof, residence record, and household income declaration",
      "Field inquiry by Gram Panchayat Secretary / Ward Officer to confirm living status",
      "Approval by District Social Welfare Committee and generation of Pension PPO ID",
      "Monthly credit via DBT with annual digital life certificate (Jeevan Pramaan) submission",
    ],
    deadlines: "Continuous application cycle; determinations made monthly by district committee",
    status: "Active",
  },
  {
    id: "maternity",
    name: "Maternity Benefit Programme",
    department: "Department of Women & Child Development",
    level: "Individual",
    category: "Women & Child",
    description:
      "Conditional cash incentive for pregnant and lactating mothers towards wage compensation and maternal nutrition.",
    eligibility: [
      "Pregnant woman aged 19 or above for first living child",
      "Registration of pregnancy at an Anganwadi Centre or government health facility",
    ],
    documents: [
      "Aadhaar Card (Mother and Spouse)",
      "Mother & Child Protection (MCP) Card",
      "Individual Bank Passbook of Mother",
    ],
    ageMin: 19,
    gender: "Female",
    states: ["All States"],
    questions: [
      "Expected date of delivery (EDD) per medical record",
      "Registered Anganwadi Centre / primary health facility",
    ],
    basis: ["Individual"],
    keyBenefit: "Cash incentive of ₹5,000 in three tranches for institutional delivery and immunization",
    benefitType: "Direct Benefit Transfer (DBT)",
    targetAudience: "Pregnant women and lactating mothers for the first living child of the family",
    benefitsSummary: [
      "First installment of ₹1,000 upon early registration of pregnancy at Anganwadi / Health Center",
      "Second installment of ₹2,000 after 6 months of pregnancy with at least one antenatal check-up",
      "Third installment of ₹2,000 after child birth registration and completion of first cycle of vaccination",
    ],
    howToApply: [
      "Register at nearest Anganwadi Centre (AWC) or approved health facility within 150 days of LMP",
      "Submit Mother and Child Protection (MCP) card and Aadhaar details of self and spouse",
      "Field validation by ASHA / Anganwadi worker for each milestone trigger",
      "Direct treasury transfer to woman's individual bank account",
    ],
    deadlines: "Application must be filed within 730 days from date of LMP",
    status: "Active",
  },
  {
    id: "job-card",
    name: "Rural Employment Job Card",
    department: "Department of Rural Development",
    level: "Household",
    category: "Employment",
    description:
      "Statutory entitlement guaranteeing 100 days of unskilled wage work per financial year to every rural household.",
    eligibility: [
      "Rural household resident within the Gram Panchayat jurisdiction",
      "Adult members willing to undertake unskilled manual labor",
    ],
    documents: [
      "Aadhaar Card (all adult applicants)",
      "Proof of Local Residence",
      "Joint / Family Passport-size Photograph",
    ],
    states: ["All States"],
    householdExclusive: true,
    questions: [
      "Number of adult household members willing to undertake manual work",
      "Preferred work location / Gram Panchayat ward",
    ],
    basis: ["Household"],
    keyBenefit: "Statutory guarantee of 100 days of wage employment per financial year for rural households",
    benefitType: "In-kind Assistance",
    targetAudience: "Every rural household whose adult members volunteer to do unskilled manual work",
    benefitsSummary: [
      "100 days of guaranteed wage employment at statutory state daily minimum wage (₹240 - ₹357/day)",
      "Unemployment allowance payable if employment is not provided within 15 days of application",
      "Creation of durable community assets (water conservation, rural roads, plantation, land development)",
    ],
    howToApply: [
      "Submit written or oral application to local Gram Panchayat with family photograph and Aadhaar",
      "Gram Panchayat issues laminated Job Card with photo within 15 days of verification",
      "Demand for work submitted on Form 4; dated receipt issued with work allocation date",
      "Bi-weekly wage transfer directly into post office or bank account",
    ],
    deadlines: "Statutory right available year-round upon demand",
    status: "Active",
  },
  {
    id: "sanitation",
    name: "Village Household Sanitation Support",
    department: "Department of Drinking Water & Sanitation",
    level: "Household",
    category: "Rural Development",
    description:
      "Incentive grant for construction of an individual household sanitary latrine (IHHL) to eliminate open defecation.",
    eligibility: [
      "Rural household without an existing functional sanitary toilet",
      "No prior sanitation subsidy received under Central or State rural missions",
    ],
    documents: [
      "Aadhaar Card",
      "Residence Certificate",
      "Bank Account Passbook",
    ],
    states: ["Uttar Pradesh", "Bihar", "Maharashtra", "West Bengal"],
    householdExclusive: true,
    questions: [
      "Is adequate homestead space available for twin-pit construction?",
      "Availability of water connection within 50 metres",
    ],
    basis: ["Household", "Property"],
    keyBenefit: "Incentive grant of ₹12,000 for construction of Individual Household Latrine (IHHL)",
    benefitType: "Subsidy / Grant",
    targetAudience: "Rural households having no sanitary latrine within premises",
    benefitsSummary: [
      "Direct financial incentive of ₹12,000 paid upon completion of twin-pit pour-flush toilet",
      "Free technical design drawings and mason training facilitated by Gram Panchayat",
      "Water and sanitation safety certification issued by Block Development Office",
    ],
    howToApply: [
      "Apply online via SBM portal or through village Swachhagrahi coordinator",
      "Initial baseline survey confirms absence of sanitary toilet at dwelling",
      "Geo-tagged photo upload of constructed sub-structure and completed superstructure",
      "Direct DBT transfer of ₹12,000 released upon verification",
    ],
    deadlines: "Open until Gram Panchayat achieves certified ODF-Plus status",
    status: "Accepting Applications",
  },
  {
    id: "widow-pension",
    name: "Widow Pension Scheme",
    department: "Department of Social Welfare",
    level: "Individual",
    category: "Social Welfare",
    description:
      "Statutory monthly subsistence pension and social support for destitute and low-income widowed women.",
    eligibility: [
      "Widowed woman aged 18 years or above",
      "Household annual income up to ₹2,00,000",
      "Death certificate of deceased spouse available on civil registration record",
      "Not remarried and not receiving family pension from formal employer",
    ],
    documents: [
      "Aadhaar Card",
      "Death Certificate of Spouse",
      "Income Certificate",
      "Bank Account Passbook",
    ],
    incomeMax: 200000,
    ageMin: 18,
    gender: "Female",
    states: ["All States"],
    questions: [
      "Date of spouse's demise per civil registration record",
      "Are you remarried or receiving any dependent family pension?",
    ],
    basis: ["Individual"],
    keyBenefit: "Monthly subsistence pension of ₹1,000 for destitute and low-income widows",
    benefitType: "Monthly Pension",
    targetAudience: "Widows aged 18 and above whose household income is below statutory threshold",
    benefitsSummary: [
      "Monthly pension of ₹1,000 credited directly into beneficiary savings bank account",
      "Priority allotment under public housing and food distribution (Antyodaya ration card)",
      "Educational fee waiver for dependent children studying in government institutions",
    ],
    howToApply: [
      "Apply with husband's death certificate, age verification, and household income proof",
      "Verification by Lekhpal / Revenue Inspector within 15 working days",
      "Sanction by Sub-Divisional Magistrate (SDM) / District Social Welfare Officer",
      "Pension credited monthly with automated DBT notification",
    ],
    deadlines: "Continuous enrollment cycle",
    status: "Active",
  },
];

export const getScheme = (id: string) => SCHEMES.find((s) => s.id === id);

export const CITIZEN = {
  id: "P-10482-01",
  name: "Rajesh Sharma",
  dob: "1985-03-12",
  gender: "Male",
  mobile: "+91 98765 43210",
  email: "demo.citizen@mira.demo",
  aadhaarMasked: "XXXX XXXX 4821",
  address:
    "House No. 42, Ward 7, Civil Lines, Demo District, Uttar Pradesh – 201001",
  householdId: "MIRA-FAM-10482",
};

export const HOUSEHOLD = {
  id: "MIRA-FAM-10482",
  address: CITIZEN.address,
  status: "Verified" as const,
  bpl: "Priority Rural Household (BPL Eligible)",
  income: "Below ₹2,00,000 per year (Declared: ₹1,72,000)",
  annualIncome: 172000,
  property:
    "Plot 42/Ward 7 on 0.18 ha residential/agricultural land (verified in Bhulekh)",
  registeredOn: "2010-02-14",
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
    id: "P-10482-01",
    name: "Rajesh Sharma",
    relationship: "Head of Household",
    dob: "1985-03-12",
    gender: "Male",
    identity: "Verified",
    membership: "Active",
    income: "Declared household income ₹1,72,000 / yr",
    benefits: ["Rural Employment Job Card", "Family Health Insurance Cover"],
    history: [
      { date: "1988-07-24", event: "Marriage recorded with Sunita Sharma" },
      { date: "2010-02-14", event: "Sharma Family household registered" },
    ],
  },
  {
    id: "P-10482-02",
    name: "Sunita Sharma",
    relationship: "Spouse",
    dob: "1988-07-24",
    gender: "Female",
    identity: "Verified",
    membership: "Active",
    income: "Homemaker",
    benefits: [],
    history: [
      { date: "1988-07-24", event: "Marriage recorded with Rajesh Sharma" },
    ],
  },
  {
    id: "P-10482-19",
    name: "Ananya Sharma",
    relationship: "Daughter",
    dob: "2012-05-18",
    gender: "Female",
    identity: "Verified",
    membership: "Active",
    benefits: ["Post-Matric Scholarship"],
    history: [{ date: "2012-05-18", event: "Birth registered" }],
  },
  {
    id: "P-10482-20",
    name: "Aarav Sharma",
    relationship: "Son",
    dob: "2016-09-10",
    gender: "Male",
    identity: "Pending",
    membership: "Active",
    benefits: [],
    history: [{ date: "2016-09-10", event: "Birth registered" }],
  },
  {
    id: "P-10482-03",
    name: "Devraj Sharma",
    relationship: "Father",
    dob: "1938-04-10",
    gender: "Male",
    identity: "Verified",
    membership: "Active",
    benefits: ["Old Age Pension"],
    history: [{ date: "2010-02-14", event: "Added to Sharma Family household" }],
  },
  {
    id: "P-10482-04",
    name: "Kamala Sharma",
    relationship: "Mother",
    dob: "1941-08-15",
    gender: "Female",
    identity: "Verified",
    membership: "Deceased",
    benefits: [],
    history: [{ date: "2010-02-14", event: "Added to Sharma Family household" }],
  },
  {
    id: "P-10482-05",
    name: "Meena Sharma",
    relationship: "Aunt",
    dob: "1960-11-04",
    gender: "Female",
    identity: "Verified",
    membership: "Former",
    benefits: [],
    history: [{ date: "2010-02-14", event: "Added to Sharma Family household" }],
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
  assignedTo?: string;
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
    applicant: "Rajesh Sharma",
    citizenId: "P-10482-01",
    householdId: "MIRA-FAM-10482",
    appliedOn: "2026-09-04",
    updatedOn: "2026-10-22",
    status: "Additional Evidence Required",
    stage: 6,
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
        by: "Rajesh Sharma",
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
      {
        date: "2026-10-22 14:35",
        text: "Updated income certificate requested after field review",
        by: "Vikram Malhotra (Verification Officer)",
      },
    ],
  },
  {
    id: "APP-2026-000207",
    schemeId: "post-matric",
    applicant: "Ananya Sharma",
    citizenId: "P-10482-19",
    householdId: "MIRA-FAM-10482",
    appliedOn: "2026-07-18",
    updatedOn: "2026-08-22",
    status: "Approved",
    stage: 6,
    declaredIncome: 120000,
    events: [
      {
        date: "2026-07-18 09:00",
        text: "Application submitted",
        by: "Rajesh Sharma (guardian)",
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
        note: "Enrollment confirmed with school.",
      by: "A. Mishra",
      date: "2026-08-21",
    },
  },
  {
    id: "APP-2026-000412",
    schemeId: "health-cover",
    applicant: "Rajesh Sharma",
    citizenId: "P-10482-01",
    householdId: "MIRA-FAM-10482",
    appliedOn: "2026-10-01",
    updatedOn: "2026-10-12",
    status: "Additional Evidence Required",
    stage: 1,
    declaredIncome: 120000,
    events: [
      {
        date: "2026-10-01 13:10",
        text: "Application submitted",
        by: "Rajesh Sharma",
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
    applicant: "Rajesh Sharma",
    citizenId: "P-10482-01",
    householdId: "MIRA-FAM-10482",
    appliedOn: "2026-10-10",
    updatedOn: "2026-10-18",
    status: "Officer Review",
    stage: 4,
    declaredIncome: 120000,
    events: [
      {
        date: "2026-10-10 10:00",
        text: "Application submitted",
        by: "Rajesh Sharma",
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
    applicant: "Rajesh Sharma",
    citizenId: "P-10482-01",
    householdId: "MIRA-FAM-10482",
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
  schemeId: string;
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
  entitlementDescription?: string;
  decisionRef?: string;
}
export const BENEFITS: Benefit[] = [
  {
    ref: "BEN-UP-2019-55120",
    schemeId: "job-card",
    scheme: "Rural Employment Job Card",
    beneficiary: "Household MIRA-FAM-10482",
    type: "Household",
    approvedOn: "2019-12-05",
    status: "Active",
    department: "Department of Rural Development",
    amount: 34500,
    currency: "INR",
    applicationId: "APP-2019-001042",
    validTo: "2027-03-31",
    entitlementDescription: "100 days statutory wage employment per financial year at state notified rate",
    decisionRef: "DEC-RD-2019-5512",
  },
  {
    ref: "BEN-UP-2020-11823",
    schemeId: "old-age-pension",
    scheme: "Old Age Pension",
    beneficiary: "Kamala Sharma",
    type: "Individual",
    approvedOn: "2020-02-14",
    status: "Active",
    department: "Department of Social Welfare",
    amount: 1000,
    currency: "INR",
    applicationId: "APP-2020-003819",
    validTo: "Ongoing (Annual Life Certificate Verified)",
    entitlementDescription: "Monthly direct pension deposit of ₹1,000 on 1st of every calendar month",
    decisionRef: "DEC-SW-2020-1182",
  },
  {
    ref: "BEN-UP-2020-11907",
    schemeId: "widow-pension",
    scheme: "Widow Pension Scheme",
    beneficiary: "Kamala Sharma",
    type: "Individual",
    approvedOn: "2020-03-02",
    status: "Active",
    department: "Department of Social Welfare",
    amount: 1000,
    currency: "INR",
    applicationId: "APP-2020-004102",
    validTo: "Ongoing (Annual Life Certificate Verified)",
    entitlementDescription: "Monthly subsistence pension of ₹1,000 with priority public food ration allocation",
    decisionRef: "DEC-SW-2020-1190",
  },
  {
    ref: "BEN-UP-2022-40018",
    schemeId: "health-cover",
    scheme: "Family Health Insurance Cover",
    beneficiary: "Household MIRA-FAM-10482",
    type: "Household",
    approvedOn: "2022-06-10",
    status: "Active",
    department: "Department of Health & Family Welfare",
    amount: 500000,
    currency: "INR",
    applicationId: "APP-2022-008129",
    validTo: "2027-03-31",
    entitlementDescription: "Cashless secondary and tertiary hospitalisation cover up to ₹5,00,000 per family per year",
    decisionRef: "DEC-HF-2022-4001",
  },
  {
    ref: "BEN-UP-2026-70231",
    schemeId: "post-matric",
    scheme: "Post-Matric Scholarship",
    beneficiary: "Ananya Sharma",
    type: "Individual",
    approvedOn: "2026-08-21",
    status: "Disbursed",
    department: "Department of Social Justice & Empowerment",
    amount: 18500,
    currency: "INR",
    applicationId: "APP-2026-000207",
    validTo: "2027-06-30",
    entitlementDescription: "Full tuition reimbursement ₹12,000 plus maintenance allowance ₹6,500 credited via PFMS DBT",
    decisionRef: "DEC-SJ-2026-7023",
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
    body: "Scholarship disbursement initiated for Ananya Sharma.",
    date: "2026-08-22",
    read: true,
    link: "/citizen/benefits",
  },
  {
    id: "n7",
    title: "Family record update verified",
    body: "Household identity verification for Kamala Sharma is complete.",
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
    next: "Additional Evidence Required",
    reason: "Current income evidence needs verification for MIRA-FAM-10482",
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
    actor: "Rajesh Sharma (P-10482-01)",
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
    appId: "APP-2026-000318",
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
    applicant: "Rajesh Sharma",
    household: "MIRA-FAM-10482",
    match:
      "Prior Rural Housing Assistance benefit found in a linked legacy household record",
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
        current: "MIRA-FAM-10482",
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
    name: "Aadhaar_Rajesh_Sharma.pdf",
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
  schemeId?: string;
  schemeName?: string;
  caseType?: "clarification" | "evidence_request" | "field_visit" | "decision" | "escalation" | "general";
  caseStatus?:
    | "awaiting_citizen"
    | "awaiting_verification"
    | "evidence_requested"
    | "field_visit_scheduled"
    | "under_review"
    | "escalated"
    | "verified"
    | "resolved"
    | "approved"
    | "rejected"
    | "informational";
  actionRequired?: string;
  actionType?: "upload_document" | "confirm_visit" | "review_evidence" | "clarification" | "none";
  requestedDocType?: string;
  currentStage?: string;
  deadline?: string;
  householdId?: string;
  auditRef?: string;
  tags?: string[];
  messages: MailMessage[];
}

export const SEED_MESSAGES: MessageThread[] = [
  {
    id: "MSG-2026-900",
    subject: "Income Certificate Clarification: Illegible Issuing Stamp",
    sender: {
      name: "Neha Verma",
      email: "verifier@mira.local",
      role: "verifier",
      department: "Social Welfare Verification Cell",
    },
    recipient: {
      name: "Rajesh Sharma",
      email: "demo.citizen@mira.demo",
      role: "citizen",
    },
    preview: "Please upload a clearer copy of your income certificate. The seal of the Revenue Inspector is partially blurred.",
    timestamp: "2026-10-22 14:30",
    status: "unread",
    isStarred: true,
    folder: "inbox",
    applicationId: "APP-2026-000318",
    schemeId: "rural-housing",
    schemeName: "Rural Housing Assistance Scheme",
    caseType: "evidence_request",
    caseStatus: "awaiting_citizen",
    actionRequired: "Upload clearer income certificate",
    actionType: "upload_document",
    requestedDocType: "Income Certificate",
    currentStage: "Document Verification",
    deadline: "Nov 02, 2026",
    householdId: "MIRA-FAM-10482",
    auditRef: "AUD-UP-2026-0920",
    tags: ["Action Required", "Evidence"],
    messages: [
      {
        id: "M-0",
        senderName: "Neha Verma",
        senderEmail: "verifier@mira.local",
        senderRole: "verifier",
        timestamp: "2026-10-22 14:30",
        body: "Namaste Rajesh Sharma ji, during verification of application APP-2026-000318 for Rural Housing Assistance, the current income certificate needs confirmation. Please upload a current copy so the application can move to the next review stage.",
        attachments: [
          {
            id: "att-0",
            name: "income_certificate_deficiency_memo.pdf",
            size: 154000,
            type: "application/pdf",
          },
        ],
      },
    ],
  },
  {
    id: "MSG-2026-901",
    subject: "Address Proof Verification for APP-2026-000318",
    sender: {
      name: "Vikram Malhotra",
      email: "demo.verifier@mira.demo",
      role: "verifier",
      department: "Social Welfare Verification Cell",
    },
    recipient: {
      name: "Rajesh Sharma",
      email: "demo.citizen@mira.demo",
      role: "citizen",
    },
    preview: "Utility bill confirmed. Consumer address matches municipal feeder line and resolves the address variation note.",
    timestamp: "2026-01-15 16:30",
    status: "read",
    isStarred: true,
    folder: "inbox",
    applicationId: "APP-2026-000318",
    schemeId: "rural-housing",
    schemeName: "Rural Housing Assistance Scheme",
    caseType: "clarification",
    caseStatus: "resolved",
    currentStage: "Document Verification",
    householdId: "MIRA-FAM-10482",
    auditRef: "AUD-UP-2026-0921",
    tags: ["Evidence"],
    messages: [
      {
        id: "M-1",
        senderName: "Vikram Malhotra",
        senderEmail: "demo.verifier@mira.demo",
        senderRole: "verifier",
        timestamp: "2026-01-14 11:00",
        body: "Namaste Rajesh ji, the address check for your household record is complete. The submitted residence proof matches the municipal ward record.",
        attachments: [
          {
            id: "att-1",
            name: "evidence_request_notice.pdf",
            size: 142000,
            type: "application/pdf",
          },
        ],
      },
      {
        id: "M-1-REPLY",
        senderName: "Rajesh Sharma",
        senderEmail: "demo.citizen@mira.demo",
        senderRole: "citizen",
        timestamp: "2026-01-15 14:20",
        body: "Respected Vikram ji, I have uploaded our latest electricity bill (UPPCL-2026-99214) issued last month, which clearly bears our correct residential address at House No. 42, Ward 7, Demo District. Please check and let me know if any further document is needed.",
        attachments: [
          {
            id: "att-2",
            name: "Electricity_Utility_Bill_Latest.pdf",
            size: 198000,
            type: "application/pdf",
          },
        ],
      },
      {
        id: "M-1-FINAL",
        senderName: "Vikram Malhotra",
        senderEmail: "demo.verifier@mira.demo",
        senderRole: "verifier",
        timestamp: "2026-01-15 16:30",
        body: "Rajesh ji, thank you for providing the utility bill. The consumer address matches the municipal feeder line and resolves the address variation note. We are updating the application record accordingly.",
      },
    ],
  },
  {
    id: "MSG-2026-902",
    subject: "Field Verification Inspection Scheduled: Ward 7, Demo District",
    sender: {
      name: "Priya Sharma",
      email: "officer@mira.local",
      role: "officer",
      department: "District Field Verification Unit",
    },
    recipient: {
      name: "Rajesh Sharma",
      email: "demo.citizen@mira.demo",
      role: "citizen",
    },
    preview: "Physical dwelling inspection scheduled for verification of rural sanitation dwelling status.",
    timestamp: "2026-10-23 10:15",
    status: "unread",
    isStarred: false,
    folder: "inbox",
    applicationId: "APP-2026-000470",
    schemeId: "sanitation",
    schemeName: "Rural Sanitation Dwelling Assistance",
    caseType: "field_visit",
    caseStatus: "field_visit_scheduled",
    actionRequired: "Confirm dwelling inspection presence",
    actionType: "confirm_visit",
    currentStage: "Field Inspection",
    deadline: "Oct 28, 2026",
    householdId: "MIRA-FAM-10482",
    auditRef: "AUD-UP-2026-0922",
    tags: ["Action Required", "Field Visit", "Schedule"],
    messages: [
      {
        id: "M-2",
        senderName: "Priya Sharma",
        senderEmail: "officer@mira.local",
        senderRole: "officer",
        timestamp: "2026-10-23 10:15",
        body: "Hello Rajesh ji, this is Field Official Priya Sharma from the District Field Verification Unit. We will conduct an on-site inspection for your sanitation assistance draft (APP-2026-000470) on October 24 between 10:00 AM and 1:00 PM. Please have identity proofs and property boundary papers ready.",
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
    preview: "Sharma Family register synchronized for MIRA-FAM-10482.",
    timestamp: "2026-10-20 16:45",
    status: "read",
    isStarred: false,
    folder: "inbox",
    applicationId: "APP-2026-000318",
    schemeId: "rural-housing",
    schemeName: "Rural Housing Assistance Scheme",
    caseType: "clarification",
    caseStatus: "under_review",
    currentStage: "Statutory Rule Adjudication",
    householdId: "MIRA-FAM-10482",
    auditRef: "AUD-UP-2026-0923",
    tags: ["Operations"],
    messages: [
      {
        id: "M-3",
        senderName: "Arjun Mehta",
        senderEmail: "admin@mira.local",
        senderRole: "admin",
        timestamp: "2026-10-20 16:45",
        body: "Neha, the registry reconciliation for Sharma Family (MIRA-FAM-10482) completed. The current income evidence request is open for application APP-2026-000318.",
      },
    ],
  },
  {
    id: "MSG-2026-904",
    subject: "Updated BPL Certificate Requested: Family Health Insurance Cover",
    sender: {
      name: "Sunita Verma",
      email: "demo.scheme@mira.demo",
      role: "scheme",
      department: "State Health Assurance Mission",
    },
    recipient: {
      name: "Rajesh Sharma",
      email: "demo.citizen@mira.demo",
      role: "citizen",
    },
    preview: "Please provide a current BPL certificate before the scheme decision can proceed.",
    timestamp: "2026-10-18 11:20",
    status: "unread",
    isStarred: false,
    folder: "inbox",
    applicationId: "APP-2026-000412",
    schemeId: "health-cover",
    schemeName: "Family Health Insurance Cover",
    caseType: "evidence_request",
    caseStatus: "awaiting_citizen",
    actionRequired: "Upload a current BPL certificate",
    actionType: "upload_document",
    requestedDocType: "BPL Certificate",
    currentStage: "Document Verification",
    householdId: "MIRA-FAM-10482",
    auditRef: "AUD-UP-2026-0924",
    tags: ["Operations"],
    messages: [
      {
        id: "M-4",
        senderName: "Sunita Verma",
        senderEmail: "demo.scheme@mira.demo",
        senderRole: "scheme",
        timestamp: "2026-10-18 11:20",
        body: "Rajesh ji, please upload a current BPL certificate for APP-2026-000412. The previous certificate has expired, so the health cover review is paused until the updated document is verified.",
      },
    ],
  },
  {
    id: "MSG-2026-905",
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
    applicationId: "APP-2026-000318",
    schemeId: "rural-housing",
    schemeName: "Rural Housing Assistance Scheme",
    caseType: "clarification",
    caseStatus: "informational",
    currentStage: "Forensic Audit Sampling",
    householdId: "MIRA-FAM-10482",
    auditRef: "AUD-UP-2026-0925",
    tags: ["Audit"],
    messages: [
      {
        id: "M-5",
        senderName: "Priya Nair",
        senderEmail: "auditor@mira.local",
        senderRole: "auditor",
        timestamp: "2026-10-19 09:30",
        body: "Director Mehta, as part of the statutory quarterly audit under the Public Welfare Transparency Act, please ensure all second-tier supervisor reviews for rural grants sanctioned between July and September are accessible in the read-only audit partition.",
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
    citizenName: "Rajesh Sharma",
    citizenPhone: "+91 98765 43210",
    address: "House No. 42, Ward 7, Rampur, Sadar Tehsil",
    ward: "Ward 7",
    scheduledDate: "2026-10-24",
    scheduledTime: "10:30 AM",
    status: "Today",
    purpose: "Dwelling condition and household co-residence inspection",
    schemeName: "Rural Housing Assistance Scheme",
    dwellingType: "Kutcha",
    checklist: [
      { id: "c1", label: "Verify the applicant's household co-residence", checked: true },
      { id: "c2", label: "Confirm absence of pucca RCC roof dwelling on plot", checked: true },
      { id: "c3", label: "Inspect electricity meter and domestic load (< 1 kW)", checked: false },
      { id: "c4", label: "Verify Khasra land title boundary with neighbouring plots", checked: true },
    ],
    officerNotes: "Household resides in an ancestral thatched/mud dwelling. Applicant and family members were present. High priority for housing review under state guidelines.",
    evidencePhotos: ["/hero/civic-1.jpg", "/hero/civic-2.jpg"],
    citizenConfirmation: {
      confirmed: true,
      signedBy: "Rajesh Sharma",
      timestamp: "2026-10-24 11:15",
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
    applicantName: "Rajesh Sharma",
    decision: "EVIDENCE_REQUESTED",
    decidedBy: "Neha Verma (Verification Officer)",
    officerRole: "VERIFICATION_OFFICER",
    decidedAt: "2026-10-22 14:35",
    justification: "The current income certificate needs confirmation. Updated evidence is required before the next review stage.",
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
    name: "Rajesh Sharma",
    email: "demo.citizen@mira.demo",
    role: "citizen",
    title: "Primary Applicant / Citizen Head",
    department: "Citizen Welfare Services",
    location: "Civil Lines, Demo District, UP",
    phone: "+91 98765 43210",
    householdId: "MIRA-FAM-10482",
    badge: "Verified Citizen",
    avatarSeed: "Rajesh",
    description: "Citizen managing 35-member Sharma family tree, scholarship applications, and benefit tracking.",
    accessScope: "Personal Household Record (MIRA-FAM-10482) & Self Applications",
  },
  officer: {
    name: "Sunita Verma",
    email: "demo.scheme@mira.demo",
    role: "officer",
    title: "Scheme Officer",
    department: "Department of Rural Development & Public Benefits",
    location: "Demo District Administrative Complex",
    phone: "+91 94150 11223",
    badge: "Scheme Officer",
    avatarSeed: "Sunita",
    description: "Reviews verified welfare applications, validates statutory criteria, and sanctions direct benefits.",
    accessScope: "Assigned Welfare Scheme Sanction & Direct Benefit Portfolio",
  },
  verifier: {
    name: "Vikram Malhotra",
    email: "demo.verifier@mira.demo",
    role: "verifier",
    title: "Verification Officer",
    department: "Social Welfare Verification Cell",
    location: "State Secretariat, Uttar Pradesh",
    phone: "+91 94520 33445",
    badge: "Verification Cell",
    avatarSeed: "Vikram",
    description: "Examines OCR extracted certificates, verifies multi-generational family trees, and resolves document discrepancies.",
    accessScope: "State Intake Queue, OCR Extractor & Document Intelligence Workstation",
  },
  supervisor: {
    name: "Dr. Alok Nath",
    email: "demo.supervisor@mira.demo",
    role: "supervisor",
    title: "Senior Supervising Officer",
    department: "Directorate of Social Welfare & Public Benefits",
    location: "State Directorate, Uttar Pradesh",
    phone: "+91 94151 55667",
    badge: "Supervisor Tier-2",
    avatarSeed: "Alok",
    description: "Reviews second-signoff escalations, complex household splits, and exceptional policy appeals.",
    accessScope: "Supervisory Escalation Queue & Exceptional Policy Determination",
  },
  admin: {
    name: "Arjun Mehta",
    email: "demo.admin@mira.demo",
    role: "admin",
    title: "Department Administrator",
    department: "Directorate of Social Welfare & Public Benefits",
    location: "Lucknow, Uttar Pradesh",
    phone: "+91 94151 99881",
    badge: "System Authority",
    avatarSeed: "Arjun",
    description: "Configures welfare schemes, manages eligibility rules, resets demo state, and monitors queues.",
    accessScope: "Department-Wide Scheme Master, Rule Engine & Operational Configuration",
  },
  auditor: {
    name: "Priya Nair",
    email: "demo.auditor@mira.demo",
    role: "auditor",
    title: "Senior Compliance & Audit Officer",
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
