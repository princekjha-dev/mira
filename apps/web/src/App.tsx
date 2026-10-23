import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './i18n/context';
import { AuthProvider } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { OnboardingPage } from './pages/OnboardingPage';
import { TrackApplicationPage } from './pages/TrackApplicationPage';
import { EligibilityCheckerPage } from './pages/EligibilityCheckerPage';
import { HelpGrievancePage } from './pages/HelpGrievancePage';

// Shared / Citizen Pages
import { DashboardPage } from './pages/Dashboard';
import { SchemesListPage } from './pages/SchemesList';
import { SchemeDetailPage } from './pages/SchemeDetail';
import { ApplicationsListPage } from './pages/ApplicationsList';
import { NewApplicationPage } from './pages/NewApplication';
import { ApplicationDetailPage } from './pages/ApplicationDetail';
import { FamilyPage } from './pages/FamilyPage';
import { DocumentsPortal } from './pages/DocumentsPortal';
import { BenefitsListPage } from './pages/BenefitsList';
import { CitizenNotificationsPage } from './pages/CitizenNotificationsPage';
import { ProfilePage } from './pages/Profile';
import { GraphViewPage } from './pages/GraphView';
import { PersonsListPage } from './pages/PersonsList';
import { PersonDetailPage } from './pages/PersonDetail';
import { HouseholdsListPage } from './pages/HouseholdsList';
import { HouseholdDetailPage } from './pages/HouseholdDetail';
import { CaseEvidenceWorkspace } from './pages/CaseEvidenceWorkspace';
import { AuditTrailPage } from './pages/AuditTrail';

// Officer & Review Pages
import { OfficerDashboardPage } from './pages/OfficerDashboardPage';
import { OfficerVerificationQueuePage } from './pages/OfficerVerificationQueuePage';
import { EntityResolutionQueuePage } from './pages/review/EntityResolutionQueue';
import { EntityResolutionDetailPage } from './pages/review/EntityResolutionDetail';
import { BenefitDuplicateQueuePage } from './pages/review/BenefitDuplicateQueue';
import { BenefitDuplicateDetailPage } from './pages/review/BenefitDuplicateDetail';

