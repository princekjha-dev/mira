import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider, useTranslation } from './i18n/context';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { DashboardPage } from './pages/Dashboard';
import { ProfilePage } from './pages/Profile';
import { AuditTrailPage } from './pages/AuditTrail';
import { GraphViewPage } from './pages/GraphView';
import { PersonsListPage } from './pages/PersonsList';
import { PersonDetailPage } from './pages/PersonDetail';
import { HouseholdsListPage } from './pages/HouseholdsList';
import { HouseholdDetailPage } from './pages/HouseholdDetail';
import { SchemesListPage } from './pages/SchemesList';
import { SchemeDetailPage } from './pages/SchemeDetail';
import { ApplicationsListPage } from './pages/ApplicationsList';
import { NewApplicationPage } from './pages/NewApplication';
import { ApplicationDetailPage } from './pages/ApplicationDetail';
import { BenefitsListPage } from './pages/BenefitsList';
import { EntityResolutionQueuePage } from './pages/review/EntityResolutionQueue';
import { EntityResolutionDetailPage } from './pages/review/EntityResolutionDetail';
import { BenefitDuplicateQueuePage } from './pages/review/BenefitDuplicateQueue';
import { BenefitDuplicateDetailPage } from './pages/review/BenefitDuplicateDetail';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-700">{t('app.title')}</span>
          <span>—</span>
          <span>{t('app.tagline')}</span>
        </div>
        <div className="text-slate-400">
          V1 Foundation • PS 7 Accessible Public Documentation
        </div>
      </div>
    </footer>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
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
                  <Route
                    path="/schemes"
                    element={
                      <ProtectedRoute>
                        <SchemesListPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/schemes/:id"
                    element={
                      <ProtectedRoute>
                        <SchemeDetailPage />
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
                    path="/applications/new"
                    element={
                      <ProtectedRoute>
                        <NewApplicationPage />
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
                    path="/benefits"
                    element={
                      <ProtectedRoute>
                        <BenefitsListPage />
                      </ProtectedRoute>
                    }
                  />
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
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/audit"
                    element={
                      <ProtectedRoute allowedRoles={['AUDITOR', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN']}>
                        <AuditTrailPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
