import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddContact from './pages/AddContact';
import EditContact from './pages/EditContact';
import ContactDetails from './pages/ContactDetails';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC HOME PAGE */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Login page is still available */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* PUBLIC CONTACT/DASHBOARD PAGE */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* LOGIN REQUIRED FOR ADD */}
        <Route
          path="/add-contact"
          element={
            <ProtectedRoute>
              <AddContact />
            </ProtectedRoute>
          }
        />

        {/* LOGIN REQUIRED FOR EDIT */}
        <Route
          path="/edit-contact/:id"
          element={
            <ProtectedRoute>
              <EditContact />
            </ProtectedRoute>
          }
        />

        {/* PUBLIC CONTACT DETAILS */}
        <Route
          path="/contacts/:id"
          element={<ContactDetails />}
        />

        {/* Unknown URLs go to public dashboard */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;