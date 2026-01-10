import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { BlockchainBadge } from '@/components/shared/BlockchainBadge';
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Shield,
  Calendar,
  User,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockReports, mockAccessRequests, mockPatient, mockDoctors } from '@/data/mockData';
import { format } from 'date-fns';

export default function PatientAccessControl() {
  const [searchQuery, setSearchQuery] = useState('');
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<any>(null);
  const [grantDialogOpen, setGrantDialogOpen] = useState(false);

  const pendingRequests = mockAccessRequests.filter(r => r.status === 'pending');
  
  const activePermissions = mockReports.flatMap(report => 
    report.accessList
      .filter(a => a.status === 'active')
      .map(a => ({ ...a, reportTitle: report.title, reportId: report.id }))
  );

  const handleApproveRequest = (requestId: string) => {
    console.log('Approving request:', requestId);
    // In real app, this would call the blockchain
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Rejecting request:', requestId);
    // In real app, this would call the blockchain
  };

  const handleRevokeAccess = () => {
    console.log('Revoking access:', selectedPermission);
    setRevokeDialogOpen(false);
    setSelectedPermission(null);
  };

  return (
    <DashboardLayout role="patient" userName={mockPatient.name}>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Access Control</h1>
          <p className="text-muted-foreground">Manage who can view your medical records</p>
        </div>

        {/* Pending Requests Section */}
        {pendingRequests.length > 0 && (
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Pending Access Requests</h2>
                <p className="text-sm text-muted-foreground">
                  {pendingRequests.length} request{pendingRequests.length > 1 ? 's' : ''} awaiting your decision
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 bg-muted/30 rounded-xl border border-border"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{request.doctorName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Requested on {format(request.requestedAt, 'MMM d, yyyy')}
                        </p>
                        <p className="text-sm mt-2">{request.reason}</p>
                        {request.reportId && (
                          <p className="text-sm text-muted-foreground mt-1">
                            For report: {mockReports.find(r => r.id === request.reportId)?.title}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 lg:flex-shrink-0">
                      <Button
                        variant="outline"
                        onClick={() => handleRejectRequest(request.id)}
                        className="flex-1 lg:flex-none"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => handleApproveRequest(request.id)}
                        className="flex-1 lg:flex-none"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active Permissions Section */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Shield className="h-5 w-5 text-success" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Active Permissions</h2>
                <p className="text-sm text-muted-foreground">
                  {activePermissions.length} doctor{activePermissions.length !== 1 ? 's' : ''} with access
                </p>
              </div>
            </div>
            <Button onClick={() => setGrantDialogOpen(true)}>
              <Users className="h-4 w-4" />
              Grant Access
            </Button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by doctor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Permissions List */}
          {activePermissions.length > 0 ? (
            <div className="space-y-4">
              {activePermissions
                .filter(p => p.doctorName.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((permission) => (
                  <div
                    key={permission.id}
                    className="p-4 bg-muted/30 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{permission.doctorName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Access to: {permission.reportTitle}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Granted: {format(permission.grantedAt, 'MMM d, yyyy')}
                          </span>
                          {permission.expiresAt && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Expires: {format(permission.expiresAt, 'MMM d, yyyy')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={permission.status} />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPermission(permission);
                          setRevokeDialogOpen(true);
                        }}
                      >
                        <XCircle className="h-4 w-4" />
                        Revoke
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Permissions</h3>
              <p className="text-muted-foreground mb-4">
                You haven't granted access to any doctors yet.
              </p>
              <Button onClick={() => setGrantDialogOpen(true)}>
                <Users className="h-4 w-4" />
                Grant Access
              </Button>
            </div>
          )}
        </div>

        {/* Revoke Confirmation Dialog */}
        <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Revoke Access
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to revoke access for <strong>{selectedPermission?.doctorName}</strong>?
                They will no longer be able to view the report "{selectedPermission?.reportTitle}".
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 bg-destructive/10 rounded-lg">
              <p className="text-sm text-destructive">
                This action will be recorded on the blockchain and cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRevokeDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleRevokeAccess}>
                Revoke Access
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Grant Access Dialog */}
        <Dialog open={grantDialogOpen} onOpenChange={setGrantDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Grant Access to Doctor</DialogTitle>
              <DialogDescription>
                Select a doctor to grant access to your medical reports.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {mockDoctors.filter(d => d.isVerified).map((doctor) => (
                <div
                  key={doctor.id}
                  className="p-4 border border-border rounded-lg hover:border-primary/30 hover:bg-muted/50 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{doctor.name}</h4>
                      <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                      <p className="text-xs text-muted-foreground">{doctor.hospital}</p>
                    </div>
                    <StatusBadge status="verified" />
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setGrantDialogOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
