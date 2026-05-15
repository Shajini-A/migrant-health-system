import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Import Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Admin
import AdminDashboard from './pages/admin/Dashboard';
import AddDoctor from './pages/admin/AddDoctor';

// Doctor
import DoctorDashboard from './pages/doctor/Dashboard';
import UploadRecord from './pages/doctor/UploadRecord';

// Migrant
import MigrantDashboard from './pages/migrant/Dashboard';
import BookAppointment from './pages/migrant/BookAppointment';
import ViewRecords from './pages/migrant/ViewRecords';
import MedicalReport from './pages/migrant/MedicalReport';

// Custom Theme
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    background: { default: '#f4f6f8' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  }
});

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}/dashboard`} />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.role}/dashboard`} />} />
      
      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/add-doctor" element={<ProtectedRoute allowedRoles={['admin']}><AddDoctor /></ProtectedRoute>} />

      {/* Doctor */}
      <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
      <Route path="/doctor/upload-record" element={<ProtectedRoute allowedRoles={['doctor']}><UploadRecord /></ProtectedRoute>} />

      {/* Migrant */}
      <Route path="/migrant/dashboard" element={<ProtectedRoute allowedRoles={['migrant']}><MigrantDashboard /></ProtectedRoute>} />
      <Route path="/migrant/book-appointment" element={<ProtectedRoute allowedRoles={['migrant']}><BookAppointment /></ProtectedRoute>} />
      <Route path="/migrant/records" element={<ProtectedRoute allowedRoles={['migrant']}><ViewRecords /></ProtectedRoute>} />
      <Route path="/report/:id" element={<ProtectedRoute allowedRoles={['migrant', 'doctor']}><MedicalReport /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
