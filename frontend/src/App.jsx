import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import DoctorDashboard from './pages/dashboards/DoctorDashboard';
import PatientDashboard from './pages/dashboards/PatientDashboard';
import LabDashboard from './pages/dashboards/LabDashboard';
import PharmacyDashboard from './pages/dashboards/PharmacyDashboard';
import Profile from './pages/dashboards/Profile';
import DoctorAppointments from './pages/dashboards/DoctorAppointments';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const DashboardSelector = () => {
  const { user } = useAuth();
  switch (user.role) {
    case 'Admin': return <AdminDashboard />;
    case 'Doctor': return <DoctorDashboard />;
    case 'Patient': return <PatientDashboard />;
    case 'Lab Technician': return <LabDashboard />;
    case 'Pharmacy': return <PharmacyDashboard />;
    default: return <Navigate to="/login" />;
  }
};

const AppointmentSelector = () => {
  const { user } = useAuth();
  if (user?.role === 'Doctor') return <DoctorAppointments />;
  return <DashboardSelector />;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Routes>
                <Route index element={<DashboardSelector />} />
                <Route path="profile" element={<Profile />} />
                <Route path="users" element={<DashboardSelector />} />
                <Route path="registrations" element={<DashboardSelector />} />
                <Route path="patients" element={<DashboardSelector />} />
                <Route path="appointments" element={<AppointmentSelector />} />
                <Route path="prescriptions" element={<DashboardSelector />} />
                <Route path="labs" element={<DashboardSelector />} />
                <Route path="requests" element={<DashboardSelector />} />
                <Route path="uploads" element={<DashboardSelector />} />
                <Route path="pharmacy" element={<DashboardSelector />} />
                <Route path="my-appointments" element={<DashboardSelector />} />
                <Route path="my-prescriptions" element={<DashboardSelector />} />
                <Route path="my-reports" element={<DashboardSelector />} />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
