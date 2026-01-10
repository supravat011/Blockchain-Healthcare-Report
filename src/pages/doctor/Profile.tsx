import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  Mail,
  Phone,
  FileText,
  Stethoscope,
  Building,
  Wallet,
  Edit,
  Save,
  Copy,
  CheckCircle,
  Shield,
  Award,
} from 'lucide-react';
import { mockDoctor } from '@/data/mockData';
import { format } from 'date-fns';
import { StatusBadge } from '@/components/shared/StatusBadge';

export default function DoctorProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: mockDoctor.name,
    email: mockDoctor.email,
    phone: '+1 (555) 987-6543',
    specialization: mockDoctor.specialization,
    hospital: mockDoctor.hospital || '',
    licenseNumber: mockDoctor.licenseNumber,
  });

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(mockDoctor.walletAddress || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <DashboardLayout role="doctor" userName={mockDoctor.name}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Doctor Profile</h1>
            <p className="text-muted-foreground">Manage your professional information</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
              <Stethoscope className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{mockDoctor.name}</h2>
              <p className="text-muted-foreground">{mockDoctor.specialization}</p>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <StatusBadge status={mockDoctor.isVerified ? 'verified' : 'unverified'} />
                <span className="text-sm text-muted-foreground">
                  Member since {format(mockDoctor.createdAt, 'MMMM yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          {mockDoctor.isVerified && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg mb-6 flex items-center gap-4">
              <div className="p-2 rounded-lg bg-success/20">
                <Award className="h-6 w-6 text-success" />
              </div>
              <div>
                <h4 className="font-semibold text-success">Verified Medical Professional</h4>
                <p className="text-sm text-muted-foreground">
                  Your credentials have been verified by the platform.
                </p>
              </div>
            </div>
          )}

          {/* Professional Information */}
          <div className="space-y-6">
            <h3 className="font-semibold border-b border-border pb-2">Professional Information</h3>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="license">Medical License Number</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="license"
                    value={formData.licenseNumber}
                    className="pl-10"
                    disabled
                  />
                </div>
                <p className="text-xs text-muted-foreground">License number cannot be changed</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) => setFormData(prev => ({ ...prev, specialization: e.target.value }))}
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital / Clinic</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="hospital"
                    value={formData.hospital}
                    onChange={(e) => setFormData(prev => ({ ...prev, hospital: e.target.value }))}
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet Information */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold border-b border-border pb-2 mb-6">Blockchain Wallet</h3>
          
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="p-3 rounded-xl bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground mb-1">Connected Wallet Address</p>
              <p className="font-mono text-sm truncate">{mockDoctor.walletAddress}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleCopyWallet}>
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold border-b border-border pb-2 mb-6">Activity Summary</h3>
          
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-3xl font-bold text-primary">1</p>
              <p className="text-sm text-muted-foreground">Approved Reports</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-3xl font-bold text-secondary">2</p>
              <p className="text-sm text-muted-foreground">Pending Requests</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-3xl font-bold text-success">5</p>
              <p className="text-sm text-muted-foreground">Reports Reviewed</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
