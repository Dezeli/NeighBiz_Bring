import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OwnerLandingPage from './pages/OwnerLandingPage';
import OwnerLoginPage from './pages/OwnerLoginPage';
import OwnerSignupPage from './pages/OwnerSignupPage';
import OwnerMyPage from './pages/OwnerMyPage';
import CouponSetupPage from './pages/CouponSetupPage';
import PostsListPage from './pages/PostsListPage';
import IssuePage from './pages/IssuePage';
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
      {/* 소비자용 QR 스캔 페이지 - 인증 불필요 */}
      <Route path="/issue/:slug" element={<IssuePage />} />
    </Routes>
  );
}

export default App;