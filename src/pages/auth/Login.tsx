import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail, Lock, Wallet, ArrowRight, User, Stethoscope, Building, AlertCircle } from 'lucide-react';
import { UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { MetaMaskService } from '@/services/metamask';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login() {
  const [role, setRole] = useState<UserRole>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, loginWithWallet } = useAuth();

  const roles = [
    { id: 'patient' as UserRole, label: 'Patient', icon: User, description: 'Manage your medical records' },
    { id: 'doctor' as UserRole, label: 'Doctor', icon: Stethoscope, description: 'Access patient records' },
    { id: 'hospital' as UserRole, label: 'Hospital', icon: Building, description: 'Administer healthcare data' },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password, role);
      navigate(`/${role}/dashboard`);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (!MetaMaskService.isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask extension.');
      }

      const walletAddress = await MetaMaskService.connectWallet();

      // Login with wallet
      await loginWithWallet(walletAddress, role);
      navigate(`/${role}/dashboard`);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-xl">MedChain</span>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to access your secure medical records
          </p>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Role Selection */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Select your role</Label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${role === r.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border hover:border-primary/30 hover:bg-muted/50'
                    }`}
                >
                  <r.icon className={`h-6 w-6 mx-auto mb-2 ${role === r.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className={`text-sm font-medium ${role === r.id ? 'text-primary' : 'text-foreground'}`}>
                    {r.label}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded border-border" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-4 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Wallet Connect */}
          <Button
            type="button"
            variant="wallet"
            className="w-full"
            size="lg"
            onClick={handleWalletConnect}
            disabled={isLoading}
          >
            <Wallet className="h-5 w-5" />
            Connect with MetaMask
          </Button>

          {/* Register Link */}
          <p className="text-center mt-6 text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create account
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
          <h2 className="text-3xl font-bold mb-4">Secure Access</h2>
          <p className="text-primary-foreground/80">
            Your medical records are protected with blockchain technology and end-to-end encryption. Only you control who can access your data.
          </p>
        </div>
      </div>
    </div>
  );
}
