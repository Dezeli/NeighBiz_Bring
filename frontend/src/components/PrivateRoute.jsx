import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ isAuthenticated, loading, children }) => {
  const { user } = useAuth(); // AuthContext에서 불러옴
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "owner" && !user?.profile?.is_verified) {
    if (location.pathname !== "/owner/verify") {
      return <Navigate to="/owner/verify" replace />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;