// Department Pages
import { DepartmentDashboardPage } from './pages/DepartmentDashboardPage';
import { DepartmentRulesPage } from './pages/DepartmentRulesPage';
import { DepartmentReportsPage } from './pages/DepartmentReportsPage';
import { DepartmentOfficersPage } from './pages/DepartmentOfficersPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppShell>
              <Routes>
                {/* 1. Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/schemes" element={<SchemesListPage />} />
                <Route path="/schemes/:id" element={<SchemeDetailPage />} />
                <Route path="/eligibility" element={<EligibilityCheckerPage />} />
                <Route path="/track" element={<TrackApplicationPage />} />
                <Route path="/help" element={<HelpGrievancePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />

                {/* 2. Citizen Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen/schemes"
                  element={
                    <ProtectedRoute>
                      <SchemesListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen/schemes/:id"
                  element={
                    <ProtectedRoute>
                      <SchemeDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen/eligibility"
                  element={
                    <ProtectedRoute>
                      <EligibilityCheckerPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen/applications"
                  element={
                    <ProtectedRoute>
                      <ApplicationsListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen/applications/:id"
                  element={
                    <ProtectedRoute>
                      <ApplicationDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen/apply/:schemeId"
                  element={
                    <ProtectedRoute>
                      <NewApplicationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applications/new"
                  element={
                    <ProtectedRoute>
                      <NewApplicationPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applications"
                  element={
                    <ProtectedRoute>
                      <ApplicationsListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applications/:id"
                  element={
                    <ProtectedRoute>
                      <ApplicationDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/applications/:id/evidence"
                  element={
                    <ProtectedRoute>
                      <CaseEvidenceWorkspace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cases/:id/evidence"
                  element={
                    <ProtectedRoute>
                      <CaseEvidenceWorkspace />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen/family"
                  element={
                    <ProtectedRoute>
                      <FamilyPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen/documents"
                  element={
                    <ProtectedRoute>
                      <DocumentsPortal />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/documents"
                  element={
                    <ProtectedRoute>
                      <DocumentsPortal />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen/benefits"
                  element={
                    <ProtectedRoute>
                      <BenefitsListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/benefits"
                  element={
                    <ProtectedRoute>
                      <BenefitsListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen/notifications"
                  element={
                    <ProtectedRoute>
                      <CitizenNotificationsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen/grievances"
                  element={
                    <ProtectedRoute>
                      <HelpGrievancePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/citizen/settings"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* 3. V2 Person, Household & Graph Routes */}
                <Route
                  path="/graph"
                  element={
                    <ProtectedRoute>
                      <GraphViewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/persons"
                  element={
                    <ProtectedRoute>
                      <PersonsListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/persons/:id"
                  element={
                    <ProtectedRoute>
                      <PersonDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/households"
                  element={
                    <ProtectedRoute>
                      <HouseholdsListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/households/:id"
                  element={
                    <ProtectedRoute>
                      <HouseholdDetailPage />
                    </ProtectedRoute>
                  }
                />

                {/* 4. Officer Routes */}
                <Route path="/officer/login" element={<LoginPage />} />
                <Route
                  path="/officer/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['FIELD_OFFICER', 'VERIFICATION_OFFICER', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'AUDITOR']}>
                      <OfficerDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/officer/applications"
                  element={
                    <ProtectedRoute allowedRoles={['FIELD_OFFICER', 'VERIFICATION_OFFICER', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'AUDITOR']}>
                      <ApplicationsListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/officer/applications/:id"
                  element={
                    <ProtectedRoute allowedRoles={['FIELD_OFFICER', 'VERIFICATION_OFFICER', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'AUDITOR']}>
                      <ApplicationDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/officer/verification"
                  element={
                    <ProtectedRoute allowedRoles={['FIELD_OFFICER', 'VERIFICATION_OFFICER', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'AUDITOR']}>
                      <OfficerVerificationQueuePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/officer/duplicates"
                  element={
                    <ProtectedRoute allowedRoles={['FIELD_OFFICER', 'VERIFICATION_OFFICER', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'AUDITOR']}>
                      <BenefitDuplicateQueuePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/officer/citizens/:id"
                  element={
                    <ProtectedRoute allowedRoles={['FIELD_OFFICER', 'VERIFICATION_OFFICER', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'AUDITOR']}>
                      <PersonDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/officer/households/:id"
                  element={
                    <ProtectedRoute allowedRoles={['FIELD_OFFICER', 'VERIFICATION_OFFICER', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'AUDITOR']}>
                      <HouseholdDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/officer/documents"
                  element={
                    <ProtectedRoute allowedRoles={['FIELD_OFFICER', 'VERIFICATION_OFFICER', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'AUDITOR']}>
                      <DocumentsPortal />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/officer/audit"
                  element={
                    <ProtectedRoute allowedRoles={['FIELD_OFFICER', 'VERIFICATION_OFFICER', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'AUDITOR']}>
                      <AuditTrailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/officer/settings"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Review Queues */}
                <Route
                  path="/review/entity-resolution"
                  element={
                    <ProtectedRoute allowedRoles={['FIELD_OFFICER', 'VERIFICATION_OFFICER', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'AUDITOR']}>
                      <EntityResolutionQueuePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/review/entity-resolution/:id"
                  element={
                    <ProtectedRoute allowedRoles={['FIELD_OFFICER', 'VERIFICATION_OFFICER', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'AUDITOR']}>
                      <EntityResolutionDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/review/benefit-duplicates"
                  element={
                    <ProtectedRoute allowedRoles={['FIELD_OFFICER', 'VERIFICATION_OFFICER', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'AUDITOR']}>
                      <BenefitDuplicateQueuePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/review/benefit-duplicates/:id"
                  element={
                    <ProtectedRoute allowedRoles={['FIELD_OFFICER', 'VERIFICATION_OFFICER', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'AUDITOR']}>
                      <BenefitDuplicateDetailPage />
                    </ProtectedRoute>
                  }
                />

                {/* 5. Department Administration Routes */}
                <Route
                  path="/department/dashboard"
                  element={
                    <ProtectedRoute allowedRoles={['DEPARTMENT_ADMIN', 'SUPER_ADMIN']}>
                      <DepartmentDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/department/schemes"
                  element={
                    <ProtectedRoute allowedRoles={['DEPARTMENT_ADMIN', 'SUPER_ADMIN']}>
                      <SchemesListPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/department/schemes/:id"
                  element={
                    <ProtectedRoute allowedRoles={['DEPARTMENT_ADMIN', 'SUPER_ADMIN']}>
                      <SchemeDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/department/rules"
                  element={
                    <ProtectedRoute allowedRoles={['DEPARTMENT_ADMIN', 'SUPER_ADMIN']}>
                      <DepartmentRulesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/department/reports"
                  element={
                    <ProtectedRoute allowedRoles={['DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'AUDITOR']}>
                      <DepartmentReportsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/department/officers"
                  element={
                    <ProtectedRoute allowedRoles={['DEPARTMENT_ADMIN', 'SUPER_ADMIN']}>
                      <DepartmentOfficersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/department/audit"
                  element={
                    <ProtectedRoute allowedRoles={['DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'AUDITOR']}>
                      <AuditTrailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/department/settings"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                {/* Audit Trail */}
                <Route
                  path="/audit"
                  element={
                    <ProtectedRoute allowedRoles={['AUDITOR', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN']}>
                      <AuditTrailPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppShell>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
