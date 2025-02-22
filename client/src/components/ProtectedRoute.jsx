import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "./Sidebar";
import { useState } from "react";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="flex h-screen">
      <div
        className={`transition-all duration-300 ${
          isSidebarHovered ? "w-2/12" : "w-16"
        }`}
      >
        <Sidebar onHoverChange={setIsSidebarHovered} />
      </div>
      <div className="transition-all duration-300 flex-1">{children}</div>
    </div>
  );
};

export default ProtectedRoute;
