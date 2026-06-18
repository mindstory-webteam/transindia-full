import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./componant/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceFormPage from "./pages/ServiceFormPage";
import LeadsPage from "./pages/LeadsPage";
import LeadDetailPage from "./pages/LeadDetailPage";
import SettingsPage from "./pages/SettingsPage";
import GeneralQueryPage from "./pages/GeneralQueryPage";
import ClaimSupportPage from "./pages/ClaimSupportPage";
import ComplaintPage from "./pages/ComplaintPage";

function PrivateRoute({ children }) {
  const { admin, loading } = useAuth();
  if (loading) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", fontSize:14, color:"#64748B" }}>Loading…</div>;
  return admin ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { admin } = useAuth();
  return admin ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/new" element={<ServiceFormPage />} />
            <Route path="services/:id/edit" element={<ServiceFormPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="leads/:id" element={<LeadDetailPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="contact/general-queries" element={<GeneralQueryPage />} />
            <Route path="contact/claim-support" element={<ClaimSupportPage />} />
            <Route path="contact/complaints" element={<ComplaintPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}