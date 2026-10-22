import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider, useTranslation } from '../i18n/context';
import { AuthProvider } from '../context/AuthContext';
import { LoginPage } from '../pages/Login';
import { RoleBadge } from '../components/RoleBadge';
import { ProtectedRoute } from '../components/ProtectedRoute';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

describe('Mira Frontend Foundation Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders login page with form elements and demo accounts', () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    expect(screen.getByText('Sign In to Mira')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Synthetic Demo Accounts (1-Click Fill)')).toBeInTheDocument();
    expect(screen.getByText('Citizen')).toBeInTheDocument();
    expect(screen.getByText('Auditor')).toBeInTheDocument();
  });

  it('autofills demo credentials on click', () => {
    render(<LoginPage />, { wrapper: createWrapper() });

    const citizenBtn = screen.getByText('Citizen');
    fireEvent.click(citizenBtn);

    const emailInput = screen.getByLabelText('Email Address') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    expect(emailInput.value).toBe('citizen@mira.local');
    expect(passwordInput.value).toBe('MiraDemo@2026!');
  });

  it('renders role badge properly for different roles', () => {
    const { rerender } = render(<RoleBadge role="CITIZEN" />);
    expect(screen.getByText('CITIZEN')).toBeInTheDocument();

    rerender(<RoleBadge role="VERIFICATION_OFFICER" />);
    expect(screen.getByText('VERIFICATION OFFICER')).toBeInTheDocument();

    rerender(<RoleBadge role="AUDITOR" />);
    expect(screen.getByText('AUDITOR')).toBeInTheDocument();
  });

  it('verifies language switching mechanism between English and Hindi', () => {
    const TestComponent = () => {
      const { t, language, setLanguage } = useTranslation();
      return (
        <div>
          <span data-testid="title">{t('app.title')}</span>
          <span data-testid="curr-lang">{language}</span>
          <button onClick={() => setLanguage('hi')}>Switch to Hindi</button>
          <button onClick={() => setLanguage('en')}>Switch to English</button>
        </div>
      );
    };

    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('title')).toHaveTextContent('Mira');
    expect(screen.getByTestId('curr-lang')).toHaveTextContent('en');

    // Switch to Hindi
    fireEvent.click(screen.getByText('Switch to Hindi'));
    expect(screen.getByTestId('title')).toHaveTextContent('मीरा (Mira)');
    expect(screen.getByTestId('curr-lang')).toHaveTextContent('hi');

    // Switch back to English
    fireEvent.click(screen.getByText('Switch to English'));
    expect(screen.getByTestId('title')).toHaveTextContent('Mira');
    expect(screen.getByTestId('curr-lang')).toHaveTextContent('en');
  });

  it('redirects unauthenticated user in protected route', () => {
    render(
      <ProtectedRoute>
        <div>Secret Dashboard Content</div>
      </ProtectedRoute>,
      { wrapper: createWrapper() }
    );

    // Unauthenticated user should not see secret content
    expect(screen.queryByText('Secret Dashboard Content')).not.toBeInTheDocument();
  });

  it('verifies V2 domain translations are available in English and Hindi', () => {
    const TestV2I18n = () => {
      const { t, setLanguage } = useTranslation();
      return (
        <div>
          <span data-testid="en-person">{t('v2.person')}</span>
          <span data-testid="en-household">{t('v2.household')}</span>
          <span data-testid="en-split">{t('v2.householdSplit')}</span>
          <span data-testid="en-timeline">{t('v2.timeline')}</span>
          <button onClick={() => setLanguage('hi')}>Switch to Hindi</button>
        </div>
      );
    };

    render(
      <LanguageProvider>
        <TestV2I18n />
      </LanguageProvider>
    );

    expect(screen.getByTestId('en-person')).toHaveTextContent('Person');
    expect(screen.getByTestId('en-household')).toHaveTextContent('Household');
    expect(screen.getByTestId('en-split')).toHaveTextContent('Household Split');
    expect(screen.getByTestId('en-timeline')).toHaveTextContent('Temporal Timeline');

    fireEvent.click(screen.getByText('Switch to Hindi'));
    expect(screen.getByTestId('en-person')).toHaveTextContent('व्यक्ति');
    expect(screen.getByTestId('en-household')).toHaveTextContent('परिवार / गृहस्थी');
    expect(screen.getByTestId('en-split')).toHaveTextContent('परिवार विभाजन');
  });

  it('verifies V3 scheme, benefit & eligibility intelligence translations in English and Hindi', () => {
    const TestV3I18n = () => {
      const { t, setLanguage } = useTranslation();
      return (
        <div>
          <span data-testid="scheme">{t('v3.scheme')}</span>
          <span data-testid="benefit">{t('v3.benefit')}</span>
          <span data-testid="application">{t('v3.application')}</span>
          <span data-testid="indiv-scope">{t('v3.scopeIndividual')}</span>
          <span data-testid="hh-scope">{t('v3.scopeHousehold')}</span>
          <span data-testid="prop-scope">{t('v3.scopeProperty')}</span>
          <span data-testid="eval-notice">{t('v3.evalNotice')}</span>
          <button onClick={() => setLanguage('hi')}>Switch to Hindi</button>
        </div>
      );
    };

    render(
      <LanguageProvider>
        <TestV3I18n />
      </LanguageProvider>
    );

    // English assertions
    expect(screen.getByTestId('scheme')).toHaveTextContent('Scheme');
    expect(screen.getByTestId('benefit')).toHaveTextContent('Benefit');
    expect(screen.getByTestId('application')).toHaveTextContent('Application');
    expect(screen.getByTestId('indiv-scope')).toHaveTextContent('Individual');
    expect(screen.getByTestId('hh-scope')).toHaveTextContent('Household');
    expect(screen.getByTestId('prop-scope')).toHaveTextContent('Property');
    expect(screen.getByTestId('eval-notice')).toHaveTextContent('Eligibility assessment based on configured deterministic scheme rules.');

    // Switch to Hindi
    fireEvent.click(screen.getByText('Switch to Hindi'));
    expect(screen.getByTestId('scheme')).toHaveTextContent('योजना');
    expect(screen.getByTestId('benefit')).toHaveTextContent('लाभ');
    expect(screen.getByTestId('application')).toHaveTextContent('आवेदन');
    expect(screen.getByTestId('indiv-scope')).toHaveTextContent('व्यक्तिगत');
    expect(screen.getByTestId('hh-scope')).toHaveTextContent('पारिवारिक / गृहस्थी');
    expect(screen.getByTestId('prop-scope')).toHaveTextContent('संपत्ति');
    expect(screen.getByTestId('eval-notice')).toHaveTextContent('विन्यस्त योजना नियमों के आधार पर निश्चित पात्रता मूल्यांकन।');
  });

  it('verifies V4 entity resolution and duplicate intelligence translations in English and Hindi', () => {
    const TestV4I18n = () => {
      const { t, setLanguage } = useTranslation();
      return (
        <div>
          <span data-testid="er">{t('v4.entityResolution')}</span>
          <span data-testid="dup">{t('v4.potentialDuplicate')}</span>
          <span data-testid="evidence">{t('v4.evidence')}</span>
          <span data-testid="supports">{t('v4.supportsMatch')}</span>
          <span data-testid="contradicts">{t('v4.contradictsMatch')}</span>
          <span data-testid="manual-review">{t('v4.manualReview')}</span>
          <span data-testid="confirmed-dup">{t('v4.confirmedDuplicate')}</span>
          <span data-testid="not-dup">{t('v4.notDuplicate')}</span>
          <button onClick={() => setLanguage('hi')}>Switch to Hindi</button>
        </div>
      );
    };

    render(
      <LanguageProvider>
        <TestV4I18n />
      </LanguageProvider>
    );

    // English assertions
    expect(screen.getByTestId('er')).toHaveTextContent('Entity Resolution');
    expect(screen.getByTestId('dup')).toHaveTextContent('Potential Duplicate');
    expect(screen.getByTestId('evidence')).toHaveTextContent('Evidence');
    expect(screen.getByTestId('supports')).toHaveTextContent('SUPPORTS MATCH');
    expect(screen.getByTestId('contradicts')).toHaveTextContent('CONTRADICTS MATCH');
    expect(screen.getByTestId('manual-review')).toHaveTextContent('Manual Verification Required');
    expect(screen.getByTestId('confirmed-dup')).toHaveTextContent('Confirmed Duplicate');
    expect(screen.getByTestId('not-dup')).toHaveTextContent('Not a Duplicate');

    // Switch to Hindi
    fireEvent.click(screen.getByText('Switch to Hindi'));
    expect(screen.getByTestId('er')).toHaveTextContent('इकाई समाधान (एंटीटी रेज़ोल्यूशन)');
    expect(screen.getByTestId('dup')).toHaveTextContent('संभावित प्रतिरूप (डुप्लीकेट)');
    expect(screen.getByTestId('evidence')).toHaveTextContent('साक्ष्य');
    expect(screen.getByTestId('supports')).toHaveTextContent('मिलान का समर्थन करता है');
    expect(screen.getByTestId('contradicts')).toHaveTextContent('मिलान का विरोध करता है');
    expect(screen.getByTestId('manual-review')).toHaveTextContent('मानव सत्यापन आवश्यक');
    expect(screen.getByTestId('confirmed-dup')).toHaveTextContent('पुष्ट प्रतिरूप');
    expect(screen.getByTestId('not-dup')).toHaveTextContent('प्रतिरूप नहीं है');
  });
});
