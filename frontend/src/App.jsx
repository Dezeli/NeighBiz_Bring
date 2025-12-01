import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

/* -------------------------
   Consumer Pages
------------------------- */
import ConsumerAuthPage from "./pages/consumer/auth/ConsumerAuthPage";
import IssuePage from "./pages/consumer/coupons/IssuePage";

/* -------------------------
   Owner - Auth
------------------------- */
import OwnerLoginPage from "./pages/owner/auth/OwnerLoginPage";
import OwnerSignupPage from "./pages/owner/auth/OwnerSignupPage";
import OwnerFindIdPage from "./pages/owner/auth/OwnerFindIdPage";
import OwnerResetPasswordPage from "./pages/owner/auth/OwnerResetPasswordPage";
import OwnerVerifyPage from "./pages/owner/auth/OwnerVerifyPage";

/* -------------------------
   Owner - Public
------------------------- */
import LandingPage from "./pages/owner/public/LandingPage";

/* -------------------------
   Owner - Profile
------------------------- */
import OwnerProfilePage from "./pages/owner/profile/OwnerProfilePage";
import OwnerProfileEditPage from "./pages/owner/profile/OwnerProfileEditPage";
import OwnerStatsPage from "./pages/owner/profile/OwnerStatsPage";

/* -------------------------
   Owner - Coupons
------------------------- */
import CouponSetupPage from "./pages/owner/coupons/CouponSetupPage";
import CouponEditPage from "./pages/owner/coupons/CouponEditPage";

/* -------------------------
   Owner - Posts
------------------------- */
import PostsListPage from "./pages/owner/posts/PostsListPage";
import PostDetailPage from "./pages/owner/posts/PostDetailPage";

/* -------------------------
   Owner - Proposals
------------------------- */
import ProposalPage from "./pages/owner/proposals/ProposalPage";
import ProposalDetailPage from "./pages/owner/proposals/ProposalDetailPage";
import ProposalCreatePage from "./pages/owner/proposals/ProposalCreatePage";

function App() {
  const { isAuthenticated, loading } = useAuth();

  return (
    <Routes>
      {/* Consumer */}
      <Route path="/consumer/auth" element={<ConsumerAuthPage />} />
      <Route path="/issue/:slug" element={<IssuePage />} />

      {/* Owner - Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<OwnerLoginPage />} />
      <Route path="/signup" element={<OwnerSignupPage />} />
      <Route path="/find-id" element={<OwnerFindIdPage />} />
      <Route path="/reset-password" element={<OwnerResetPasswordPage />} />

      {/* Owner - Verify (로그인 필수, 인증 미완료 시 접근 허용) */}
      <Route
        path="/owner/verify"
        element={
          isAuthenticated ? <OwnerVerifyPage /> : <Navigate to="/login" replace />
        }
      />

      {/* Owner - Profile */}
      <Route
        path="/owner/profile"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
            <OwnerProfilePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/owner/profile/edit"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
            <OwnerProfileEditPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/owner/stats/:slug"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
            <OwnerStatsPage />
          </PrivateRoute>
        }
      />

      {/* Owner - Coupons */}
      <Route
        path="/owner/coupons"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
            <CouponSetupPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/owner/coupons/edit"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
            <CouponEditPage />
          </PrivateRoute>
        }
      />

      {/* Owner - Posts */}
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

      {/* Owner - Proposals */}
      <Route
        path="/owner/proposals"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
            <ProposalPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/owner/proposals/:proposalId"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
            <ProposalDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/owner/proposal/send/:postId"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated} loading={loading}>
            <ProposalCreatePage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
