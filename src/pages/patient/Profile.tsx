import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Droplet,
  Wallet,
  Edit,
  Save,
  Copy,
  CheckCircle,
  Shield,
} from 'lucide-react';
import { mockPatient } from '@/data/mockData';
import { format } from 'date-fns';

export default function PatientProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: mockPatient.name,
    email: mockPatient.email,
    phone: mockPatient.emergencyContact || '',
    dateOfBirth: mockPatient.dateOfBirth || '',
    bloodType: mockPatient.bloodType || '',
  });

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(mockPatient.walletAddress || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setIsEditing(false);
    // In real app, save to backend
  };

  return (
    <DashboardLayout role="patient" userName={mockPatient.name}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your personal information</p>
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
              <User className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{mockPatient.name}</h2>
              <p className="text-muted-foreground">{mockPatient.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="status-badge status-active">
                  <CheckCircle className="h-3 w-3" />
                  Verified Account
                </span>
                <span className="text-sm text-muted-foreground">
                  Member since {format(mockPatient.createdAt, 'MMMM yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="font-semibold border-b border-border pb-2">Personal Information</h3>
            
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
                <Label htmlFor="phone">Emergency Contact</Label>
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
                <Label htmlFor="dob">Date of Birth</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                    className="pl-10"
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <div className="relative">
                  <Droplet className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="bloodType"
                    value={formData.bloodType}
                    onChange={(e) => setFormData(prev => ({ ...prev, bloodType: e.target.value }))}
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
              <p className="font-mono text-sm truncate">{mockPatient.walletAddress}</p>
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

          <div className="mt-4 p-4 bg-primary/5 rounded-lg flex items-start gap-3">
            <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-primary">Wallet Security</p>
              <p className="text-sm text-muted-foreground">
                Your wallet is used for secure authentication and signing blockchain transactions.
                Never share your private key with anyone.
              </p>
            </div>
          </div>
        </div>

        {/* Medical Summary */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold border-b border-border pb-2 mb-6">Medical Summary</h3>
          
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-3xl font-bold text-primary">4</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-3xl font-bold text-secondary">1</p>
              <p className="text-sm text-muted-foreground">Active Permissions</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-3xl font-bold text-success">5</p>
              <p className="text-sm text-muted-foreground">Activities This Month</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
