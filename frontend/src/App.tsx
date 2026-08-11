import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

import { Dashboard } from './pages/Dashboard';
import { LiveGrid } from './pages/LiveGrid';
import { CameraManagement } from './pages/CameraManagement';
import { HealthMonitoring } from './pages/HealthMonitoring';
import { FloorPlanView } from './pages/FloorPlanView';
import { NvrManagement } from './pages/NvrManagement';
import { StorageAnalytics } from './pages/StorageAnalytics';
import { AlertCenter } from './pages/AlertCenter';
import { IncidentCenter } from './pages/IncidentCenter';
import { ReportsPage } from './pages/ReportsPage';
import { AuditLogs } from './pages/AuditLogs';
import { Login } from './pages/Login';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto min-w-0 bg-[#0B0F17]">{children}</main>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

export const AppContent: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/live-grid"
        element={
          <ProtectedRoute>
            <LiveGrid />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cameras"
        element={
          <ProtectedRoute>
            <CameraManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/health"
        element={
          <ProtectedRoute>
            <HealthMonitoring />
          </ProtectedRoute>
        }
      />
      <Route
        path="/floor-plans"
        element={
          <ProtectedRoute>
            <FloorPlanView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nvr"
        element={
          <ProtectedRoute>
            <NvrManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/storage"
        element={
          <ProtectedRoute>
            <StorageAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alerts"
        element={
          <ProtectedRoute>
            <AlertCenter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/incidents"
        element={
          <ProtectedRoute>
            <IncidentCenter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/audit-logs"
        element={
          <ProtectedRoute>
            <AuditLogs />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
