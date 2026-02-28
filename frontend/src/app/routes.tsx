import { createBrowserRouter, Outlet, Navigate } from 'react-router';
import ChatbotWidget from './components/ChatbotWidget';

import NewLandingPage from './pages/NewLandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import PatientSymptomInputPage from './pages/PatientSymptomInputPage';
import PatientRiskResultPage from './pages/PatientRiskResultPage';
import PatientFreeReportPage from './pages/PatientFreeReportPage';
import FollowUpPage from './pages/FollowUpPage';

import DoctorDashboardPage from './pages/DoctorDashboardPage';
import DoctorPatientsPage from './pages/DoctorPatientsPage';
import DoctorPatientDetailPage from './pages/DoctorPatientDetailPage';
import DoctorAnalyticsPage from './pages/DoctorAnalyticsPage';
import DoctorBillingPage from './pages/DoctorBillingPage';
import DoctorReportsPage from './pages/DoctorReportsPage';
import DoctorSettingsPage from './pages/DoctorSettingsPage';
import DoctorLoginPage from './pages/DoctorLoginPage';
import DoctorRegisterPage from './pages/DoctorRegisterPage';
import BuyCreditsPage from './pages/BuyCreditsPage';

import LandingPage from './pages/LandingPage';
import SymptomInputPage from './pages/SymptomInputPage';
import RiskAnalysisPage from './pages/RiskAnalysisPage';
import SOAPReportPage from './pages/SOAPReportPage';
import DashboardPage from './pages/DashboardPage';
import PatientHistoryPage from './pages/PatientHistoryPage';
import DrugCheckerPage from './pages/DrugCheckerPage';

const RootLayout = () => {
  return (
    <>
      <Outlet />
      <ChatbotWidget />
    </>
  );
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <NewLandingPage />,
      },

      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/role-select',
        element: <Navigate to="/patient/symptom" replace />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/contact',
        element: <ContactPage />,
      },

      {
        path: '/patient/symptom',
        element: <PatientSymptomInputPage />,
      },
      {
        path: '/patient/drug-checker',
        element: <DrugCheckerPage />,
      },
      {
        path: '/patient/followup',
        element: <FollowUpPage />,
      },
      {
        path: '/patient/risk/:patientId',
        element: <PatientRiskResultPage />,
      },
      {
        path: '/patient/report/:patientId',
        element: <PatientFreeReportPage />,
      },

      {
        path: '/doctor/dashboard',
        element: <DoctorDashboardPage />,
      },
      {
        path: '/doctor/patients',
        element: <DoctorPatientsPage />,
      },
      {
        path: '/doctor/patient/:patientId',
        element: <DoctorPatientDetailPage />,
      },
      {
        path: '/doctor/analytics',
        element: <DoctorAnalyticsPage />,
      },
      {
        path: '/doctor/billing',
        element: <DoctorBillingPage />,
      },
      {
        path: '/doctor/reports',
        element: <DoctorReportsPage />,
      },
      {
        path: '/doctor/settings',
        element: <DoctorSettingsPage />,
      },
      {
        path: '/doctor/login',
        element: <DoctorLoginPage />,
      },
      {
        path: '/doctor/register',
        element: <DoctorRegisterPage />,
      },
      {
        path: '/buy-credits',
        element: <BuyCreditsPage />,
      },

      {
        path: '/old-landing',
        element: <LandingPage />,
      },
      {
        path: '/symptom-input',
        element: <SymptomInputPage />,
      },
      {
        path: '/risk-analysis/:patientId',
        element: <RiskAnalysisPage />,
      },
      {
        path: '/soap-report/:patientId',
        element: <SOAPReportPage />,
      },
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/patient-history/:patientId',
        element: <PatientHistoryPage />,
      },
    ],
  },
]);
