import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AppLayout } from "./components/layout/AppLayout";
import { AdminLayout } from "./pages/admin/AdminLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StrategyPage from "./pages/StrategyPage";
import HistoryPage from "./pages/HistoryPage";
import CircuitsPage from "./pages/CircuitsPage";
import DriversAdminPage from "./pages/admin/DriversAdminPage";
import TeamsAdminPage from "./pages/admin/TeamsAdminPage";
import CircuitsAdminPage from "./pages/admin/CircuitsAdminPage";
import EventsAdminPage from "./pages/admin/EventsAdminPage";
import { RaceDataProvider } from "./context/RaceDataContext";
import { AdminDataProvider } from "./context/AdminDataContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <RaceDataProvider>
                <AppLayout />
              </RaceDataProvider>
            }
          >
            {" "}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/strategia" element={<StrategyPage />} />
            <Route path="/storico" element={<HistoryPage />} />
            <Route path="/circuiti" element={<CircuitsPage />} />
            <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
              <Route
                path="/admin"
                element={
                  <AdminDataProvider>
                    <AdminLayout />
                  </AdminDataProvider>
                }
              >
                <Route index element={<Navigate to="piloti" replace />} />
                <Route path="piloti" element={<DriversAdminPage />} />
                <Route path="team" element={<TeamsAdminPage />} />
                <Route path="circuiti" element={<CircuitsAdminPage />} />
                <Route path="eventi" element={<EventsAdminPage />} />
              </Route>
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
