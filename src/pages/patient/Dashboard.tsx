import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { BlockchainBadge } from '@/components/shared/BlockchainBadge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  FileText,
  Users,
  Activity,
  Upload,
  Eye,
  Clock,
  ArrowRight,
  Shield,
  Bell,
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [accessRequests, setAccessRequests] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportsData, requestsData, logsData] = await Promise.all([
          api.getReports(),
          api.getAccessRequests(),
          api.getActivityLogs(),
        ]);

        setReports(reportsData);
        setAccessRequests(requestsData);
        setActivityLogs(logsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const recentReports = reports.slice(0, 3);
  const pendingRequests = accessRequests.filter(r => r.status === 'pending');
  const recentActivity = activityLogs.slice(0, 4);

  const activePermissions = reports.reduce((count, report) => {
    return count + (report.access_count || 0);
  }, 0);

  if (isLoading) {
    return (
      <DashboardLayout role="patient">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="patient">
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'User'}</h1>
            <p className="text-muted-foreground">Manage your medical records and access permissions</p>
          </div>
          <Button asChild>
            <Link to="/patient/upload">
              <Upload className="h-4 w-4" />
              Upload Report
            </Link>
          </Button>
        </div>

        {/* Pending Access Requests Alert */}
        {pendingRequests.length > 0 && (
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl flex items-start gap-4 animate-fade-in">
            <div className="p-2 rounded-lg bg-warning/20">
              <Bell className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-warning">Pending Access Requests</h3>
              <p className="text-sm text-muted-foreground">
                You have {pendingRequests.length} pending request{pendingRequests.length > 1 ? 's' : ''} from healthcare providers.
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/patient/access">
                Review
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Reports"
            value={reports.length}
            description="Medical documents uploaded"
            icon={FileText}
            variant="primary"
          />
          <StatCard
            title="Active Permissions"
            value={activePermissions}
            description="Doctors with access"
            icon={Users}
            variant="secondary"
          />
          <StatCard
            title="Pending Requests"
            value={pendingRequests.length}
            description="Awaiting your approval"
            icon={Clock}
            variant="default"
          />
          <StatCard
            title="Recent Activity"
            value={recentActivity.length}
            description="Actions this week"
            icon={Activity}
            variant="success"
          />
        </div>

        {/* Empty State */}
        {reports.length === 0 && (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Medical Reports Yet</h3>
            <p className="text-muted-foreground mb-6">
              Get started by uploading your first medical report to the blockchain.
            </p>
            <Button asChild>
              <Link to="/patient/upload">
                <Upload className="h-4 w-4" />
                Upload Your First Report
              </Link>
            </Button>
          </div>
        )}

        {/* Main Content Grid */}
        {reports.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Reports */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Reports</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/patient/reports">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{report.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {report.description || 'No description'}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{format(new Date(report.created_at), 'MMM d, yyyy')}</span>
                            <span>{report.file_size || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusBadge status={report.status || 'active'} />
                        {report.transaction_hash && <BlockchainBadge transactionHash={report.transaction_hash} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Activity</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/patient/activity">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {recentActivity.length > 0 ? recentActivity.map((log) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className={`p-1.5 rounded-full ${log.action === 'upload' ? 'bg-primary/10' :
                        log.action === 'view' ? 'bg-secondary/10' :
                          log.action === 'grant_access' ? 'bg-success/10' :
                            log.action === 'revoke_access' ? 'bg-destructive/10' :
                              'bg-muted'
                      }`}>
                      {log.action === 'upload' && <Upload className="h-4 w-4 text-primary" />}
                      {log.action === 'view' && <Eye className="h-4 w-4 text-secondary" />}
                      {log.action === 'grant_access' && <Users className="h-4 w-4 text-success" />}
                      {log.action === 'revoke_access' && <Shield className="h-4 w-4 text-destructive" />}
                      {log.action === 'request_access' && <Clock className="h-4 w-4 text-warning" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{log.details}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/patient/upload"
            className="p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Upload Report</p>
                <p className="text-sm text-muted-foreground">Add new medical document</p>
              </div>
            </div>
          </Link>

          <Link
            to="/patient/access"
            className="p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="font-medium">Manage Access</p>
                <p className="text-sm text-muted-foreground">Control permissions</p>
              </div>
            </div>
          </Link>

          <Link
            to="/patient/reports"
            className="p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted group-hover:bg-muted/80 transition-colors">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium">View Reports</p>
                <p className="text-sm text-muted-foreground">Browse all records</p>
              </div>
            </div>
          </Link>

          <Link
            to="/patient/activity"
            className="p-4 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10 group-hover:bg-success/20 transition-colors">
                <Activity className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="font-medium">Activity Log</p>
                <p className="text-sm text-muted-foreground">View all activities</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
