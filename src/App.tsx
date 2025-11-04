import React, { useState } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { LoginPage } from './components/LoginPage';
import { MainLayout } from './components/MainLayout';
import { Dashboard } from './components/Dashboard';
import { PatientsList } from './components/PatientsList';
import { PatientRegistration } from './components/PatientRegistration';
import { PatientProfile } from './components/PatientProfile';
import { Appointments } from './components/Appointments';
import { LaborDelivery } from './components/LaborDelivery';
import { Analytics } from './components/Analytics';
import { Notifications } from './components/Notifications';
import { Settings } from './components/Settings';
import { PageHeader } from './components/PageHeader';
import { Toaster } from './components/ui/sonner';
import { FileText, Baby, Syringe, FileHeart, Package, CreditCard, MessageSquare } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [pageData, setPageData] = useState<any>(null);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page);
    setPageData(data);
    window.scrollTo(0, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-t-2 border-cyan-500"></div>
            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse"></div>
          </div>
          <p className="text-foreground mt-6 text-gradient">Loading Maternal Health System...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      
      case 'patients':
        return <PatientsList onNavigate={handleNavigate} />;
      
      case 'register':
        return <PatientRegistration onNavigate={handleNavigate} />;
      
      case 'patient-profile':
        return <PatientProfile patient={pageData?.patient} onNavigate={handleNavigate} />;
      
      case 'appointments':
        return <Appointments onNavigate={handleNavigate} initialPatient={pageData?.patient} />;
      
      case 'labor':
        return <LaborDelivery onNavigate={handleNavigate} />;
      
      case 'analytics':
        return <Analytics onNavigate={handleNavigate} />;
      
      case 'notifications':
        return <Notifications onNavigate={handleNavigate} />;
      
      case 'settings':
        return <Settings onNavigate={handleNavigate} />;

      case 'records':
        return (
          <div className="space-y-6">
            <PageHeader
              title="Medical Records"
              description="Electronic Medical Records (EMR) System"
              icon={FileText}
              onBack={() => handleNavigate('dashboard')}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Visit Logs', 'Diagnosis Records', 'Lab Results', 'Prescriptions', 'Vital Signs', 'Treatment History'].map((record) => (
                <div key={record} className="glass-card glass-card-hover p-6 rounded-2xl text-center">
                  <p className="text-foreground">{record}</p>
                  <p className="text-sm text-muted-foreground mt-2">Coming soon</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'postnatal':
        return (
          <div className="space-y-6">
            <PageHeader
              title="Postnatal Care"
              description="Post-delivery checkups and mother-baby care"
              icon={Baby}
              onBack={() => handleNavigate('dashboard')}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card glass-card-hover p-8 rounded-2xl text-center">
                <p className="text-foreground">Postnatal Checkup Scheduling</p>
                <p className="text-sm text-muted-foreground mt-2">Schedule 6-week checkups</p>
              </div>
              <div className="glass-card glass-card-hover p-8 rounded-2xl text-center">
                <p className="text-foreground">Mother & Baby Profiles</p>
                <p className="text-sm text-muted-foreground mt-2">Track recovery and baby health</p>
              </div>
            </div>
          </div>
        );

      case 'vaccinations':
        return (
          <div className="space-y-6">
            <PageHeader
              title="Vaccination Tracking"
              description="Newborn immunization schedules and records"
              icon={Syringe}
              onBack={() => handleNavigate('dashboard')}
            />
            <div className="glass-card glass-card-hover p-8 rounded-2xl text-center">
              <p className="text-foreground">Vaccination Schedule Management</p>
              <p className="text-sm text-muted-foreground mt-2">Track immunizations for newborns</p>
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            <PageHeader
              title="Document Management"
              description="Upload and manage medical documents"
              icon={FileHeart}
              onBack={() => handleNavigate('dashboard')}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Ultrasound Results', 'Lab Reports', 'Consent Forms', 'Medical Certificates', 'Prescriptions', 'Discharge Papers'].map((doc) => (
                <div key={doc} className="glass-card glass-card-hover p-6 rounded-2xl text-center">
                  <p className="text-foreground">{doc}</p>
                  <p className="text-sm text-muted-foreground mt-2">Upload & view</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'inventory':
        return (
          <div className="space-y-6">
            <PageHeader
              title="Inventory & Supply Management"
              description="Track medical supplies and medications"
              icon={Package}
              onBack={() => handleNavigate('dashboard')}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card glass-card-hover p-8 rounded-2xl text-center">
                <p className="text-foreground">Medical Supplies</p>
                <p className="text-sm text-muted-foreground mt-2">Track inventory levels</p>
              </div>
              <div className="glass-card glass-card-hover p-8 rounded-2xl text-center">
                <p className="text-foreground">Medications</p>
                <p className="text-sm text-muted-foreground mt-2">Monitor stock and expiry</p>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <PageHeader
              title="Billing & Payment Records"
              description="Manage patient billing and payments"
              icon={CreditCard}
              onBack={() => handleNavigate('dashboard')}
            />
            <div className="glass-card glass-card-hover p-8 rounded-2xl text-center">
              <p className="text-foreground">Billing Management System</p>
              <p className="text-sm text-muted-foreground mt-2">Track invoices and payments</p>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-6">
            <PageHeader
              title="Communication Module"
              description="Secure messaging between staff and patients"
              icon={MessageSquare}
              onBack={() => handleNavigate('dashboard')}
            />
            <div className="glass-card glass-card-hover p-8 rounded-2xl text-center">
              <p className="text-foreground">Secure Messaging System</p>
              <p className="text-sm text-muted-foreground mt-2">Chat with patients and staff</p>
            </div>
          </div>
        );

      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <MainLayout currentPage={currentPage} onNavigate={handleNavigate}>
      {renderPage()}
    </MainLayout>
  );
};

export default function App() {
  return (
    <div className="dark">
      <AuthProvider>
        <AppContent />
        <Toaster position="top-right" />
      </AuthProvider>
    </div>
  );
}
