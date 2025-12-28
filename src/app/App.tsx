import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProvider, useApp } from './context/AppContext';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ProgrammeScreen } from './screens/ProgrammeScreen';
import { NetworkingScreen } from './screens/NetworkingScreen';
import { AdminScreen } from './screens/AdminScreen';
import { BrandShowcase } from './screens/BrandShowcase';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Root redirect component
const RootRedirect: React.FC = () => {
  const { currentUser } = useApp();
  
  if (currentUser) {
    return <Navigate to="/home" replace />;
  }
  
  return <Navigate to="/login" replace />;
};

// Main App Router
const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/admin" element={<AdminScreen />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomeScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/programme"
        element={
          <ProtectedRoute>
            <ProgrammeScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/networking"
        element={
          <ProtectedRoute>
            <NetworkingScreen />
          </ProtectedRoute>
        }
      />
      <Route
        path="/brand-showcase"
        element={
          <ProtectedRoute>
            <BrandShowcase />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="antialiased">
          <AppRouter />
          <Toaster position="top-center" richColors />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}