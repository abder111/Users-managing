import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Navbar from './components/Navbar';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return user && user.role === 'admin' ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <div className="container">
                      <Dashboard />
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <AdminRoute>
                  <div>
                    <Navbar />
                    <div className="container">
                      <UserList />
                    </div>
                  </div>
                </AdminRoute>
              } 
            />
            <Route 
              path="/users/new" 
              element={
                <AdminRoute>
                  <div>
                    <Navbar />
                    <div className="container">
                      <UserForm />
                    </div>
                  </div>
                </AdminRoute>
              } 
            />
            <Route 
              path="/users/edit/:id" 
              element={
                <AdminRoute>
                  <div>
                    <Navbar />
                    <div className="container">
                      <UserForm />
                    </div>
                  </div>
                </AdminRoute>
              } 
            />
            <Route 
              path="/tasks" 
              element={
                <ProtectedRoute>
                  <div>
                    <Navbar />
                    <div className="container">
                      <TaskList />
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tasks/new" 
              element={
                <AdminRoute>
                  <div>
                    <Navbar />
                    <div className="container">
                      <TaskForm />
                    </div>
                  </div>
                </AdminRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 