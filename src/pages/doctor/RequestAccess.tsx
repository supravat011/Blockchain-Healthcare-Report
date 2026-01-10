import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  User,
  Wallet,
  Send,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { mockDoctor } from '@/data/mockData';

export default function DoctorRequestAccess() {
  const [searchType, setSearchType] = useState<'id' | 'wallet'>('id');
  const [searchQuery, setSearchQuery] = useState('');
  const [reason, setReason] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [patientFound, setPatientFound] = useState<any>(null);
  const [requestSent, setRequestSent] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    // Simulate search
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (searchQuery.length > 3) {
      setPatientFound({
        id: 'p1',
        name: 'John Doe',
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8bE2F',
        reportsCount: 4,
      });
    } else {
      setPatientFound(null);
    }
    setIsSearching(false);
  };

  const handleSendRequest = async () => {
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRequestSent(true);
    setIsSearching(false);
  };

  if (requestSent) {
    return (
      <DashboardLayout role="doctor" userName={mockDoctor.name}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center animate-scale-in max-w-md">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Request Sent!</h2>
            <p className="text-muted-foreground mb-6">
              Your access request has been sent to the patient. You will be notified once they respond.
            </p>
            <Button onClick={() => {
              setRequestSent(false);
              setPatientFound(null);
              setSearchQuery('');
              setReason('');
            }}>
              Send Another Request
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="doctor" userName={mockDoctor.name}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Request Patient Access</h1>
          <p className="text-muted-foreground">Search for a patient and request access to their medical records</p>
        </div>

        {/* Search Card */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-4">Find Patient</h3>

          {/* Search Type Toggle */}
          <div className="flex gap-2 mb-4">
            <Button
              type="button"
              variant={searchType === 'id' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchType('id')}
            >
              <User className="h-4 w-4" />
              Patient ID
            </Button>
            <Button
              type="button"
              variant={searchType === 'wallet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSearchType('wallet')}
            >
              <Wallet className="h-4 w-4" />
              Wallet Address
            </Button>
          </div>

          {/* Search Input */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={searchType === 'id' ? 'Enter Patient ID (e.g., P-1234)' : 'Enter Wallet Address (0x...)'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !searchQuery}>
              {isSearching ? (
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </div>

        {/* Patient Found */}
        {patientFound && (
          <div className="bg-card rounded-xl border border-border p-6 animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                <User className="h-8 w-8 text-success" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{patientFound.name}</h3>
                <p className="text-sm text-muted-foreground font-mono">
                  {patientFound.walletAddress.slice(0, 10)}...{patientFound.walletAddress.slice(-8)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {patientFound.reportsCount} medical reports on file
                </p>
              </div>
            </div>

            {/* Request Form */}
            <div className="space-y-4 pt-6 border-t border-border">
              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Access Request</Label>
                <Textarea
                  id="reason"
                  placeholder="Please explain why you need access to this patient's medical records..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  This message will be sent to the patient for their review.
                </p>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm">
                    The patient will receive your request and must approve it before you can access their records.
                    All access is logged on the blockchain.
                  </p>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleSendRequest}
                disabled={!reason.trim() || isSearching}
              >
                {isSearching ? (
                  <>
                    <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Send Access Request
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* No Patient Found */}
        {searchQuery && !patientFound && !isSearching && (
          <div className="bg-card rounded-xl border border-border p-8 text-center animate-fade-in">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Patient Not Found</h3>
            <p className="text-muted-foreground">
              No patient found with the provided {searchType === 'id' ? 'ID' : 'wallet address'}.
              Please check and try again.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
