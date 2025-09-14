import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OwnerLandingPage from './pages/OwnerLandingPage';
import OwnerLoginPage from './pages/OwnerLoginPage';
import FindIdPage from './pages/FindIdPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OwnerSignupPage from './pages/OwnerSignupPage';
import OwnerMyPage from './pages/OwnerMyPage';
import CouponSetupPage from './pages/CouponSetupPage';
import PostsListPage from './pages/PostsListPage';
import IssuePage from './pages/IssuePage';
import PostDetailPage from './pages/PostDetailPage';
import OwnerStatsPage from './pages/OwnerStatsPage';
import ProposalDetailPage from './pages/ProposalDetailPage';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<OwnerLandingPage />} />
      <Route path="/login" element={<OwnerLoginPage />} />
      <Route path="/find-id" element={<FindIdPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/signup" element={<OwnerSignupPage />} />
      <Route
        path="/owner/mypage"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
            <OwnerMyPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/owner/coupon-setup"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
            <CouponSetupPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/owner/posts"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
            <PostsListPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/owner/post/:id"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
            <PostDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/owner/stats"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
            <OwnerStatsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/owner/proposal/received/:proposalId"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
            <ProposalDetailPage />
          </PrivateRoute>
        }
      />
      <Route path="/issue/:slug" element={<IssuePage />} />
    </Routes>
  );
}

export default App;
