import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { MainLayout } from '../components/layout/MainLayout';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { UnauthorizedPage } from '../features/auth/pages/UnauthorizedPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { InvitationsPage } from '../features/invitations/pages/InvitationsPage';
import { QuotesPage } from '../features/quotes/pages/QuotesPage';
import { OrdersPage } from '../features/orders/pages/OrdersPage';
import { FinancePage } from '../features/finance/pages/FinancePage';
import { ReportsPage } from '../features/admin/pages/ReportsPage';
import { AnalyticsPage } from '../features/analytics/pages/AnalyticsPage';
import { SupportPage } from '../features/admin/pages/SupportPage';
import { AuditLogsPage } from '../features/admin/pages/AuditLogsPage';
import { SettingsPage } from '../features/admin/pages/SettingsPage';
import { UsersPage } from '../features/users/pages/UsersPage';
import { RoomsPage } from '../features/rooms/pages/RoomsPage';
import { RoomWorkspace } from '../features/rooms/pages/RoomWorkspace';
import { StockPage } from '../features/stock/pages/StockPage';
import { RequireAuth } from '../features/auth/components/RequireAuth';
import { RequireRole } from '../features/auth/components/RequireRole';
import { ROLES } from '../core/config';

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/unauthorized" element={<UnauthorizedPage />} />
            </Route>

            {/* Protected Routes */}
            <Route
                element={
                    <RequireAuth>
                        <MainLayout />
                    </RequireAuth>
                }
            >
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                <Route path="/dashboard" element={<DashboardPage />} />

                {/* Sales & Owner Routes */}
                <Route path="/invitations" element={
                    <RequireRole roles={[ROLES.OWNER, ROLES.ADMIN, ROLES.SALES]}>
                        <InvitationsPage />
                    </RequireRole>
                } />
                <Route path="/active-rooms" element={
                    <RequireRole roles={[ROLES.OWNER, ROLES.ADMIN, ROLES.SALES]}>
                        <RoomsPage />
                    </RequireRole>
                } />
                <Route path="/active-rooms/:id" element={
                    <RequireRole roles={[ROLES.OWNER, ROLES.ADMIN, ROLES.SALES]}>
                        <RoomWorkspace />
                    </RequireRole>
                } />
                <Route path="/quotes" element={
                    <RequireRole roles={[ROLES.OWNER, ROLES.SALES, ROLES.FINANCE]}>
                        <QuotesPage />
                    </RequireRole>
                } />
                <Route path="/orders" element={
                    <RequireRole roles={[ROLES.OWNER, ROLES.SALES, ROLES.OPS]}>
                        <OrdersPage />
                    </RequireRole>
                } />

                {/* Ops Routes */}
                <Route path="/stock" element={
                    <RequireRole roles={[ROLES.OWNER, ROLES.SALES, ROLES.OPS]}>
                        <StockPage />
                    </RequireRole>
                } />

                {/* Finance Routes */}
                <Route path="/billing" element={
                    <RequireRole roles={[ROLES.OWNER, ROLES.FINANCE]}>
                        <FinancePage />
                    </RequireRole>
                } />
                <Route path="/financials" element={
                    <RequireRole roles={[ROLES.OWNER, ROLES.FINANCE]}>
                        <ReportsPage />
                    </RequireRole>
                } />

                {/* Admin/Owner Routes */}
                <Route path="/analytics" element={
                    <RequireRole roles={[ROLES.OWNER, ROLES.ADMIN]}>
                        <AnalyticsPage />
                    </RequireRole>
                } />
                <Route path="/users" element={
                    <RequireRole roles={[ROLES.OWNER]}>
                        <UsersPage />
                    </RequireRole>
                } />
                <Route path="/audit" element={
                    <RequireRole roles={[ROLES.OWNER, ROLES.ADMIN]}>
                        <AuditLogsPage />
                    </RequireRole>
                } />
                <Route path="/support" element={
                    <RequireRole roles={[ROLES.OWNER, ROLES.SALES, ROLES.FINANCE, ROLES.OPS]}>
                        <SupportPage />
                    </RequireRole>
                } />
                <Route path="/settings" element={
                    <RequireRole roles={[ROLES.OWNER]}>
                        <SettingsPage />
                    </RequireRole>
                } />
                <Route path="/audit-logs" element={
                    <RequireRole roles={[ROLES.OWNER]}>
                        <AuditLogsPage />
                    </RequireRole>
                } />

                {/* Common Routes */}
                {/* The following routes were moved into Admin/Owner Routes with RequireRole */}
                {/* <Route path="/support" element={<FeaturePlaceholder title="Support & Disputes" />} /> */}
                {/* <Route path="/settings" element={<FeaturePlaceholder title="Settings" />} /> */}

            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};
