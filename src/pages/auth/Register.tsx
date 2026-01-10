import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Shield,
  Mail,
  Lock,
  Wallet,
  ArrowRight,
  User,
  Stethoscope,
  Building,
  Phone,
  FileText,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { MetaMaskService } from '@/services/metamask';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Register() {
  const [role, setRole] = useState<UserRole>('patient');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    walletAddress: '',
    // Patient fields
    dateOfBirth: '',
    bloodType: '',
    // Doctor fields
    licenseNumber: '',
    specialization: '',
    hospital: '',
    // Hospital fields
    hospitalName: '',
    hospitalId: '',
  });

  const roles = [
    { id: 'patient' as UserRole, label: 'Patient', icon: User, description: 'Manage your medical records' },
    { id: 'doctor' as UserRole, label: 'Doctor', icon: Stethoscope, description: 'Access patient records' },
    { id: 'hospital' as UserRole, label: 'Hospital', icon: Building, description: 'Administer healthcare data' },
  ];

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must contain at least one uppercase letter');
      setIsLoading(false);
      return;
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter');
      setIsLoading(false);
      return;
    }

    // Check for special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
      setError('Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?)');
      setIsLoading(false);
      return;
    }

    try {
      // Prepare user data based on role
      const userData: any = {
        email: formData.email,
        password: formData.password,
        role,
        name: formData.name,
        walletAddress: formData.walletAddress || undefined,
      };

      // Add role-specific fields
      if (role === 'patient') {
        userData.dateOfBirth = formData.dateOfBirth || undefined;
        userData.bloodType = formData.bloodType || undefined;
      } else if (role === 'doctor') {
        userData.licenseNumber = formData.licenseNumber;
        userData.specialization = formData.specialization;
        userData.hospital = formData.hospital || undefined;
      } else if (role === 'hospital') {
        userData.name = formData.hospitalName;
        userData.hospitalId = formData.hospitalId;
      }

      const response = await register(userData);

      // Handle doctor verification requirement
      if (response.requiresVerification) {
        setSuccess('Registration successful! Your account is pending admin verification.');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        // Auto-login successful, navigate to dashboard
        navigate(`/${role}/dashboard`);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async () => {
    setError('');

    try {
      if (!MetaMaskService.isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask extension to connect your wallet.');
      }

      const walletAddress = await MetaMaskService.connectWallet();
      updateFormData('walletAddress', walletAddress);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-xl">MedChain</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">
            Join MedChain to secure your medical records
          </p>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="mb-6 bg-green-50 text-green-900 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {step > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
              </div>
              <span className="text-sm font-medium hidden sm:inline">Role</span>
            </div>
            <div className="flex-1 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                {step > 2 ? <CheckCircle className="h-5 w-5" /> : '2'}
              </div>
              <span className="text-sm font-medium hidden sm:inline">Details</span>
            </div>
            <div className="flex-1 h-0.5 bg-border" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                3
              </div>
              <span className="text-sm font-medium hidden sm:inline">Wallet</span>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Step 1: Role Selection */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <Label className="text-sm font-medium">Select your role</Label>
                <div className="space-y-3">
                  {roles.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left flex items-center gap-4 ${role === r.id
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border hover:border-primary/30 hover:bg-muted/50'
                        }`}
                    >
                      <div className={`p-3 rounded-lg ${role === r.id ? 'bg-primary/10' : 'bg-muted'}`}>
                        <r.icon className={`h-6 w-6 ${role === r.id ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className={`font-semibold ${role === r.id ? 'text-primary' : 'text-foreground'}`}>
                          {r.label}
                        </p>
                        <p className="text-sm text-muted-foreground">{r.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <Button type="button" className="w-full" size="lg" onClick={() => setStep(2)}>
                  Continue
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            )}

            {/* Step 2: Basic Details */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Role-specific fields */}
                {role === 'patient' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Input
                        id="bloodType"
                        placeholder="e.g., O+, A-, B+"
                        value={formData.bloodType}
                        onChange={(e) => updateFormData('bloodType', e.target.value)}
                      />
                    </div>
                  </>
                )}

                {role === 'doctor' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="license">Medical License Number</Label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="license"
                          placeholder="Enter your license number"
                          value={formData.licenseNumber}
                          onChange={(e) => updateFormData('licenseNumber', e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        placeholder="e.g., Cardiology, Pediatrics"
                        value={formData.specialization}
                        onChange={(e) => updateFormData('specialization', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hospital">Hospital / Clinic</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="hospital"
                          placeholder="Enter hospital name"
                          value={formData.hospital}
                          onChange={(e) => updateFormData('hospital', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </>
                )}

                {role === 'hospital' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="hospitalName">Hospital Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="hospitalName"
                          placeholder="Enter hospital name"
                          value={formData.hospitalName}
                          onChange={(e) => updateFormData('hospitalName', e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hospitalId">Hospital Registration ID</Label>
                      <Input
                        id="hospitalId"
                        placeholder="Enter registration ID"
                        value={formData.hospitalId}
                        onChange={(e) => updateFormData('hospitalId', e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters with uppercase, lowercase, and special characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      className={`pl-10 ${formData.confirmPassword && formData.password === formData.confirmPassword
                          ? 'border-green-500 focus-visible:ring-green-500'
                          : formData.confirmPassword && formData.password !== formData.confirmPassword
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : ''
                        }`}
                      required
                    />
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="text-xs text-green-500">Passwords match ✓</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="button" className="flex-1" onClick={() => setStep(3)}>
                    Continue
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Wallet Connection */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center">
                  <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                    <Wallet className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
                  <p className="text-muted-foreground text-sm">
                    Connect your MetaMask wallet for secure blockchain authentication
                  </p>
                </div>

                {formData.walletAddress ? (
                  <div className="p-4 bg-success/10 border border-success/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
                      <div>
                        <p className="font-medium text-success">Wallet Connected</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {formData.walletAddress.slice(0, 10)}...{formData.walletAddress.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="wallet"
                    className="w-full"
                    size="lg"
                    onClick={handleWalletConnect}
                  >
                    <Wallet className="h-5 w-5" />
                    Connect MetaMask
                  </Button>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-background px-4 text-muted-foreground">Or enter manually</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallet">Wallet Address</Label>
                  <Input
                    id="wallet"
                    placeholder="0x..."
                    value={formData.walletAddress}
                    onChange={(e) => updateFormData('walletAddress', e.target.value)}
                    className="font-mono"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div className="hidden lg:flex lg:flex-1 hero-gradient items-center justify-center p-12">
        <div className="text-center text-primary-foreground max-w-md">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-primary-foreground/10 rounded-full blur-3xl" />
            <Shield className="h-32 w-32 mx-auto relative z-10 animate-float" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Join MedChain</h2>
          <p className="text-primary-foreground/80">
            Create your account to start managing your medical records securely on the blockchain. Your data, your control.
          </p>
        </div>
      </div>
    </div>
  );
}
