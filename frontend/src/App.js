import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import NoteEditor from './pages/Editor/NoteEditor';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import Favorites from './pages/Favorites/Favorites';
import Archive from './pages/Archive/Archive';
import Tags from './pages/Tags/Tags';
import Notebooks from './pages/Notebooks/Notebooks';

// Components
import Layout from './components/layout/Layout';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/editor" element={
        <ProtectedRoute>
          <Layout>
            <NoteEditor />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/editor/:id" element={
        <ProtectedRoute>
          <Layout>
            <NoteEditor />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <Settings />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/favorites" element={
        <ProtectedRoute>
          <Layout>
            <Favorites />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/archive" element={
        <ProtectedRoute>
          <Layout>
            <Archive />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/tags" element={
        <ProtectedRoute>
          <Layout>
            <Tags />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/notebooks" element={
        <ProtectedRoute>
          <Layout>
            <Notebooks />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
