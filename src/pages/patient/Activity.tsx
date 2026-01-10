import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BlockchainBadge } from '@/components/shared/BlockchainBadge';
import {
  Activity,
  Search,
  Upload,
  Eye,
  Users,
  Shield,
  Clock,
  Filter,
} from 'lucide-react';
import { mockActivityLogs, mockPatient } from '@/data/mockData';
import { format } from 'date-fns';
import { ActivityLog } from '@/types';

export default function PatientActivity() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  const actionFilters = [
    { id: 'all', label: 'All Activities' },
    { id: 'upload', label: 'Uploads' },
    { id: 'view', label: 'Views' },
    { id: 'grant_access', label: 'Access Granted' },
    { id: 'revoke_access', label: 'Access Revoked' },
    { id: 'request_access', label: 'Access Requests' },
  ];

  const filteredLogs = mockActivityLogs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.reportTitle && log.reportTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const getActionIcon = (action: ActivityLog['action']) => {
    switch (action) {
      case 'upload':
        return <Upload className="h-5 w-5 text-primary" />;
      case 'view':
        return <Eye className="h-5 w-5 text-secondary" />;
      case 'grant_access':
        return <Users className="h-5 w-5 text-success" />;
      case 'revoke_access':
        return <Shield className="h-5 w-5 text-destructive" />;
      case 'request_access':
        return <Clock className="h-5 w-5 text-warning" />;
      default:
        return <Activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getActionBgClass = (action: ActivityLog['action']) => {
    switch (action) {
      case 'upload':
        return 'bg-primary/10';
      case 'view':
        return 'bg-secondary/10';
      case 'grant_access':
        return 'bg-success/10';
      case 'revoke_access':
        return 'bg-destructive/10';
      case 'request_access':
        return 'bg-warning/10';
      default:
        return 'bg-muted';
    }
  };

  const getActionLabel = (action: ActivityLog['action']) => {
    switch (action) {
      case 'upload':
        return 'Upload';
      case 'view':
        return 'View';
      case 'grant_access':
        return 'Access Granted';
      case 'revoke_access':
        return 'Access Revoked';
      case 'request_access':
        return 'Access Request';
      default:
        return action;
    }
  };

  return (
    <DashboardLayout role="patient" userName={mockPatient.name}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Activity Log</h1>
          <p className="text-muted-foreground">Track all activities related to your medical records</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {actionFilters.map((filter) => (
              <Button
                key={filter.id}
                variant={filterAction === filter.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterAction(filter.id)}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-card rounded-xl border border-border p-6">
          {filteredLogs.length > 0 ? (
            <div className="space-y-6">
              {filteredLogs.map((log, index) => (
                <div key={log.id} className="relative">
                  {/* Timeline Line */}
                  {index < filteredLogs.length - 1 && (
                    <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-border" />
                  )}
                  
                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full ${getActionBgClass(log.action)} flex items-center justify-center z-10`}>
                      {getActionIcon(log.action)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getActionBgClass(log.action)}`}>
                            {getActionLabel(log.action)}
                          </span>
                          <span className="text-sm font-medium">{log.userName}</span>
                          {log.userRole !== 'patient' && (
                            <span className="text-xs text-muted-foreground">
                              ({log.userRole})
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(log.timestamp, 'MMM d, yyyy • h:mm a')}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">{log.details}</p>

                      {log.reportTitle && (
                        <p className="text-sm text-muted-foreground">
                          Report: <span className="font-medium text-foreground">{log.reportTitle}</span>
                        </p>
                      )}

                      {log.transactionHash && (
                        <div className="mt-2">
                          <BlockchainBadge transactionHash={log.transactionHash} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Activities Found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterAction !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Your activity log is empty'}
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
