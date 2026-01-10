import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/shared/StatCard';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { BlockchainBadge } from '@/components/shared/BlockchainBadge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle,
  Search,
  ArrowRight,
  Eye,
  User,
  Calendar,
} from 'lucide-react';
import { mockReports, mockDoctor } from '@/data/mockData';
import { format } from 'date-fns';

export default function DoctorDashboard() {
  // Mock data for doctor's perspective
  const approvedReports = mockReports.filter(report => 
    report.accessList.some(a => a.doctorId === mockDoctor.id && a.status === 'active')
  );
  const pendingRequests = 2;

  return (
    <DashboardLayout role="doctor" userName={mockDoctor.name}>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {mockDoctor.name}</h1>
            <p className="text-muted-foreground">{mockDoctor.specialization} • {mockDoctor.hospital}</p>
          </div>
          <Button asChild>
            <Link to="/doctor/request">
              <Search className="h-4 w-4" />
              Request Patient Access
            </Link>
          </Button>
        </div>

        {/* Verification Status */}
        {mockDoctor.isVerified && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-xl flex items-center gap-4">
            <div className="p-2 rounded-lg bg-success/20">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-success">Verified Doctor</h3>
              <p className="text-sm text-muted-foreground">
                Your medical license has been verified. License: {mockDoctor.licenseNumber}
              </p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Approved Reports"
            value={approvedReports.length}
            description="Patient records you can access"
            icon={FileText}
            variant="primary"
          />
          <StatCard
            title="Pending Requests"
            value={pendingRequests}
            description="Awaiting patient approval"
            icon={Clock}
            variant="default"
          />
          <StatCard
            title="Patients"
            value={approvedReports.length}
            description="Patients who granted access"
            icon={User}
            variant="secondary"
          />
          <StatCard
            title="This Month"
            value={5}
            description="Reports reviewed"
            icon={CheckCircle}
            variant="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Approved Reports */}
          <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Recently Approved Reports</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/doctor/reports">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {approvedReports.length > 0 ? (
              <div className="space-y-4">
                {approvedReports.map((report) => {
                  const permission = report.accessList.find(
                    a => a.doctorId === mockDoctor.id && a.status === 'active'
                  );
                  return (
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
                              {report.description}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                Patient ID: {report.patientId}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(report.uploadDate, 'MMM d, yyyy')}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <StatusBadge status="active" />
                          {permission?.expiresAt && (
                            <span className="text-xs text-muted-foreground">
                              Expires: {format(permission.expiresAt, 'MMM d')}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <BlockchainBadge 
                          transactionHash={report.transactionHash}
                          ipfsHash={report.ipfsHash}
                        />
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                          View Report
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Approved Reports</h3>
                <p className="text-muted-foreground mb-4">
                  Request access to patient records to view them here.
                </p>
                <Button asChild>
                  <Link to="/doctor/request">
                    <Search className="h-4 w-4" />
                    Request Access
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Quick Actions & Pending */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link
                  to="/doctor/request"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Request Access</p>
                    <p className="text-sm text-muted-foreground">Search patient records</p>
                  </div>
                </Link>
                <Link
                  to="/doctor/reports"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <FileText className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">View Reports</p>
                    <p className="text-sm text-muted-foreground">Browse approved records</p>
                  </div>
                </Link>
                <Link
                  to="/doctor/history"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="p-2 rounded-lg bg-muted">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Access History</p>
                    <p className="text-sm text-muted-foreground">View past requests</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Pending Requests */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4">Pending Requests</h2>
              <div className="space-y-3">
                <div className="p-3 bg-warning/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="font-medium text-sm">Patient #P-1234</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Requested 2 days ago</p>
                </div>
                <div className="p-3 bg-warning/10 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="font-medium text-sm">Patient #P-5678</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Requested 5 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
