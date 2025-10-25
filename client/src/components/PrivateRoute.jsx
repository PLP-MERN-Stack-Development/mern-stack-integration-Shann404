import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, user }) {
  if (!user) return <Navigate to="/login" />;
  return children;
}
