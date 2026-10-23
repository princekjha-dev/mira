import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-state-DFvYNEHf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var s_housing_default = "/assets/s-housing-xtiROwcR.jpg";
var s_agri_default = "/assets/s-agri-BdzWjfF_.jpg";
var s_health_default = "/assets/s-health-B3vo5EJw.jpg";
var s_edu_default = "/assets/s-edu-GgNX94iJ.jpg";
var CATEGORIES = [
	"Housing",
	"Education",
	"Healthcare",
	"Agriculture",
	"Pension",
	"Women & Child",
	"Employment",
	"Rural Development",
	"Social Welfare"
];
var CATEGORY_IMAGE = {
	Housing: s_housing_default,
	Education: s_edu_default,
	Healthcare: s_health_default,
	Agriculture: s_agri_default,
	Pension: s_health_default,
	"Women & Child": s_health_default,
	Employment: s_agri_default,
	"Rural Development": s_housing_default,
	"Social Welfare": s_edu_default
};
var STATES = [
	"All States",
	"Uttar Pradesh",
	"Bihar",
	"Maharashtra",
	"West Bengal",
	"Tamil Nadu",
	"Gujarat",
	"Punjab",
	"Telangana"
];
var SCHEMES = [
	{
		id: "rural-housing",
		name: "Rural Housing Assistance Scheme",
		department: "Department of Rural Development",
		level: "Household",
		category: "Housing",
		description: "Assistance for construction of a pucca house for eligible rural households without adequate housing.",
		eligibility: [
			"Household annual income up to ₹3,00,000",
			"BPL household",
			"No pucca house owned by any household member",
			"No housing benefit previously received by the household"
		],
		documents: [
			"Aadhaar",
			"Income Certificate",
			"BPL Certificate",
			"Residence Certificate",
			"Property / Land Document"
		],
		incomeMax: 3e5,
		bplRequired: true,
		property: "no-pucca-house",
		states: ["All States"],
		householdExclusive: true,
		questions: [
			"Current type of dwelling",
			"Plot ownership status",
			"Have you received land under any government allotment?"
		],
		basis: ["Household", "Property"]
	},
	{
		id: "post-matric",
		name: "Post-Matric Scholarship",
		department: "Department of Social Justice & Empowerment",
		level: "Individual",
		category: "Education",
		description: "Support for students studying at post-matriculation level towards tuition and maintenance.",
		eligibility: [
			"Student aged 15–30",
			"Household annual income up to ₹2,50,000",
			"Enrolled in a recognised institution"
		],
		documents: [
			"Aadhaar",
			"Income Certificate",
			"Residence Certificate",
			"Bonafide / Enrollment Certificate"
		],
		incomeMax: 25e4,
		ageMin: 15,
		ageMax: 30,
		states: ["All States"],
		questions: [
			"Institution name",
			"Course and year of study",
			"Previous year marks (%)"
		],
		basis: ["Individual"]
	},
	{
		id: "health-cover",
		name: "Family Health Insurance Cover",
		department: "Department of Health & Family Welfare",
		level: "Household",
		category: "Healthcare",
		description: "Cashless hospital treatment cover for eligible households at empanelled hospitals.",
		eligibility: ["BPL household", "Household listed in state beneficiary registry"],
		documents: [
			"Aadhaar",
			"BPL Certificate",
			"Residence Certificate"
		],
		bplRequired: true,
		states: ["All States"],
		householdExclusive: true,
		questions: ["Any member with chronic illness?", "Preferred empanelled hospital district"],
		basis: ["Household"]
	},
	{
		id: "farmer-support",
		name: "Small Farmer Income Support",
		department: "Department of Agriculture & Farmers Welfare",
		level: "Household",
		category: "Agriculture",
		description: "Periodic income support for small and marginal farmer households holding cultivable land.",
		eligibility: ["Cultivable land up to 2 hectares in household name", "Not an income-tax payer"],
		documents: [
			"Aadhaar",
			"Property / Land Document",
			"Bank Passbook"
		],
		property: "land-under-2ha",
		states: ["All States"],
		householdExclusive: true,
		questions: [
			"Khasra / survey number",
			"Crops cultivated last season",
			"Irrigation source"
		],
		basis: ["Household", "Property"]
	},
	{
		id: "old-age-pension",
		name: "Old Age Pension",
		department: "Department of Social Welfare",
		level: "Individual",
		category: "Pension",
		description: "Monthly pension for senior citizens from low-income households.",
		eligibility: ["Age 60 years or above", "Household annual income up to ₹1,80,000"],
		documents: [
			"Aadhaar",
			"Birth Certificate",
			"Income Certificate",
			"Bank Passbook"
		],
		incomeMax: 18e4,
		ageMin: 60,
		states: ["All States"],
		questions: ["Are you receiving any other pension?", "Bank account for disbursement"],
		basis: ["Individual"]
	},
	{
		id: "maternity",
		name: "Maternity Benefit Programme",
		department: "Department of Women & Child Development",
		level: "Individual",
		category: "Women & Child",
		description: "Support for pregnant and lactating women for the first living child, linked to health check-ups.",
		eligibility: ["Woman aged 19 or above", "Registered pregnancy at a government health facility"],
		documents: [
			"Aadhaar",
			"Mother & Child Protection Card",
			"Bank Passbook"
		],
		ageMin: 19,
		gender: "Female",
		states: ["All States"],
		questions: ["Expected date of delivery", "Registered health facility"],
		basis: ["Individual"]
	},
	{
		id: "job-card",
		name: "Rural Employment Job Card",
		department: "Department of Rural Development",
		level: "Household",
		category: "Employment",
		description: "Job card for rural households seeking wage employment under public works.",
		eligibility: ["Rural household", "Adult members willing to do unskilled manual work"],
		documents: [
			"Aadhaar",
			"Residence Certificate",
			"Photograph"
		],
		states: ["All States"],
		householdExclusive: true,
		questions: ["Number of adult members seeking work", "Preferred work location (Gram Panchayat)"],
		basis: ["Household"]
	},
	{
		id: "sanitation",
		name: "Village Household Sanitation Support",
		department: "Department of Drinking Water & Sanitation",
		level: "Household",
		category: "Rural Development",
		description: "Assistance for construction of an individual household toilet in rural areas.",
		eligibility: ["Rural household without a toilet", "No sanitation benefit previously received"],
		documents: [
			"Aadhaar",
			"Residence Certificate",
			"Bank Passbook"
		],
		states: [
			"Uttar Pradesh",
			"Bihar",
			"Maharashtra",
			"West Bengal"
		],
		householdExclusive: true,
		questions: ["Is there space available for construction?"],
		basis: ["Household", "Property"]
	},
	{
		id: "widow-pension",
		name: "Widow Pension Scheme",
		department: "Department of Social Welfare",
		level: "Individual",
		category: "Social Welfare",
		description: "Monthly pension for widowed women from low-income households.",
		eligibility: [
			"Widowed woman aged 18 or above",
			"Household annual income up to ₹2,00,000",
			"Death record of spouse available"
		],
		documents: [
			"Aadhaar",
			"Death Certificate of Spouse",
			"Income Certificate",
			"Bank Passbook"
		],
		incomeMax: 2e5,
		ageMin: 18,
		gender: "Female",
		states: ["All States"],
		questions: ["Date of spouse's death", "Are you remarried?"],
		basis: ["Individual"]
	}
];
var getScheme = (id) => SCHEMES.find((s) => s.id === id);
var CITIZEN = {
	id: "C-1001",
	name: "Sunita Devi",
	dob: "1984-03-12",
	gender: "Female",
	mobile: "98XXXXX210",
	email: "sunita.devi@example.in",
	aadhaarMasked: "XXXX XXXX 4821",
	address: "House 14, Ward 6, Village Rampur, Block Sadar, District Barabanki, Uttar Pradesh – 225001",
	householdId: "HH-UP-0417-2291"
};
var HOUSEHOLD = {
	id: "HH-UP-0417-2291",
	address: CITIZEN.address,
	status: "Verified",
	bpl: "BPL (Priority Household)",
	income: "Below ₹1,50,000 per year",
	annualIncome: 12e4,
	property: "Kutcha house on 0.8 ha ancestral agricultural land (record under verification)",
	registeredOn: "2014-07-02"
};
var MEMBERS = [
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
		history: [{
			date: "2003-05-10",
			event: "Marriage recorded with Ramesh Kumar"
		}, {
			date: "2019-11-02",
			event: "Became head of household"
		}]
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
		history: [{
			date: "2003-05-10",
			event: "Marriage recorded with Sunita Devi"
		}]
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
		history: [{
			date: "2006-01-15",
			event: "Birth registered"
		}]
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
		history: [{
			date: "2012-09-03",
			event: "Birth registered"
		}]
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
		history: [{
			date: "2019-10-18",
			event: "Spouse death recorded (Shiv Prasad)"
		}]
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
		history: [{
			date: "2019-10-18",
			event: "Death record registered"
		}]
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
		history: [{
			date: "2021-03-14",
			event: "Household split — moved to HH-UP-0417-3380"
		}]
	}
];
var STATUSES = [
	"Draft",
	"Submitted",
	"Documents Under Review",
	"Verification Required",
	"Officer Review",
	"Approved",
	"Rejected",
	"Additional Evidence Required"
];
var TIMELINE_STAGES = [
	"Application Submitted",
	"Documents Received",
	"Identity Verification",
	"Family Verification",
	"Eligibility Evaluation",
	"Officer Review",
	"Clarification Requested",
	"Decision",
	"Benefit Processing",
	"Completed"
];
var APPLICATIONS = [
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
		declaredIncome: 12e4,
		duplicate: true,
		mismatch: {
			field: "Annual household income",
			declared: "₹1,20,000",
			document: "₹1,45,000",
			source: "Income Certificate (Tehsil Sadar, 2026)"
		},
		events: [
			{
				date: "2026-09-04 11:20",
				text: "Application submitted",
				by: "Sunita Devi"
			},
			{
				date: "2026-09-06 15:02",
				text: "Documents checked — income value mismatch flagged",
				by: "System validation"
			},
			{
				date: "2026-09-12 10:40",
				text: "Eligibility criteria verified (property pending)",
				by: "System validation"
			},
			{
				date: "2026-10-15 09:12",
				text: "Possible household-level duplicate benefit found",
				by: "Duplicate check"
			}
		]
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
		declaredIncome: 12e4,
		events: [
			{
				date: "2026-07-18 09:00",
				text: "Application submitted",
				by: "Sunita Devi (guardian)"
			},
			{
				date: "2026-07-20 12:30",
				text: "Documents verified",
				by: "System validation"
			},
			{
				date: "2026-08-02 14:00",
				text: "Eligibility verified",
				by: "System validation"
			},
			{
				date: "2026-08-02 14:01",
				text: "No duplicate found",
				by: "Duplicate check"
			},
			{
				date: "2026-08-21 16:45",
				text: "Approved by officer",
				by: "A. Mishra, BDO Sadar"
			},
			{
				date: "2026-08-22 10:00",
				text: "Disbursement initiated",
				by: "Treasury"
			}
		],
		decision: {
			outcome: "Approved",
			reason: "All criteria met",
			note: "Enrollment confirmed with institution.",
			by: "A. Mishra",
			date: "2026-08-21"
		}
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
		declaredIncome: 12e4,
		events: [{
			date: "2026-10-01 13:10",
			text: "Application submitted",
			by: "Sunita Devi"
		}, {
			date: "2026-10-12 11:00",
			text: "Officer requested updated BPL certificate (current one expired)",
			by: "R. Verma, Health Dept."
		}]
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
		declaredIncome: 12e4,
		events: [
			{
				date: "2026-10-10 10:00",
				text: "Application submitted",
				by: "Ramesh Kumar"
			},
			{
				date: "2026-10-11 10:00",
				text: "Documents checked",
				by: "System validation"
			},
			{
				date: "2026-10-14 10:00",
				text: "Eligibility verified",
				by: "System validation"
			},
			{
				date: "2026-10-14 10:01",
				text: "No duplicate found",
				by: "Duplicate check"
			},
			{
				date: "2026-10-18 09:30",
				text: "Assigned to officer for review",
				by: "Workflow"
			}
		]
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
		declaredIncome: 12e4,
		events: []
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
		declaredIncome: 9e4,
		events: [{
			date: "2026-09-20 10:00",
			text: "Application submitted",
			by: "Mohan Lal"
		}]
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
		declaredIncome: 95e3,
		events: [{
			date: "2026-09-28 10:00",
			text: "Application submitted",
			by: "Geeta Yadav"
		}, {
			date: "2026-10-17 10:00",
			text: "Assigned to officer",
			by: "Workflow"
		}]
	}
];
var BENEFITS = [
	{
		ref: "BEN-UP-2019-55120",
		scheme: "Rural Employment Job Card",
		beneficiary: "Household HH-UP-0417-2291",
		type: "Household",
		approvedOn: "2019-12-05",
		status: "Active",
		department: "Department of Rural Development"
	},
	{
		ref: "BEN-UP-2020-11823",
		scheme: "Old Age Pension",
		beneficiary: "Kamla Devi",
		type: "Individual",
		approvedOn: "2020-02-14",
		status: "Active",
		department: "Department of Social Welfare"
	},
	{
		ref: "BEN-UP-2020-11907",
		scheme: "Widow Pension Scheme",
		beneficiary: "Kamla Devi",
		type: "Individual",
		approvedOn: "2020-03-02",
		status: "Active",
		department: "Department of Social Welfare"
	},
	{
		ref: "BEN-UP-2022-40018",
		scheme: "Family Health Insurance Cover",
		beneficiary: "Household HH-UP-0417-2291",
		type: "Household",
		approvedOn: "2022-06-10",
		status: "Completed",
		department: "Department of Health & Family Welfare"
	},
	{
		ref: "BEN-UP-2026-70231",
		scheme: "Post-Matric Scholarship",
		beneficiary: "Pooja Kumari",
		type: "Individual",
		approvedOn: "2026-08-21",
		status: "Disbursed",
		department: "Department of Social Justice & Empowerment"
	}
];
var NOTIFICATIONS = [
	{
		id: "n1",
		title: "Verification required",
		body: "APP-2026-000318: A similar household-level benefit may already exist. You can provide clarification.",
		date: "2026-10-15",
		read: false,
		link: "/citizen/applications/APP-2026-000318"
	},
	{
		id: "n2",
		title: "Evidence requested",
		body: "APP-2026-000412: Please upload a current BPL certificate.",
		date: "2026-10-12",
		read: false,
		link: "/citizen/applications/APP-2026-000412"
	},
	{
		id: "n3",
		title: "Application moved to officer review",
		body: "APP-2026-000455 has been assigned to an officer.",
		date: "2026-10-18",
		read: false,
		link: "/citizen/applications/APP-2026-000455"
	},
	{
		id: "n4",
		title: "Document missing",
		body: "Your draft APP-2026-000470 is missing a Residence Certificate.",
		date: "2026-10-19",
		read: true,
		link: "/citizen/applications/APP-2026-000470"
	},
	{
		id: "n5",
		title: "Application approved",
		body: "APP-2026-000207 (Post-Matric Scholarship) has been approved.",
		date: "2026-08-21",
		read: true
	},
	{
		id: "n6",
		title: "Benefit processed",
		body: "Scholarship disbursement initiated for Pooja Kumari.",
		date: "2026-08-22",
		read: true,
		link: "/citizen/benefits"
	},
	{
		id: "n7",
		title: "Family record update verified",
		body: "Aadhaar seeding for Kamla Devi verified.",
		date: "2026-06-03",
		read: true,
		link: "/citizen/family"
	}
];
var AUDIT = [
	{
		id: "AU-90011",
		ts: "2026-10-18 09:30:12",
		actor: "Workflow engine",
		action: "Application assigned",
		application: "APP-2026-000455",
		prev: "Submitted",
		next: "Officer Review",
		reason: "Auto-assignment by block"
	},
	{
		id: "AU-90007",
		ts: "2026-10-15 09:12:44",
		actor: "Duplicate check",
		action: "Duplicate alert created",
		application: "APP-2026-000318",
		prev: "Eligibility Verified",
		next: "Verification Required",
		reason: "Household lineage match with HH-UP-0417-3380"
	},
	{
		id: "AU-90002",
		ts: "2026-10-12 11:00:05",
		actor: "R. Verma (OFF-UP-3301)",
		action: "Officer requested evidence",
		application: "APP-2026-000412",
		prev: "Documents Under Review",
		next: "Additional Evidence Required",
		reason: "BPL certificate expired on 2026-03-31"
	},
	{
		id: "AU-89870",
		ts: "2026-09-06 15:02:10",
		actor: "Sunita Devi (C-1001)",
		action: "Document uploaded",
		application: "APP-2026-000318",
		prev: "—",
		next: "Income Certificate.pdf",
		reason: "Applicant upload"
	},
	{
		id: "AU-89350",
		ts: "2026-08-22 10:00:00",
		actor: "Treasury",
		action: "Benefit disbursed",
		application: "APP-2026-000207",
		prev: "Approved",
		next: "Disbursed",
		reason: "Scheduled DBT batch"
	},
	{
		id: "AU-89341",
		ts: "2026-08-21 16:45:31",
		actor: "A. Mishra (OFF-UP-2291)",
		action: "Application approved",
		application: "APP-2026-000207",
		prev: "Officer Review",
		next: "Approved",
		reason: "All criteria met"
	},
	{
		id: "AU-89120",
		ts: "2026-07-20 12:30:02",
		actor: "System validation",
		action: "Record verified",
		application: "APP-2026-000207",
		prev: "Documents Under Review",
		next: "Documents Checked",
		reason: "Document fields match registry"
	}
];
var DUPLICATE_ALERTS = [
	{
		id: "DA-2026-10483",
		severity: "Medium",
		appId: "APP-2026-10482",
		scheme: "National Food Security Mission (NFSA Priority Ration)",
		applicant: "Rajesh Sharma",
		household: "MIRA-FAM-10482",
		match: "Potential duplicate detected: Sunita Sharma (Spouse) in active Antyodaya Ration Scheme under legacy district registry",
		reason: "Potential duplicate detected because two applications share matching identity reference and overlapping benefit period under Sharma household. Requires Human-in-the-Loop review.",
		sources: [
			"NFSA Registry Database",
			"Civil Registration System",
			"Municipal Household Survey"
		],
		status: "Investigation Signal",
		compare: [
			{
				field: "Household ID",
				current: "MIRA-FAM-10482",
				existing: "MIRA-FAM-10482 (Pre-unification registry)",
				same: true
			},
			{
				field: "Identity Reference",
				current: "XXXX-XXXX-4821 (Rajesh Sharma)",
				existing: "XXXX-XXXX-4821 (Linked Family Card)",
				same: true
			},
			{
				field: "Family Relationship",
				current: "Rajesh Sharma (Household Head)",
				existing: "Sunita Sharma (Spouse / Card Member)",
				same: false
			},
			{
				field: "Address",
				current: "House No. 42, Ward 7, Demo District",
				existing: "House No. 42, Ward 7, Demo District",
				same: true
			},
			{
				field: "Benefit Period",
				current: "2026-2027 (Active application)",
				existing: "2024-2026 (Expiring legacy entitlement)",
				same: true
			},
			{
				field: "Statutory Rule",
				current: "NFSA Rule 4(b) Single Family Quota",
				existing: "Subsumes prior district card",
				same: false
			}
		]
	},
	{
		id: "DA-2026-0091",
		severity: "High",
		appId: "APP-2026-000318",
		scheme: "Rural Housing Assistance Scheme",
		applicant: "Sunita Devi",
		household: "HH-UP-0417-2291",
		match: "BEN-UP-2019-30412 — Rural Housing Assistance to HH-UP-0417-2291 (pre-split), beneficiary Rajesh Kumar",
		reason: "Household HH-UP-0417-3380 was split from the applicant's household in 2021. A housing benefit was approved in 2019 when both families were one household.",
		sources: [
			"Household lineage register",
			"Benefit registry (Rural Development)",
			"Land records (Tehsil Sadar)"
		],
		status: "Open",
		compare: [
			{
				field: "Household ID",
				current: "HH-UP-0417-2291",
				existing: "HH-UP-0417-2291 (at time of benefit)",
				same: true
			},
			{
				field: "Family relationship",
				current: "Applicant is sister-in-law of prior beneficiary",
				existing: "Rajesh Kumar, then member",
				same: false
			},
			{
				field: "Property",
				current: "Kutcha house, Khasra 214",
				existing: "Pucca house, Khasra 214/2",
				same: false
			},
			{
				field: "Address",
				current: "House 14, Ward 6, Rampur",
				existing: "House 14-A, Ward 6, Rampur",
				same: false
			},
			{
				field: "Benefit",
				current: "Housing assistance (requested)",
				existing: "Housing assistance (completed)",
				same: true
			},
			{
				field: "Scheme",
				current: "Rural Housing Assistance Scheme",
				existing: "Rural Housing Assistance Scheme",
				same: true
			},
			{
				field: "Date",
				current: "2026-09-04",
				existing: "2019-02-11",
				same: false
			}
		]
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
				same: false
			},
			{
				field: "Family relationship",
				current: "No recorded relation",
				existing: "No recorded relation",
				same: true
			},
			{
				field: "Property",
				current: "Khasra 302",
				existing: "Khasra 302",
				same: true
			},
			{
				field: "Address",
				current: "Ward 3, Rampur",
				existing: "Ward 3, Rampur",
				same: true
			},
			{
				field: "Benefit",
				current: "Housing assistance",
				existing: "Housing assistance (pending)",
				same: true
			},
			{
				field: "Scheme",
				current: "Rural Housing Assistance Scheme",
				existing: "Rural Housing Assistance Scheme",
				same: true
			},
			{
				field: "Date",
				current: "2026-09-28",
				existing: "2026-09-15",
				same: false
			}
		]
	}
];
var VAULT = [
	{
		id: "d1",
		name: "Aadhaar_Sunita.pdf",
		type: "Aadhaar",
		size: "412 KB",
		uploaded: "2026-03-02",
		status: "Verified"
	},
	{
		id: "d2",
		name: "Income_Certificate_2026.pdf",
		type: "Income Certificate",
		size: "286 KB",
		uploaded: "2026-09-04",
		status: "Mismatch detected"
	},
	{
		id: "d3",
		name: "BPL_Card_2023.jpg",
		type: "BPL Certificate",
		size: "1.2 MB",
		uploaded: "2023-04-11",
		status: "Expired document"
	},
	{
		id: "d4",
		name: "Residence_Certificate.pdf",
		type: "Residence Certificate",
		size: "198 KB",
		uploaded: "2026-01-20",
		status: "Verified"
	},
	{
		id: "d5",
		name: "Khatauni_214.pdf",
		type: "Property / Land Document",
		size: "904 KB",
		uploaded: "2026-09-04",
		status: "Manual verification required"
	}
];
var fmtDate = (d) => {
	if (!d) return "—";
	return (/* @__PURE__ */ new Date(d.slice(0, 10) + "T00:00:00")).toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
};
var SEED_MESSAGES = [
	{
		id: "MSG-2026-901",
		subject: "Clarification: Income Certificate Document for Application APP-2026-000318",
		sender: {
			name: "Neha Verma",
			email: "verifier@mira.local",
			role: "verifier",
			department: "Social Welfare Verification Cell"
		},
		recipient: {
			name: "Ananya Sharma",
			email: "citizen@mira.local",
			role: "citizen"
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
				attachments: [{
					id: "att-1",
					name: "income_sample_spec.pdf",
					size: 142e3,
					type: "application/pdf"
				}]
			},
			{
				id: "M-1-REPLY",
				senderName: "Ananya Sharma",
				senderEmail: "citizen@mira.local",
				senderRole: "citizen",
				timestamp: "2026-10-22 12:40",
				body: "Respected Neha ji, I have obtained the re-attested income certificate directly from Tehsil Sadar office with the official seal clearly visible on both pages. Kindly confirm if this satisfies the verification requirement.",
				attachments: [{
					id: "att-2",
					name: "attested_income_oct2026.pdf",
					size: 198e3,
					type: "application/pdf"
				}]
			},
			{
				id: "M-1-FINAL",
				senderName: "Neha Verma",
				senderEmail: "verifier@mira.local",
				senderRole: "verifier",
				timestamp: "2026-10-22 14:30",
				body: "Ananya ji, thank you for the prompt re-submission. The revenue seal and Tehsil registration number have been verified against the state database. Your application APP-2026-000318 is now approved for second-stage sanction."
			}
		]
	},
	{
		id: "MSG-2026-902",
		subject: "Field Verification Visit Scheduled: Lucknow Urban Zone 3",
		sender: {
			name: "Ravi Kumar",
			email: "officer@mira.local",
			role: "officer",
			department: "District Welfare Office"
		},
		recipient: {
			name: "Ananya Sharma",
			email: "citizen@mira.local",
			role: "citizen"
		},
		preview: "Physical household inspection scheduled for 24 Oct 2026 between 10:00 AM and 1:00 PM.",
		timestamp: "2026-10-21 11:15",
		status: "read",
		isStarred: false,
		folder: "inbox",
		applicationId: "APP-2026-000318",
		tags: ["Field Visit", "Schedule"],
		messages: [{
			id: "M-2",
			senderName: "Ravi Kumar",
			senderEmail: "officer@mira.local",
			senderRole: "officer",
			timestamp: "2026-10-21 11:15",
			body: "Hello Ananya ji, this is Field Official Ravi Kumar from the District Welfare Office. I have been assigned to verify your household residence and physical dwelling condition for your housing grant application. I will visit House No. 42, Ward 7 tomorrow between 10:00 AM and 1:00 PM. Please have original identity proofs ready for inspection."
		}]
	},
	{
		id: "MSG-2026-903",
		subject: "Household Survey Lineage Attestation Confirmed",
		sender: {
			name: "Arjun Mehta",
			email: "admin@mira.local",
			role: "admin",
			department: "Department of Social Welfare"
		},
		recipient: {
			name: "Neha Verma",
			email: "verifier@mira.local",
			role: "verifier"
		},
		preview: "State family register synchronised for Lucknow district. Household SH-HH-10482 attested.",
		timestamp: "2026-10-20 16:45",
		status: "read",
		isStarred: false,
		folder: "inbox",
		applicationId: "APP-2026-000318",
		tags: ["Operations", "System"],
		messages: [{
			id: "M-3",
			senderName: "Arjun Mehta",
			senderEmail: "admin@mira.local",
			senderRole: "admin",
			timestamp: "2026-10-20 16:45",
			body: "Neha, the automated batch reconciliation with Tehsil Sadar Land Registry completed successfully. Any pending cross-scheme checks on household SH-HH-10482 can now proceed under Rule Version 3.2."
		}]
	},
	{
		id: "MSG-2026-904",
		subject: "Audit Query: High-impact Sanction Sampling for Q3 2026",
		sender: {
			name: "Priya Nair",
			email: "auditor@mira.local",
			role: "auditor",
			department: "Office of the Principal Accountant General"
		},
		recipient: {
			name: "Arjun Mehta",
			email: "admin@mira.local",
			role: "admin"
		},
		preview: "Requesting immutable decision exports for block grants exceeding ₹1,00,000.",
		timestamp: "2026-10-19 09:30",
		status: "read",
		isStarred: true,
		folder: "inbox",
		tags: ["Compliance", "Audit"],
		messages: [{
			id: "M-4",
			senderName: "Priya Nair",
			senderEmail: "auditor@mira.local",
			senderRole: "auditor",
			timestamp: "2026-10-19 09:30",
			body: "Director Mehta, as part of the statutory quarterly audit under the Public Welfare Transparency Act, please ensure all second-tier supervisor reviews for rural housing grants sanctioned between July and September are accessible in the read-only audit partition."
		}]
	}
];
var SEED_COMMENTS = [
	{
		id: "COM-01",
		recordType: "application",
		recordId: "APP-2026-000318",
		author: {
			name: "Neha Verma",
			role: "verifier",
			department: "Verification Cell"
		},
		timestamp: "2026-10-22 11:20",
		text: "Income certificate declared ₹1,40,000, but electricity billing indicates urban tariff connection. @Ravi please check dwelling type during field visit.",
		mentions: ["Ravi"],
		isResolved: false,
		replies: [{
			id: "REP-01-1",
			author: {
				name: "Ravi Kumar",
				role: "officer"
			},
			timestamp: "2026-10-22 13:40",
			text: "Understood @Neha. I have added a physical inspection check for meter installation at House 42, Ward 7.",
			mentions: ["Neha"]
		}]
	},
	{
		id: "COM-02",
		recordType: "application",
		recordId: "APP-2026-000318",
		author: {
			name: "Ananya Sharma",
			role: "citizen"
		},
		timestamp: "2026-10-22 15:05",
		text: "I have uploaded the renewed Tahsildar income certificate with clear official stamp. Please review.",
		mentions: ["Neha"],
		isResolved: true,
		replies: [{
			id: "REP-02-1",
			author: {
				name: "Neha Verma",
				role: "verifier"
			},
			timestamp: "2026-10-22 16:10",
			text: "Document received and authenticated. Thank you Ananya ji."
		}]
	},
	{
		id: "COM-03",
		recordType: "rule",
		recordId: "rural-housing",
		author: {
			name: "Arjun Mehta",
			role: "admin",
			department: "Directorate"
		},
		timestamp: "2026-10-15 10:00",
		text: "Rule version 3.2 raises household annual threshold from ₹1,20,000 to ₹1,50,000 per Cabinet Order 2026/SW-941. @Priya audit note updated.",
		mentions: ["Priya"],
		isResolved: true,
		replies: []
	}
];
var SEED_FIELD_VISITS = [
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
			{
				id: "c1",
				label: "Verify physical co-residence of all 5 household members",
				checked: true
			},
			{
				id: "c2",
				label: "Confirm absence of pucca RCC roof dwelling on plot",
				checked: true
			},
			{
				id: "c3",
				label: "Inspect electricity meter and domestic load (< 1 kW)",
				checked: false
			},
			{
				id: "c4",
				label: "Verify Khasra land title boundary with neighbouring plots",
				checked: true
			}
		],
		officerNotes: "Household resides in ancestral thatched/mud dwelling. Family members present. High priority for pucca housing sanction under state guidelines.",
		evidencePhotos: ["/hero/civic-1.jpg", "/hero/civic-2.jpg"],
		citizenConfirmation: {
			confirmed: true,
			signedBy: "Ananya Sharma",
			timestamp: "2026-10-23 11:15"
		}
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
			{
				id: "c1",
				label: "Inspect Khasra 302 boundary stones",
				checked: false
			},
			{
				id: "c2",
				label: "Verify neighbor partition declaration",
				checked: false
			},
			{
				id: "c3",
				label: "Check prior benefit receipt from Nagar Panchayat",
				checked: false
			}
		],
		officerNotes: "Cross-check plot overlap alert DA-2026-0088 with adjacent household application.",
		evidencePhotos: [],
		citizenConfirmation: { confirmed: false }
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
		checklist: [{
			id: "c1",
			label: "Inspect civil hospital age certificate",
			checked: true
		}, {
			id: "c2",
			label: "Confirm bank account linkage with Aadhaar",
			checked: true
		}],
		officerNotes: "Applicant is 68 years old. Living with dependent spouse. Bank DBT details verified.",
		evidencePhotos: ["/hero/civic-3.jpg"],
		citizenConfirmation: {
			confirmed: true,
			signedBy: "Mohan Lal",
			timestamp: "2026-10-18 11:45"
		}
	}
];
var SEED_FILES = [
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
		versions: [{
			versionNumber: 1,
			filename: "Aadhaar_Card_Rajesh_Sharma.pdf",
			sizeBytes: 348160,
			uploadedBy: "Ananya Sharma",
			uploadedAt: "2026-01-15 10:20",
			reason: "Initial identity verification during citizen onboarding"
		}]
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
		versions: [{
			versionNumber: 2,
			filename: "Income_Certificate_2026_Attested.pdf",
			sizeBytes: 292864,
			uploadedBy: "Ananya Sharma",
			uploadedAt: "2026-10-22 15:00",
			reason: "Uploaded high-resolution attested copy per Officer Neha Verma request"
		}, {
			versionNumber: 1,
			filename: "Income_Certificate_2026_Scan.pdf",
			sizeBytes: 286720,
			uploadedBy: "Ananya Sharma",
			uploadedAt: "2026-09-04 11:30",
			reason: "Original draft upload (seal partially obscured)"
		}]
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
		versions: [{
			versionNumber: 1,
			filename: "Field_Inspection_Dwelling_Photos.zip",
			sizeBytes: 1945600,
			uploadedBy: "Ravi Kumar",
			uploadedAt: "2026-10-23 11:30",
			reason: "Geotagged physical inspection photographic evidence"
		}]
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
		versions: [{
			versionNumber: 1,
			filename: "Land_Record_Khatauni_214.pdf",
			sizeBytes: 925696,
			uploadedBy: "Ananya Sharma",
			uploadedAt: "2026-09-04 11:45",
			reason: "Tehsil certified copy of Khasra land parcel 214"
		}]
	}
];
var SEED_DECISIONS = [
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
		benefitAmount: 1e3,
		auditHash: "SHA256:7f9a2b8c4d1e3f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a"
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
		auditHash: "SHA256:4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b"
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
		auditHash: "SHA256:1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f"
	}
];
var inr = (n) => "₹" + n.toLocaleString("en-IN");
var LANGUAGES = [
	{
		code: "en",
		label: "English"
	},
	{
		code: "hi",
		label: "हिन्दी"
	},
	{
		code: "bn",
		label: "বাংলা"
	},
	{
		code: "mr",
		label: "मराठी"
	},
	{
		code: "ta",
		label: "தமிழ்"
	},
	{
		code: "te",
		label: "తెలుగు"
	},
	{
		code: "gu",
		label: "ગુજરાતી"
	},
	{
		code: "pa",
		label: "ਪੰਜਾਬੀ"
	}
];
var en = {
	accessLabel: "Secure access",
	accessWelcome: "Welcome to the Unified Citizen Welfare Platform",
	accessChoose: "Choose how you want to continue.",
	accessFamily: "One Family. One Connected Record.",
	accessFamilyText: "Secure access to family records, government schemes, documents, benefits and application services.",
	secureRecords: "Secure Records",
	verifiedAccess: "Verified Access",
	transparentServices: "Transparent Services",
	citizenDescription: "Apply for schemes, manage family records, documents and track applications.",
	officerDescription: "Review applications, verify documents and handle flagged cases.",
	adminDescription: "Manage schemes, eligibility rules, workflows and department services.",
	citizenAccess: "Aadhaar-based verification",
	officerAccess: "Official credentials required",
	adminAccess: "Authorized department access",
	changeAccount: "Change account type",
	citizenSignIn: "Citizen Login",
	officerSignIn: "Officer Login",
	adminSignIn: "Department Administrator Login",
	citizenInstruction: "Verify your identity to securely access your family and welfare records.",
	aadhaarNumber: "Aadhaar Number",
	consentVerification: "I consent to identity verification for accessing this service.",
	continueOtp: "Continue with OTP",
	demoCitizen: "Demo Citizen Login",
	demoVerification: "Demo verification only. Not connected to UIDAI. Use OTP 123456.",
	otpInstruction: "Demo OTP for an Aadhaar-linked mobile number ending in •••• 42.",
	resendOtp: "Resend OTP",
	resendIn: "Resend in",
	changeAadhaar: "Change Aadhaar number",
	officerId: "Officer / Employee ID",
	adminId: "Administrator ID",
	department: "Department",
	password: "Password",
	showPassword: "Show password",
	hidePassword: "Hide password",
	showAadhaar: "Show Aadhaar number",
	hideAadhaar: "Hide Aadhaar number",
	rememberOfficer: "Remember Officer ID",
	forgotPassword: "Forgot Password?",
	needHelp: "Need Help?",
	secureLogin: "Secure Login",
	continueSecurely: "Continue Securely",
	signingIn: "Signing in…",
	sendingOtp: "Sending…",
	officerRestricted: "Access restricted to authorized government personnel.",
	adminMonitored: "Administrative access is monitored and recorded.",
	demoOfficer: "Demo: use OFF-UP-2291 and any 8+ character password.",
	demoAdmin: "Demo: any ID and a 6+ character password will work.",
	securityCheck: "Security verification",
	newQuestion: "New question",
	secureConnection: "Secure Connection",
	privacyProtected: "Privacy Protected",
	roleAccess: "Role-Based Access",
	chooseAccess: "Choose Access",
	verifyIdentity: "Verify Identity",
	accessContinue: "Continue",
	aadhaarError: "Enter a valid 12-digit Aadhaar number",
	consentError: "Please give consent to continue",
	otpLengthError: "Enter the 6-digit OTP",
	otpError: "Incorrect OTP. For the demo, use 123456.",
	officerIdError: "Enter a valid Officer ID (format OFF-UP-2291)",
	officerPwError: "Password must be at least 8 characters",
	adminError: "Enter your Administrator ID and a password of at least 6 characters",
	captchaError: "Security check answer is incorrect. Please try again.",
	privacyDemo: "Your Aadhaar number is not stored by this prototype. All access uses demonstration records.",
	govt: "Government of India",
	platform: "Unified Digital Platform for Accessible Public Documentation",
	skip: "Skip to main content",
	accessibility: "Accessibility",
	help: "Help",
	settings: "Settings",
	home: "Home",
	schemes: "Schemes",
	myApplications: "My Applications",
	myFamily: "My Family",
	documents: "Documents",
	benefits: "Benefits",
	track: "Track Application",
	support: "Help & Support",
	login: "Login",
	logout: "Logout",
	notifications: "Notifications",
	profile: "Profile",
	heroLabel: "Unified Citizen Welfare Platform",
	heroTitle: "Your Family Records. Your Schemes. One Trusted Platform.",
	heroTrust: "Connecting citizens, families and public services.",
	heroVisualAlt: "An Indian family across three generations sharing a tablet and documents, with India Gate behind them.",
	heroText: "A secure platform connecting citizen records, household information, documents, scheme eligibility, benefits and application tracking.",
	exploreSchemes: "Explore Schemes",
	officerLogin: "Officer / Department Login",
	quickServices: "Quick Services",
	findSchemes: "Find Government Schemes",
	howItWorks: "How the platform works",
	checkEligibility: "Check Eligibility",
	apply: "Apply",
	viewDetails: "View Details",
	search: "Search",
	submit: "Submit",
	next: "Next",
	back: "Back",
	continueAs: "Continue as",
	citizen: "Citizen",
	officer: "Government Officer",
	admin: "Department Administrator",
	sendOtp: "Send OTP",
	verifyContinue: "Verify & Continue",
	dashboard: "Dashboard",
	grievances: "Grievances",
	language: "Language"
};
var dict = {
	en,
	hi: {
		accessLabel: "सुरक्षित प्रवेश",
		accessWelcome: "एकीकृत नागरिक कल्याण मंच में आपका स्वागत है",
		accessChoose: "चुनें कि आप कैसे आगे बढ़ना चाहते हैं।",
		accessFamily: "एक परिवार। एक जुड़ा हुआ अभिलेख।",
		accessFamilyText: "परिवार के अभिलेख, सरकारी योजनाओं, दस्तावेज़ों, लाभ और आवेदन सेवाओं तक सुरक्षित पहुँच।",
		secureRecords: "सुरक्षित अभिलेख",
		verifiedAccess: "सत्यापित प्रवेश",
		transparentServices: "पारदर्शी सेवाएँ",
		citizenSignIn: "नागरिक लॉगिन",
		officerSignIn: "अधिकारी लॉगिन",
		adminSignIn: "विभाग प्रशासक लॉगिन",
		changeAccount: "खाते का प्रकार बदलें",
		aadhaarNumber: "आधार संख्या",
		department: "विभाग",
		password: "पासवर्ड",
		continueOtp: "ओटीपी के साथ आगे बढ़ें",
		resendOtp: "ओटीपी दोबारा भेजें",
		consentVerification: "मैं इस सेवा तक पहुँचने के लिए पहचान सत्यापन की सहमति देता/देती हूँ।",
		secureLogin: "सुरक्षित लॉगिन",
		continueSecurely: "सुरक्षित रूप से जारी रखें",
		citizenDescription: "योजनाओं के लिए आवेदन करें, परिवार के अभिलेख और दस्तावेज़ सँभालें और आवेदन ट्रैक करें।",
		officerDescription: "आवेदनों की समीक्षा करें, दस्तावेज़ सत्यापित करें और चिह्नित मामलों को सँभालें।",
		adminDescription: "योजनाएँ, पात्रता नियम, कार्यप्रवाह और विभागीय सेवाएँ सँभालें।",
		citizenAccess: "आधार-आधारित सत्यापन",
		officerAccess: "आधिकारिक परिचय आवश्यक",
		adminAccess: "अधिकृत विभागीय प्रवेश",
		chooseAccess: "प्रवेश चुनें",
		verifyIdentity: "पहचान सत्यापित करें",
		accessContinue: "आगे बढ़ें",
		secureConnection: "सुरक्षित कनेक्शन",
		privacyProtected: "गोपनीयता संरक्षित",
		roleAccess: "भूमिका-आधारित प्रवेश",
		govt: "भारत सरकार",
		platform: "सुलभ सार्वजनिक प्रलेखन हेतु एकीकृत डिजिटल मंच",
		skip: "मुख्य सामग्री पर जाएँ",
		accessibility: "सुगम्यता",
		help: "सहायता",
		settings: "सेटिंग्स",
		home: "मुख्य पृष्ठ",
		schemes: "योजनाएँ",
		myApplications: "मेरे आवेदन",
		myFamily: "मेरा परिवार",
		documents: "दस्तावेज़",
		benefits: "लाभ",
		track: "आवेदन ट्रैक करें",
		support: "सहायता एवं समर्थन",
		login: "लॉगिन",
		logout: "लॉगआउट",
		notifications: "सूचनाएँ",
		profile: "प्रोफ़ाइल",
		heroLabel: "एकीकृत नागरिक कल्याण मंच",
		heroTitle: "आपके परिवार के अभिलेख। आपकी योजनाएँ। एक विश्वसनीय मंच।",
		heroText: "एक सुरक्षित मंच जो नागरिक अभिलेख, परिवार की जानकारी, दस्तावेज़, योजना पात्रता, लाभ और आवेदन ट्रैकिंग को जोड़ता है।",
		exploreSchemes: "योजनाएँ देखें",
		officerLogin: "अधिकारी / विभाग लॉगिन",
		quickServices: "त्वरित सेवाएँ",
		findSchemes: "सरकारी योजनाएँ खोजें",
		howItWorks: "मंच कैसे काम करता है",
		checkEligibility: "पात्रता जाँचें",
		apply: "आवेदन करें",
		viewDetails: "विवरण देखें",
		search: "खोजें",
		submit: "जमा करें",
		next: "आगे",
		back: "पीछे",
		continueAs: "इस रूप में जारी रखें",
		citizen: "नागरिक",
		officer: "सरकारी अधिकारी",
		admin: "विभाग प्रशासक",
		sendOtp: "ओटीपी भेजें",
		verifyContinue: "सत्यापित करें और जारी रखें",
		dashboard: "डैशबोर्ड",
		grievances: "शिकायतें",
		language: "भाषा"
	},
	bn: {
		govt: "ভারত সরকার",
		skip: "মূল বিষয়বস্তুতে যান",
		accessibility: "অভিগম্যতা",
		help: "সাহায্য",
		settings: "সেটিংস",
		home: "হোম",
		schemes: "প্রকল্প",
		myApplications: "আমার আবেদন",
		myFamily: "আমার পরিবার",
		documents: "নথি",
		benefits: "সুবিধা",
		track: "আবেদন ট্র্যাক করুন",
		support: "সাহায্য ও সহায়তা",
		login: "লগইন",
		logout: "লগআউট",
		notifications: "বিজ্ঞপ্তি",
		profile: "প্রোফাইল",
		heroLabel: "সমন্বিত নাগরিক কল্যাণ প্ল্যাটফর্ম",
		heroTitle: "আপনার পারিবারিক নথি। আপনার প্রকল্প। একটি বিশ্বস্ত প্ল্যাটফর্ম।",
		exploreSchemes: "প্রকল্প দেখুন",
		quickServices: "দ্রুত পরিষেবা",
		findSchemes: "সরকারি প্রকল্প খুঁজুন",
		checkEligibility: "যোগ্যতা যাচাই করুন",
		apply: "আবেদন করুন",
		viewDetails: "বিস্তারিত দেখুন",
		search: "অনুসন্ধান",
		submit: "জমা দিন",
		next: "পরবর্তী",
		back: "পিছনে",
		continueAs: "হিসেবে চালিয়ে যান",
		citizen: "নাগরিক",
		officer: "সরকারি আধিকারিক",
		admin: "বিভাগীয় প্রশাসক",
		sendOtp: "OTP পাঠান",
		language: "ভাষা"
	},
	mr: {
		govt: "भारत सरकार",
		skip: "मुख्य मजकुराकडे जा",
		accessibility: "सुलभता",
		help: "मदत",
		settings: "सेटिंग्ज",
		home: "मुख्यपृष्ठ",
		schemes: "योजना",
		myApplications: "माझे अर्ज",
		myFamily: "माझे कुटुंब",
		documents: "कागदपत्रे",
		benefits: "लाभ",
		track: "अर्ज ट्रॅक करा",
		support: "मदत व सहाय्य",
		login: "लॉगिन",
		logout: "लॉगआउट",
		notifications: "सूचना",
		profile: "प्रोफाइल",
		heroLabel: "एकात्मिक नागरिक कल्याण व्यासपीठ",
		heroTitle: "तुमच्या कुटुंबाच्या नोंदी. तुमच्या योजना. एक विश्वासार्ह व्यासपीठ.",
		exploreSchemes: "योजना पहा",
		quickServices: "जलद सेवा",
		findSchemes: "सरकारी योजना शोधा",
		checkEligibility: "पात्रता तपासा",
		apply: "अर्ज करा",
		viewDetails: "तपशील पहा",
		search: "शोधा",
		submit: "सादर करा",
		next: "पुढे",
		back: "मागे",
		continueAs: "म्हणून पुढे जा",
		citizen: "नागरिक",
		officer: "शासकीय अधिकारी",
		admin: "विभाग प्रशासक",
		sendOtp: "OTP पाठवा",
		language: "भाषा"
	},
	ta: {
		govt: "இந்திய அரசு",
		skip: "முதன்மை உள்ளடக்கத்திற்குச் செல்",
		accessibility: "அணுகல்தன்மை",
		help: "உதவி",
		settings: "அமைப்புகள்",
		home: "முகப்பு",
		schemes: "திட்டங்கள்",
		myApplications: "எனது விண்ணப்பங்கள்",
		myFamily: "எனது குடும்பம்",
		documents: "ஆவணங்கள்",
		benefits: "பலன்கள்",
		track: "விண்ணப்பத்தைக் கண்காணி",
		support: "உதவி & ஆதரவு",
		login: "உள்நுழை",
		logout: "வெளியேறு",
		notifications: "அறிவிப்புகள்",
		profile: "சுயவிவரம்",
		heroLabel: "ஒருங்கிணைந்த குடிமக்கள் நல தளம்",
		heroTitle: "உங்கள் குடும்பப் பதிவுகள். உங்கள் திட்டங்கள். ஒரே நம்பகமான தளம்.",
		exploreSchemes: "திட்டங்களைக் காண்க",
		quickServices: "விரைவு சேவைகள்",
		findSchemes: "அரசு திட்டங்களைத் தேடு",
		checkEligibility: "தகுதியைச் சரிபார்",
		apply: "விண்ணப்பி",
		viewDetails: "விவரங்கள்",
		search: "தேடு",
		submit: "சமர்ப்பி",
		next: "அடுத்து",
		back: "பின்",
		citizen: "குடிமகன்",
		officer: "அரசு அலுவலர்",
		admin: "துறை நிர்வாகி",
		sendOtp: "OTP அனுப்பு",
		language: "மொழி"
	},
	te: {
		govt: "భారత ప్రభుత్వం",
		skip: "ప్రధాన విషయానికి వెళ్ళండి",
		accessibility: "ప్రాప్యత",
		help: "సహాయం",
		settings: "సెట్టింగ్‌లు",
		home: "హోమ్",
		schemes: "పథకాలు",
		myApplications: "నా దరఖాస్తులు",
		myFamily: "నా కుటుంబం",
		documents: "పత్రాలు",
		benefits: "ప్రయోజనాలు",
		track: "దరఖాస్తు ట్రాక్ చేయండి",
		support: "సహాయం & మద్దతు",
		login: "లాగిన్",
		logout: "లాగౌట్",
		notifications: "నోటిఫికేషన్లు",
		profile: "ప్రొఫైల్",
		heroLabel: "ఏకీకృత పౌర సంక్షేమ వేదిక",
		heroTitle: "మీ కుటుంబ రికార్డులు. మీ పథకాలు. ఒకే విశ్వసనీయ వేదిక.",
		exploreSchemes: "పథకాలు చూడండి",
		quickServices: "త్వరిత సేవలు",
		findSchemes: "ప్రభుత్వ పథకాలు వెతకండి",
		checkEligibility: "అర్హత తనిఖీ",
		apply: "దరఖాస్తు",
		viewDetails: "వివరాలు",
		search: "వెతకండి",
		submit: "సమర్పించు",
		next: "తదుపరి",
		back: "వెనుకకు",
		citizen: "పౌరుడు",
		officer: "ప్రభుత్వ అధికారి",
		admin: "శాఖ నిర్వాహకుడు",
		sendOtp: "OTP పంపండి",
		language: "భాష"
	},
	gu: {
		govt: "ભારત સરકાર",
		skip: "મુખ્ય સામગ્રી પર જાઓ",
		accessibility: "સુલભતા",
		help: "મદદ",
		settings: "સેટિંગ્સ",
		home: "મુખ્ય પૃષ્ઠ",
		schemes: "યોજનાઓ",
		myApplications: "મારી અરજીઓ",
		myFamily: "મારો પરિવાર",
		documents: "દસ્તાવેજો",
		benefits: "લાભો",
		track: "અરજી ટ્રૅક કરો",
		support: "મદદ અને સહાય",
		login: "લૉગિન",
		logout: "લૉગઆઉટ",
		notifications: "સૂચનાઓ",
		profile: "પ્રોફાઇલ",
		heroLabel: "એકીકૃત નાગરિક કલ્યાણ પ્લેટફોર્મ",
		heroTitle: "તમારા પરિવારના રેકોર્ડ. તમારી યોજનાઓ. એક વિશ્વસનીય પ્લેટફોર્મ.",
		exploreSchemes: "યોજનાઓ જુઓ",
		quickServices: "ઝડપી સેવાઓ",
		findSchemes: "સરકારી યોજનાઓ શોધો",
		checkEligibility: "પાત્રતા તપાસો",
		apply: "અરજી કરો",
		viewDetails: "વિગતો જુઓ",
		search: "શોધો",
		submit: "સબમિટ કરો",
		next: "આગળ",
		back: "પાછળ",
		citizen: "નાગરિક",
		officer: "સરકારી અધિકારી",
		admin: "વિભાગ વહીવટકર્તા",
		sendOtp: "OTP મોકલો",
		language: "ભાષા"
	},
	pa: {
		govt: "ਭਾਰਤ ਸਰਕਾਰ",
		skip: "ਮੁੱਖ ਸਮੱਗਰੀ 'ਤੇ ਜਾਓ",
		accessibility: "ਪਹੁੰਚਯੋਗਤਾ",
		help: "ਮਦਦ",
		settings: "ਸੈਟਿੰਗਾਂ",
		home: "ਮੁੱਖ ਪੰਨਾ",
		schemes: "ਯੋਜਨਾਵਾਂ",
		myApplications: "ਮੇਰੀਆਂ ਅਰਜ਼ੀਆਂ",
		myFamily: "ਮੇਰਾ ਪਰਿਵਾਰ",
		documents: "ਦਸਤਾਵੇਜ਼",
		benefits: "ਲਾਭ",
		track: "ਅਰਜ਼ੀ ਟ੍ਰੈਕ ਕਰੋ",
		support: "ਮਦਦ ਅਤੇ ਸਹਾਇਤਾ",
		login: "ਲੌਗਇਨ",
		logout: "ਲੌਗਆਉਟ",
		notifications: "ਸੂਚਨਾਵਾਂ",
		profile: "ਪ੍ਰੋਫਾਈਲ",
		heroLabel: "ਏਕੀਕ੍ਰਿਤ ਨਾਗਰਿਕ ਭਲਾਈ ਪਲੇਟਫਾਰਮ",
		heroTitle: "ਤੁਹਾਡੇ ਪਰਿਵਾਰ ਦੇ ਰਿਕਾਰਡ। ਤੁਹਾਡੀਆਂ ਯੋਜਨਾਵਾਂ। ਇੱਕ ਭਰੋਸੇਮੰਦ ਪਲੇਟਫਾਰਮ।",
		exploreSchemes: "ਯੋਜਨਾਵਾਂ ਵੇਖੋ",
		quickServices: "ਤੇਜ਼ ਸੇਵਾਵਾਂ",
		findSchemes: "ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਲੱਭੋ",
		checkEligibility: "ਯੋਗਤਾ ਜਾਂਚੋ",
		apply: "ਅਰਜ਼ੀ ਦਿਓ",
		viewDetails: "ਵੇਰਵੇ ਵੇਖੋ",
		search: "ਖੋਜੋ",
		submit: "ਜਮ੍ਹਾਂ ਕਰੋ",
		next: "ਅੱਗੇ",
		back: "ਪਿੱਛੇ",
		citizen: "ਨਾਗਰਿਕ",
		officer: "ਸਰਕਾਰੀ ਅਧਿਕਾਰੀ",
		admin: "ਵਿਭਾਗ ਪ੍ਰਸ਼ਾਸਕ",
		sendOtp: "OTP ਭੇਜੋ",
		language: "ਭਾਸ਼ਾ"
	}
};
function translate(lang, key) {
	return dict[lang]?.[key] ?? en[key];
}
var API_BASE = "".replace(/\/$/, "");
var apiUrl = (path) => `${API_BASE}${path}`;
async function apiRequest(sessionOrToken, path, init = {}) {
	const token = typeof sessionOrToken === "string" ? sessionOrToken : sessionOrToken?.apiToken;
	const headers = new Headers(init.headers);
	if (token) headers.set("Authorization", `Bearer ${token}`);
	if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
	const response = await fetch(apiUrl(path), {
		...init,
		headers
	});
	if (!response.ok) {
		const body = await response.json().catch(() => null);
		throw new Error(body?.error?.message || `Request failed (${response.status}). Please retry.`);
	}
	if (response.status === 204) return void 0;
	return response.json();
}
async function loginUser(email, password) {
	let response;
	try {
		response = await fetch(apiUrl("/api/v1/auth/login"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email,
				password
			})
		});
	} catch (error) {
		console.error("Mira authentication request failed", error);
		throw new Error("Connection problem. We couldn't reach Mira. Please try again.");
	}
	const payload = await response.json().catch(() => null);
	if (!response.ok || !payload?.token) throw new Error(response.status === 401 ? "Unable to sign in. Check your access details and try again." : response.status >= 500 ? "Mira is temporarily unavailable. Please try again." : payload?.error?.message || "Unable to sign in. Please try again.");
	return payload;
}
async function registerUser(email, password, displayName) {
	const response = await fetch(apiUrl("/api/v1/auth/register"), {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			email,
			password,
			display_name: displayName,
			preferred_language: "en"
		})
	});
	const payload = await response.json().catch(() => null);
	if (!response.ok || !payload?.token) throw new Error(payload?.error?.message || "Registration failed. Please check your information.");
	return payload;
}
async function getMe(token) {
	return (await apiRequest(token, "/api/v1/auth/me")).data;
}
async function authenticateDemo(role) {
	let response;
	try {
		response = await fetch(apiUrl("/api/v1/auth/demo-login"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ role })
		});
	} catch (error) {
		console.error("Mira demo authentication request failed", error);
		throw new Error("Connection problem. We couldn't reach Mira. Please try again.");
	}
	const payload = await response.json().catch(() => null);
	if (!response.ok || !payload?.token) throw new Error(response.status === 404 || response.status === 403 ? "Demo account unavailable. Please try again later." : response.status >= 500 ? "Mira is temporarily unavailable. Please try again." : payload?.error?.message || "Unable to open this demo account.");
	if (!payload.user.is_demo) throw new Error("Demo account unavailable. Please choose another account.");
	return payload;
}
function mapRoleToUiRole(roles) {
	if (roles.includes("AUDITOR")) return "auditor";
	if (roles.includes("DEPARTMENT_ADMIN")) return "admin";
	if (roles.includes("SUPERVISOR")) return "supervisor";
	if (roles.includes("SCHEME_OFFICER")) return "scheme";
	if (roles.includes("VERIFICATION_OFFICER")) return "verifier";
	if (roles.includes("FIELD_OFFICIAL") || roles.includes("OFFICER")) return "officer";
	return "citizen";
}
function mapBackendAppToFrontend(raw) {
	const meta = raw.metadata || {};
	const statusStr = raw.status || "DRAFT";
	let status = "Draft";
	let stage = 0;
	if (statusStr === "DRAFT") {
		status = "Draft";
		stage = 0;
	} else if (statusStr === "SUBMITTED") {
		status = "Submitted";
		stage = 1;
	} else if (statusStr === "UNDER_VERIFICATION") {
		status = meta.verification_task ? "Verification Required" : "Documents Under Review";
		stage = 2;
	} else if (statusStr === "EVIDENCE_REQUIRED") {
		status = "Additional Evidence Required";
		stage = 3;
	} else if (statusStr === "APPROVED" || statusStr === "DISBURSED") {
		status = "Approved";
		stage = 5;
	} else if (statusStr === "REJECTED") {
		status = "Rejected";
		stage = 5;
	} else {
		status = "Officer Review";
		stage = 4;
	}
	const events = [];
	if (raw.created_at) events.push({
		date: raw.created_at.replace("T", " ").slice(0, 16),
		text: "Application drafted",
		by: raw.applicant_name || "Applicant"
	});
	if (raw.submitted_at) events.push({
		date: raw.submitted_at.replace("T", " ").slice(0, 16),
		text: "Application submitted",
		by: raw.applicant_name || "Applicant"
	});
	if (meta.assignment) events.push({
		date: (meta.assignment.assigned_at || "").replace("T", " ").slice(0, 16),
		text: `Assigned to ${meta.assignment.assigned_to_name || "Officer"}`,
		by: "Assignment Engine"
	});
	if (Array.isArray(meta.evidence_requests)) for (const req of meta.evidence_requests) {
		events.push({
			date: (req.requested_at || "").replace("T", " ").slice(0, 16),
			text: `Evidence requested: ${req.evidence_type} (${req.reason})`,
			by: "Officer"
		});
		if (req.submitted_at) events.push({
			date: req.submitted_at.replace("T", " ").slice(0, 16),
			text: `Evidence submitted: ${req.explanation || "Document attached"}`,
			by: raw.applicant_name || "Applicant"
		});
	}
	if (meta.verification_task) events.push({
		date: (meta.verification_task.verified_at || "").replace("T", " ").slice(0, 16),
		text: `Field verification completed: ${meta.verification_task.findings || "All checks verified"}`,
		by: "Verification Officer"
	});
	if (meta.decision) events.push({
		date: (meta.decision.decided_at || "").replace("T", " ").slice(0, 16),
		text: `Decision: ${meta.decision.decision || "Completed"} - ${meta.decision.reason || ""}`,
		by: meta.decision.decided_by_name || "Approving Authority"
	});
	let decision = void 0;
	if (meta.decision) decision = {
		outcome: meta.decision.decision === "APPROVED" ? "Approved" : "Rejected",
		reason: meta.decision.reason || "Eligibility criteria met",
		note: meta.decision.notes || "",
		by: meta.decision.decided_by_name || "Authorized Officer",
		date: (meta.decision.decided_at || "").slice(0, 10)
	};
	else if (raw.status === "APPROVED") decision = {
		outcome: "Approved",
		reason: "All eligibility conditions and documents verified",
		note: "Standard public assistance approval",
		by: "Competent Authority",
		date: (raw.updated_at || "").slice(0, 10)
	};
	let schemeId = raw.scheme_id;
	if (raw.scheme_code === "SCH_STUDENT_SCHOLARSHIP") schemeId = "post-matric";
	else if (raw.scheme_code === "SCH_HH_SANITATION") schemeId = "sanitation";
	else if (raw.scheme_code === "SCH_WATER_CONNECTION") schemeId = "rural-housing";
	return {
		id: raw.application_number || raw.public_id || raw.id,
		schemeId,
		applicant: raw.applicant_name || "Citizen Applicant",
		citizenId: raw.applicant_person_id || "C-1001",
		householdId: raw.target_household_id || raw.target_household_name || "HH-UP-0417-2291",
		appliedOn: raw.submitted_at ? raw.submitted_at.slice(0, 10) : raw.application_date || "",
		updatedOn: (raw.updated_at || "").slice(0, 10),
		status,
		stage,
		declaredIncome: Number(meta.income || 18e4),
		events: events.length > 0 ? events : [{
			date: (raw.created_at || "").slice(0, 10),
			text: "Application created",
			by: "Citizen"
		}],
		decision,
		metadata: meta,
		rawId: raw.id,
		schemeName: raw.scheme_name
	};
}
function mapBackendNotification(n) {
	let link = void 0;
	if (n.entity_type === "APPLICATION" && n.entity_id) link = `/citizen/applications/${n.entity_id}`;
	return {
		id: n.id,
		title: n.title,
		body: n.message,
		date: (n.created_at || "").slice(0, 10),
		read: n.read,
		link
	};
}
function mapBackendAuditEvent(e) {
	const details = e.details || {};
	return {
		id: e.id ? e.id.slice(0, 10) : "EV-" + Date.now(),
		ts: (e.created_at || "").replace("T", " ").slice(0, 19),
		actor: details.email || (e.user_id ? `User ${e.user_id.slice(0, 8)}` : "System"),
		action: e.event_type || "SYSTEM_EVENT",
		application: details.application_id || details.scheme_code || "-",
		prev: details.previous_status || "-",
		next: details.new_status || details.status || "-",
		reason: details.reason || details.findings || details.notes || "-"
	};
}
function mapBackendBenefit(b) {
	const backendStatus = String(b.status || "").toUpperCase();
	const status = backendStatus === "DISBURSED" ? "Disbursed" : backendStatus === "COMPLETED" ? "Completed" : backendStatus === "SUSPENDED" ? "Suspended" : backendStatus === "REJECTED" ? "Rejected" : backendStatus === "EXPIRED" ? "Expired" : backendStatus === "PENDING" ? "Pending" : backendStatus === "UNDER_REVIEW" ? "Under Review" : backendStatus === "APPROVED" || backendStatus === "ACTIVE" ? "Active" : "Pending";
	return {
		ref: b.public_id || b.id,
		scheme: b.scheme_name || "Scheme name unavailable",
		beneficiary: b.person_name || b.household_name || "Named beneficiary unavailable",
		type: b.benefit_unit_type === "HOUSEHOLD" ? "Household" : "Individual",
		approvedOn: (b.approved_at || b.created_at || "").slice(0, 10),
		status,
		department: b.department_name || b.department || "",
		amount: typeof b.amount === "number" ? b.amount : null,
		currency: b.currency || null,
		applicationId: b.application_id || null,
		validTo: b.valid_to || null
	};
}
async function fetchApplications(session) {
	if (!session?.apiToken) return [];
	return ((await apiRequest(session, "/api/v1/applications")).data || []).map(mapBackendAppToFrontend);
}
async function createBackendApplication(session, schemeId, metadata = {}) {
	return mapBackendAppToFrontend((await apiRequest(session, "/api/v1/applications", {
		method: "POST",
		body: JSON.stringify({
			scheme_id: schemeId,
			metadata
		})
	})).data);
}
async function updateBackendApplication(session, id, payload) {
	return mapBackendAppToFrontend((await apiRequest(session, `/api/v1/applications/${id}`, {
		method: "PATCH",
		body: JSON.stringify(payload)
	})).data);
}
async function submitBackendApplication(session, id) {
	return mapBackendAppToFrontend((await apiRequest(session, `/api/v1/applications/${id}/submit`, { method: "POST" })).data);
}
async function assignBackendApplication(session, id, assignedTo, notes) {
	return mapBackendAppToFrontend((await apiRequest(session, `/api/v1/applications/${id}/assign`, {
		method: "POST",
		body: JSON.stringify({
			assigned_to: assignedTo,
			notes
		})
	})).data);
}
async function requestBackendEvidence(session, id, payload) {
	return mapBackendAppToFrontend((await apiRequest(session, `/api/v1/applications/${id}/request-evidence`, {
		method: "POST",
		body: JSON.stringify(payload)
	})).data);
}
async function submitBackendEvidence(session, id, payload) {
	return mapBackendAppToFrontend((await apiRequest(session, `/api/v1/applications/${id}/submit-evidence`, {
		method: "POST",
		body: JSON.stringify(payload)
	})).data);
}
async function verifyBackendApplication(session, id, payload) {
	return mapBackendAppToFrontend((await apiRequest(session, `/api/v1/applications/${id}/verify`, {
		method: "POST",
		body: JSON.stringify(payload)
	})).data);
}
async function approveBackendApplication(session, id) {
	return (await apiRequest(session, `/api/v1/applications/${id}/approve`, { method: "POST" })).data;
}
async function rejectBackendApplication(session, id, reason, notes) {
	return mapBackendAppToFrontend((await apiRequest(session, `/api/v1/applications/${id}/reject`, {
		method: "POST",
		body: JSON.stringify({
			reason,
			notes
		})
	})).data);
}
async function fetchNotifications(session) {
	if (!session?.apiToken) return [];
	return ((await apiRequest(session, "/api/v1/notifications")).data || []).map(mapBackendNotification);
}
async function markBackendNotificationRead(session, id) {
	await apiRequest(session, `/api/v1/notifications/${id}/read`, { method: "POST" });
}
async function fetchAuditEvents(session, limit = 50) {
	if (!session?.apiToken) return [];
	return ((await apiRequest(session, `/api/v1/audit/events?limit=${limit}`)).data || []).map(mapBackendAuditEvent);
}
async function fetchBenefits(session) {
	if (!session?.apiToken) return [];
	return ((await apiRequest(session, "/api/v1/benefits")).data || []).map(mapBackendBenefit);
}
var encodeBase64 = (file) => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.onerror = () => reject(/* @__PURE__ */ new Error("Unable to read this file."));
	reader.onload = () => {
		const value = String(reader.result);
		resolve(value.slice(value.indexOf(",") + 1));
	};
	reader.readAsDataURL(file);
});
function uploadDocument(session, file, documentType, onProgress, replaceId, originalFile = file) {
	return Promise.all([encodeBase64(file), originalFile !== file && originalFile.size <= 26214400 ? encodeBase64(originalFile) : Promise.resolve("")]).then(([file_content_base64, original_file_content_base64]) => new Promise((resolve, reject) => {
		const request = new XMLHttpRequest();
		request.open("POST", apiUrl(replaceId ? `/api/v1/documents/${replaceId}/replace` : "/api/v1/documents"));
		request.setRequestHeader("Authorization", `Bearer ${session.apiToken || ""}`);
		request.setRequestHeader("Content-Type", "application/json");
		request.upload.onprogress = (event) => onProgress(event.loaded, event.total || file_content_base64.length);
		request.onerror = () => reject(/* @__PURE__ */ new Error("Network connection interrupted. Check your connection and retry."));
		request.onabort = () => reject(/* @__PURE__ */ new Error("Upload interrupted. You can retry this file."));
		request.onload = () => {
			let payload = null;
			try {
				payload = JSON.parse(request.responseText);
			} catch {}
			if (request.status < 200 || request.status >= 300 || !payload?.data) {
				const message = request.status === 401 ? "401 Unauthorized" : request.status === 403 ? "403 Forbidden" : request.status === 413 ? "413 File too large" : request.status === 415 ? "415 Unsupported media type" : request.status === 400 || request.status === 422 ? "422 Validation failed" : request.status >= 500 ? "500 Storage server unavailable" : "The upload service couldn't complete this request. Retry in a moment.";
				reject(new Error(message));
				return;
			}
			resolve(payload.data);
		};
		request.send(JSON.stringify(replaceId ? {
			filename: file.name,
			original_filename: originalFile.name,
			specified_doc_type: documentType,
			file_content_base64,
			original_file_content_base64: original_file_content_base64 || void 0,
			original_file_mime_type: original_file_content_base64 ? originalFile.type : void 0
		} : {
			filename: file.name,
			original_filename: originalFile.name,
			owner_type: "CITIZEN",
			owner_id: session.apiUserId,
			specified_doc_type: documentType,
			access_purpose: "CITIZEN_SELF_SERVICE",
			file_content_base64,
			original_file_content_base64: original_file_content_base64 || void 0,
			original_file_mime_type: original_file_content_base64 ? originalFile.type : void 0
		}));
	}));
}
async function fetchMyFamily(sessionOrToken) {
	return (await apiRequest(sessionOrToken, "/api/v1/profile/family")).data;
}
async function addFamilyMember(sessionOrToken, payload) {
	return (await apiRequest(sessionOrToken, "/api/v1/profile/family/members", {
		method: "POST",
		body: JSON.stringify(payload)
	})).data;
}
async function reportLifeEvent(sessionOrToken, payload) {
	return (await apiRequest(sessionOrToken, "/api/v1/profile/family/events", {
		method: "POST",
		body: JSON.stringify(payload)
	})).data;
}
async function raiseFamilyDispute(sessionOrToken, payload) {
	return (await apiRequest(sessionOrToken, "/api/v1/profile/family/disputes", {
		method: "POST",
		body: JSON.stringify(payload)
	})).data;
}
async function sendMiraAiChat(sessionOrToken, payload) {
	return apiRequest(sessionOrToken, "/api/v1/ai/chat", {
		method: "POST",
		body: JSON.stringify(payload)
	});
}
var initial = {
	lang: "en",
	fontScale: 0,
	highContrast: false,
	reducedMotion: false,
	srMode: false,
	notifPrefs: {
		sms: true,
		email: false,
		app: true
	},
	session: null,
	applications: APPLICATIONS,
	notifications: NOTIFICATIONS,
	audit: AUDIT,
	benefits: BENEFITS,
	alerts: DUPLICATE_ALERTS,
	vault: VAULT,
	messages: SEED_MESSAGES,
	comments: SEED_COMMENTS,
	fieldVisits: SEED_FIELD_VISITS,
	files: SEED_FILES,
	decisions: SEED_DECISIONS,
	grievances: [{
		id: "GRV-2026-01182",
		appId: "APP-2026-000412",
		category: "Delay in processing",
		description: "BPL certificate renewal pending at tehsil.",
		date: "2026-10-13",
		status: "In Progress"
	}],
	familyRequests: [{
		id: "FR-2026-0041",
		type: "Relationship Correction",
		details: "Aman Kumar date of birth correction (2012-09-03)",
		date: "2026-10-05",
		status: "Pending verification"
	}],
	ruleVersions: [{
		version: "v1.0",
		schemeId: "rural-housing",
		effective: "2024-04-01",
		by: "S. Rao (Dept Admin)",
		reason: "Initial rule set",
		conditions: [{
			field: "Household income",
			op: "<",
			value: "250000"
		}, {
			field: "Property condition",
			op: "=",
			value: "No pucca house"
		}]
	}, {
		version: "v1.1",
		schemeId: "rural-housing",
		effective: "2025-04-01",
		by: "S. Rao (Dept Admin)",
		reason: "Income ceiling revised per state notification",
		conditions: [
			{
				field: "Household income",
				op: "<",
				value: "300000"
			},
			{
				field: "Property condition",
				op: "=",
				value: "No pucca house"
			},
			{
				field: "Previous benefit",
				op: "NOT received",
				value: "Rural Housing Assistance"
			}
		]
	}]
};
var EMPTY_ACCOUNT_DATA = {
	applications: [],
	notifications: [],
	audit: [],
	benefits: [],
	alerts: [],
	vault: [],
	grievances: [],
	familyRequests: []
};
var SESSION_KEY = "mira-session-v2";
var UI_PREFS_KEY = "mira-ui-prefs-v1";
var AppCtx = (0, import_react.createContext)(null);
var nowStamp = () => {
	const d = /* @__PURE__ */ new Date();
	const p = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};
