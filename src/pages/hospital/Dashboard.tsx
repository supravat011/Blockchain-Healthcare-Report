import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Building,
  Users,
  Activity,
  CheckCircle,
  Clock,
  ArrowRight,
  Shield,
  AlertTriangle,
  Eye,
  FileText,
} from 'lucide-react';
import { mockDoctors, mockActivityLogs } from '@/data/mockData';
import { format } from 'date-fns';

export default function HospitalDashboard() {
  const verifiedDoctors = mockDoctors.filter(d => d.isVerified);
  const pendingVerifications = mockDoctors.filter(d => !d.isVerified);

  return (
    <DashboardLayout role="hospital" userName="City General Hospital">
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Hospital Administration</h1>
          <p className="text-muted-foreground">Manage doctors and monitor platform activity</p>
        </div>

        {/* Pending Verifications Alert */}
        {pendingVerifications.length > 0 && (
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl flex items-start gap-4 animate-fade-in">
            <div className="p-2 rounded-lg bg-warning/20">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-warning">Pending Doctor Verifications</h3>
              <p className="text-sm text-muted-foreground">
                {pendingVerifications.length} doctor{pendingVerifications.length > 1 ? 's' : ''} awaiting verification.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/hospital/verify">
                Review
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Verified Doctors"
            value={verifiedDoctors.length}
            description="Active on platform"
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            title="Pending Verifications"
            value={pendingVerifications.length}
            description="Awaiting review"
            icon={Clock}
            variant="default"
          />
          <StatCard
            title="Total Patients"
            value={156}
            description="Registered users"
            icon={Users}
            variant="primary"
          />
          <StatCard
            title="System Activity"
            value={mockActivityLogs.length}
            description="Events this week"
            icon={Activity}
            variant="secondary"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Activity Logs */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">System Activity Logs</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/hospital/logs">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Details</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {mockActivityLogs.slice(0, 5).map((log) => (
                    <tr key={log.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <Users className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{log.userName}</p>
                            <p className="text-xs text-muted-foreground capitalize">{log.userRole}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          log.action === 'upload' ? 'bg-primary/10 text-primary' :
                          log.action === 'view' ? 'bg-secondary/10 text-secondary' :
                          log.action === 'grant_access' ? 'bg-success/10 text-success' :
                          log.action === 'revoke_access' ? 'bg-destructive/10 text-destructive' :
                          'bg-warning/10 text-warning'
                        }`}>
                          {log.action.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">
                          {log.details}
                        </p>
                      </td>
                      <td>
                        <span className="text-sm text-muted-foreground">
                          {format(log.timestamp, 'MMM d, h:mm a')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats & Actions */}
          <div className="space-y-6">
            {/* Hospital Info */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Building className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">City General Hospital</h3>
                  <p className="text-sm text-muted-foreground">Hospital ID: HOS-2024-001</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="verified" />
                <span className="text-xs text-muted-foreground">Blockchain Verified</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/hospital/verify"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Verify Doctors</p>
                    <p className="text-sm text-muted-foreground">Review pending accounts</p>
                  </div>
                </Link>
                <Link
                  to="/hospital/logs"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Activity className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">Access Logs</p>
                    <p className="text-sm text-muted-foreground">Monitor all activity</p>
                  </div>
                </Link>
                <Link
                  to="/hospital/profile"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="p-2 rounded-lg bg-muted">
                    <Building className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Hospital Profile</p>
                    <p className="text-sm text-muted-foreground">Manage hospital info</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Security Status */}
            <div className="bg-success/10 border border-success/20 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-success" />
                <div>
                  <p className="font-semibold text-success">System Secure</p>
                  <p className="text-xs text-muted-foreground">All security checks passed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Overview */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Registered Doctors</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/hospital/verify">
                Manage
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockDoctors.map((doctor) => (
              <div key={doctor.id} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{doctor.name}</h4>
                    <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge status={doctor.isVerified ? 'verified' : 'unverified'} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
