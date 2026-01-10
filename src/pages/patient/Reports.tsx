import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { BlockchainBadge } from '@/components/shared/BlockchainBadge';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Upload,
  Eye,
  Users,
  MoreVertical,
  Download,
  Trash2,
  Filter,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { mockReports, mockPatient } from '@/data/mockData';
import { format } from 'date-fns';

export default function PatientReports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'pdf' | 'image'>('all');

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || report.fileType === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout role="patient" userName={mockPatient.name}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Medical Reports</h1>
            <p className="text-muted-foreground">View and manage your uploaded medical documents</p>
          </div>
          <Button asChild>
            <Link to="/patient/upload">
              <Upload className="h-4 w-4" />
              Upload Report
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              All
            </Button>
            <Button
              variant={filterType === 'pdf' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('pdf')}
            >
              PDF
            </Button>
            <Button
              variant={filterType === 'image' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('image')}
            >
              Images
            </Button>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Report</th>
                  <th>Upload Date</th>
                  <th>File Size</th>
                  <th>Access Status</th>
                  <th>Blockchain</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => (
                  <tr key={report.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{report.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-muted-foreground">
                        {format(report.uploadDate, 'MMM d, yyyy')}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted-foreground">{report.fileSize}</span>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <StatusBadge 
                          status={report.accessList.some(a => a.status === 'active') ? 'active' : 'pending'} 
                        />
                        {report.accessList.filter(a => a.status === 'active').length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {report.accessList.filter(a => a.status === 'active').length} active permission(s)
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <BlockchainBadge 
                        transactionHash={report.transactionHash} 
                        ipfsHash={report.ipfsHash}
                      />
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Users className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Report
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              Manage Access
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reports found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search query' : 'Upload your first medical report'}
              </p>
              <Button asChild>
                <Link to="/patient/upload">
                  <Upload className="h-4 w-4" />
                  Upload Report
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