function AppStateProvider({ children }) {
	const [state, setState] = (0, import_react.useState)(initial);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [isLoading, setIsLoading] = (0, import_react.useState)(false);
	const sessionRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let savedSession = null;
		try {
			const rawSession = localStorage.getItem(SESSION_KEY);
			if (rawSession) savedSession = JSON.parse(rawSession);
			const rawPrefs = localStorage.getItem(UI_PREFS_KEY);
			if (rawPrefs) {
				const prefs = JSON.parse(rawPrefs);
				setState((s) => ({
					...s,
					...prefs,
					...savedSession ? EMPTY_ACCOUNT_DATA : {},
					session: savedSession
				}));
			} else if (savedSession) setState((s) => ({
				...s,
				...EMPTY_ACCOUNT_DATA,
				session: savedSession
			}));
		} catch {}
		sessionRef.current = savedSession;
		setHydrated(true);
		if (savedSession?.apiToken) getMe(savedSession.apiToken).then((me) => {
			const validatedRole = mapRoleToUiRole(me.roles);
			const validatedSession = {
				...savedSession,
				role: validatedRole,
				name: me.display_name,
				apiEmail: me.email,
				isDemo: me.is_demo
			};
			sessionRef.current = validatedSession;
			setState((s) => ({
				...s,
				session: validatedSession
			}));
			localStorage.setItem(SESSION_KEY, JSON.stringify(validatedSession));
		}).catch(() => {
			sessionRef.current = null;
			setState((s) => ({
				...s,
				...EMPTY_ACCOUNT_DATA,
				session: null
			}));
			localStorage.removeItem(SESSION_KEY);
		});
	}, []);
	const refreshData = (0, import_react.useCallback)(async () => {
		const currentSession = sessionRef.current;
		if (!currentSession?.apiToken) return;
		try {
			setIsLoading(true);
			const [backendApps, backendNotifs, backendAudit, backendBenefits] = await Promise.allSettled([
				fetchApplications(currentSession),
				fetchNotifications(currentSession),
				fetchAuditEvents(currentSession, 50),
				fetchBenefits(currentSession)
			]);
			setState((s) => {
				const nextApplications = backendApps.status === "fulfilled" ? backendApps.value : [];
				const nextNotifications = backendNotifs.status === "fulfilled" ? backendNotifs.value : [];
				const nextAudit = backendAudit.status === "fulfilled" ? backendAudit.value : [];
				const nextBenefits = backendBenefits.status === "fulfilled" ? backendBenefits.value : [];
				return {
					...s,
					applications: nextApplications,
					notifications: nextNotifications,
					audit: nextAudit,
					benefits: nextBenefits
				};
			});
		} catch {} finally {
			setIsLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		sessionRef.current = state.session;
		if (state.session?.apiToken) {
			refreshData();
			const interval = setInterval(() => {
				refreshData();
			}, 5e3);
			const handleFocus = () => void refreshData();
			window.addEventListener("focus", handleFocus);
			return () => {
				clearInterval(interval);
				window.removeEventListener("focus", handleFocus);
			};
		}
	}, [state.session?.apiToken, refreshData]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		const { lang, fontScale, highContrast, reducedMotion, srMode, notifPrefs } = state;
		localStorage.setItem(UI_PREFS_KEY, JSON.stringify({
			lang,
			fontScale,
			highContrast,
			reducedMotion,
			srMode,
			notifPrefs
		}));
	}, [
		state.lang,
		state.fontScale,
		state.highContrast,
		state.reducedMotion,
		state.srMode,
		state.notifPrefs,
		hydrated
	]);
	(0, import_react.useEffect)(() => {
		const el = document.documentElement;
		el.style.fontSize = `${100 + state.fontScale * 12.5}%`;
		el.classList.toggle("hc", state.highContrast);
		el.classList.toggle("reduce-motion", state.reducedMotion);
		el.classList.toggle("sr-mode", state.srMode);
		el.lang = state.lang;
	}, [
		state.fontScale,
		state.highContrast,
		state.reducedMotion,
		state.srMode,
		state.lang
	]);
	const set = (0, import_react.useCallback)((p) => setState((s) => ({
		...s,
		...typeof p === "function" ? p(s) : p
	})), []);
	const login = (0, import_react.useCallback)((session) => {
		sessionRef.current = session;
		localStorage.setItem(SESSION_KEY, JSON.stringify(session));
		setState((s) => ({
			...s,
			...EMPTY_ACCOUNT_DATA,
			session
		}));
	}, []);
	const logout = (0, import_react.useCallback)(() => {
		sessionRef.current = null;
		localStorage.removeItem(SESSION_KEY);
		setState((s) => ({
			...s,
			...EMPTY_ACCOUNT_DATA,
			session: null
		}));
	}, []);
	const createApp = (0, import_react.useCallback)(async (schemeId, metadata = {}) => {
		const created = await createBackendApplication(sessionRef.current, schemeId, metadata);
		setState((s) => ({
			...s,
			applications: [created, ...s.applications.filter((a) => a.id !== created.id)]
		}));
		refreshData();
		return created;
	}, [refreshData]);
	const updateAppAction = (0, import_react.useCallback)((id, patch, eventText, by) => {
		setState((s) => ({
			...s,
			applications: s.applications.map((a) => a.id === id || a.rawId === id ? {
				...a,
				...patch,
				updatedOn: nowStamp().slice(0, 10),
				events: eventText ? [...a.events, {
					date: nowStamp().slice(0, 16),
					text: eventText,
					by: by ?? "System"
				}] : a.events
			} : a)
		}));
		if (sessionRef.current?.apiToken) {
			const backendId = state.applications.find((a) => a.id === id)?.rawId || id;
			updateBackendApplication(sessionRef.current, backendId, {
				status: patch.status ? patch.status.toUpperCase().replace(/\s+/g, "_") : void 0,
				metadata: patch.metadata
			}).catch(() => void 0);
		}
	}, [state.applications]);
	const submitApp = (0, import_react.useCallback)(async (id) => {
		const backendId = state.applications.find((a) => a.id === id)?.rawId || id;
		const submitted = await submitBackendApplication(sessionRef.current, backendId);
		setState((s) => ({
			...s,
			applications: s.applications.map((a) => a.id === id || a.rawId === id ? submitted : a)
		}));
		refreshData();
		return submitted;
	}, [state.applications, refreshData]);
	const assignApp = (0, import_react.useCallback)(async (id, assignedTo, notes) => {
		const backendId = state.applications.find((a) => a.id === id)?.rawId || id;
		const assigned = await assignBackendApplication(sessionRef.current, backendId, assignedTo, notes);
		setState((s) => ({
			...s,
			applications: s.applications.map((a) => a.id === id || a.rawId === id ? assigned : a)
		}));
		refreshData();
		return assigned;
	}, [state.applications, refreshData]);
	const requestAppEvidence = (0, import_react.useCallback)(async (id, req) => {
		const backendId = state.applications.find((a) => a.id === id)?.rawId || id;
		const updated = await requestBackendEvidence(sessionRef.current, backendId, req);
		setState((s) => ({
			...s,
			applications: s.applications.map((a) => a.id === id || a.rawId === id ? updated : a)
		}));
		refreshData();
		return updated;
	}, [state.applications, refreshData]);
	const submitAppEvidence = (0, import_react.useCallback)(async (id, req) => {
		const backendId = state.applications.find((a) => a.id === id)?.rawId || id;
		const updated = await submitBackendEvidence(sessionRef.current, backendId, req);
		setState((s) => ({
			...s,
			applications: s.applications.map((a) => a.id === id || a.rawId === id ? updated : a)
		}));
		refreshData();
		return updated;
	}, [state.applications, refreshData]);
	const verifyApp = (0, import_react.useCallback)(async (id, req) => {
		const backendId = state.applications.find((a) => a.id === id)?.rawId || id;
		const updated = await verifyBackendApplication(sessionRef.current, backendId, req);
		setState((s) => ({
			...s,
			applications: s.applications.map((a) => a.id === id || a.rawId === id ? updated : a)
		}));
		refreshData();
		return updated;
	}, [state.applications, refreshData]);
	const approveApp = (0, import_react.useCallback)(async (id) => {
		const backendId = state.applications.find((a) => a.id === id)?.rawId || id;
		const result = await approveBackendApplication(sessionRef.current, backendId);
		refreshData();
		return result;
	}, [state.applications, refreshData]);
	const rejectApp = (0, import_react.useCallback)(async (id, reason, notes) => {
		const backendId = state.applications.find((a) => a.id === id)?.rawId || id;
		const updated = await rejectBackendApplication(sessionRef.current, backendId, reason, notes);
		setState((s) => ({
			...s,
			applications: s.applications.map((a) => a.id === id || a.rawId === id ? updated : a)
		}));
		refreshData();
		return updated;
	}, [state.applications, refreshData]);
	const markNotificationRead = (0, import_react.useCallback)(async (id) => {
		setState((s) => ({
			...s,
			notifications: s.notifications.map((n) => n.id === id ? {
				...n,
				read: true
			} : n)
		}));
		if (sessionRef.current?.apiToken) await markBackendNotificationRead(sessionRef.current, id).catch(() => void 0);
	}, []);
	const value = (0, import_react.useMemo)(() => {
		const addAudit = (e) => set((s) => ({ audit: [{
			...e,
			id: "AU-" + (90100 + s.audit.length),
			ts: nowStamp()
		}, ...s.audit] }));
		return {
			state,
			hydrated,
			isLoading,
			set,
			t: (k) => translate(state.lang, k),
			login,
			logout,
			refreshData,
			addAudit,
			notify: (title, body, link) => set((s) => ({ notifications: [{
				id: "n" + Date.now(),
				title,
				body,
				link,
				date: nowStamp().slice(0, 10),
				read: false
			}, ...s.notifications] })),
			updateApp: updateAppAction,
			markNotificationRead,
			createApp,
			submitApp,
			assignApp,
			requestAppEvidence,
			submitAppEvidence,
			verifyApp,
			approveApp,
			rejectApp,
			sendMessage: (msg) => {
				set((s) => {
					const senderName = s.session?.name || "User";
					const senderEmail = s.session?.apiEmail || "user@mira.local";
					const senderRole = s.session?.role || "citizen";
					const now = nowStamp().slice(0, 16);
					if (msg.threadId) return { messages: s.messages.map((t) => t.id === msg.threadId ? {
						...t,
						timestamp: now,
						preview: msg.body.slice(0, 100),
						messages: [...t.messages, {
							id: "m-" + Date.now(),
							senderName,
							senderEmail,
							senderRole,
							timestamp: now,
							body: msg.body
						}]
					} : t) };
					return { messages: [{
						id: "MSG-2026-" + Math.floor(1e3 + Math.random() * 9e3),
						subject: msg.subject,
						sender: {
							name: senderName,
							email: senderEmail,
							role: senderRole,
							department: s.session?.department
						},
						recipient: {
							name: msg.toName || msg.toEmail.split("@")[0],
							email: msg.toEmail,
							role: msg.toRole || "user"
						},
						preview: msg.body.slice(0, 100),
						timestamp: now,
						status: "read",
						folder: "sent",
						applicationId: msg.applicationId,
						messages: [{
							id: "m-" + Date.now(),
							senderName,
							senderEmail,
							senderRole,
							timestamp: now,
							body: msg.body
						}]
					}, ...s.messages] };
				});
			},
			markMessageRead: (threadId) => set((s) => ({ messages: s.messages.map((m) => m.id === threadId ? {
				...m,
				status: "read"
			} : m) })),
			toggleStarMessage: (threadId) => set((s) => ({ messages: s.messages.map((m) => m.id === threadId ? {
				...m,
				isStarred: !m.isStarred
			} : m) })),
			archiveMessage: (threadId) => set((s) => ({ messages: s.messages.map((m) => m.id === threadId ? {
				...m,
				folder: "archived",
				isArchived: true
			} : m) })),
			addComment: (comment) => set((s) => {
				const authorName = s.session?.name || "Official";
				const authorRole = s.session?.role || "officer";
				const now = nowStamp().slice(0, 16);
				if (comment.replyToId) return { comments: s.comments.map((c) => c.id === comment.replyToId ? {
					...c,
					replies: [...c.replies, {
						id: "rep-" + Date.now(),
						author: {
							name: authorName,
							role: authorRole
						},
						timestamp: now,
						text: comment.text,
						mentions: comment.mentions
					}]
				} : c) };
				const newComment = {
					id: "COM-" + Date.now(),
					recordType: comment.recordType,
					recordId: comment.recordId,
					author: {
						name: authorName,
						role: authorRole,
						department: s.session?.department
					},
					timestamp: now,
					text: comment.text,
					mentions: comment.mentions,
					replies: [],
					isResolved: false
				};
				return { comments: [...s.comments, newComment] };
			}),
			updateFieldVisit: (visitId, patch) => set((s) => ({ fieldVisits: s.fieldVisits.map((v) => v.id === visitId ? {
				...v,
				...patch
			} : v) })),
			addFileVersion: (fileId, newVersion) => set((s) => ({ files: s.files.map((f) => {
				if (f.id !== fileId) return f;
				const nextVer = f.currentVersion + 1;
				return {
					...f,
					name: newVersion.filename,
					sizeBytes: newVersion.sizeBytes,
					currentVersion: nextVer,
					verificationStatus: "Pending Review",
					uploadedDate: nowStamp().slice(0, 10),
					versions: [{
						versionNumber: nextVer,
						filename: newVersion.filename,
						sizeBytes: newVersion.sizeBytes,
						uploadedBy: s.session?.name || "Citizen",
						uploadedAt: nowStamp().slice(0, 16),
						reason: newVersion.reason
					}, ...f.versions]
				};
			}) }))
		};
	}, [
		state,
		hydrated,
		isLoading,
		set,
		login,
		logout,
		refreshData,
		updateAppAction,
		markNotificationRead,
		createApp,
		submitApp,
		assignApp,
		requestAppEvidence,
		submitAppEvidence,
		verifyApp,
		approveApp,
		rejectApp
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppCtx.Provider, {
		value,
		children
	});
}
function useApp() {
	const c = (0, import_react.useContext)(AppCtx);
	if (!c) throw new Error("useApp outside provider");
	return c;
}
function downloadAcknowledgement(a, schemeName) {
	const text = [
		"MIRA — UNIFIED CITIZEN WELFARE OPERATING SYSTEM",
		"Application Acknowledgement (Authoritative Record)",
		"------------------------------------------------------------",
		`Application ID : ${a.id}`,
		`Scheme         : ${schemeName}`,
		`Applicant      : ${a.applicant}`,
		`Household ID   : ${a.householdId}`,
		`Submitted on   : ${a.appliedOn || "Not yet submitted"}`,
		`Current status : ${a.status}`,
		`Last updated   : ${a.updatedOn}`,
		"",
		"Keep this Application ID to track your application at /track.",
		`Generated: ${nowStamp()}`
	].join("\n");
	const blob = new Blob([text], { type: "text/plain" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `Acknowledgement_${a.id}.txt`;
	link.click();
	URL.revokeObjectURL(url);
}
//#endregion
export { sendMiraAiChat as A, inr as C, raiseFamilyDispute as D, nowStamp as E, useApp as M, registerUser as O, getScheme as S, mapRoleToUiRole as T, downloadAcknowledgement as _, CITIZEN as a, fetchMyFamily as b, MEMBERS as c, STATUSES as d, TIMELINE_STAGES as f, authenticateDemo as g, apiUrl as h, CATEGORY_IMAGE as i, uploadDocument as j, reportLifeEvent as k, SCHEMES as l, apiRequest as m, BENEFITS as n, HOUSEHOLD as o, addFamilyMember as p, CATEGORIES as r, LANGUAGES as s, AppStateProvider as t, STATES as u, fetchApplications as v, loginUser as w, fmtDate as x, fetchBenefits as y };
