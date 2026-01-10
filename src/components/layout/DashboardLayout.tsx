import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Shield,
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  Upload,
  History,
  Search,
  CheckCircle,
  Building,
  Activity,
} from 'lucide-react';
import { UserRole } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
  role: UserRole;
}

interface NavItem {
  label: string;
  href: string;
  icon: ReactNode;
}

const patientNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/patient/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'My Reports', href: '/patient/reports', icon: <FileText className="h-5 w-5" /> },
  { label: 'Upload Report', href: '/patient/upload', icon: <Upload className="h-5 w-5" /> },
  { label: 'Access Control', href: '/patient/access', icon: <Users className="h-5 w-5" /> },
  { label: 'Activity Log', href: '/patient/activity', icon: <History className="h-5 w-5" /> },
  { label: 'Profile', href: '/patient/profile', icon: <User className="h-5 w-5" /> },
];

const doctorNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/doctor/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Request Access', href: '/doctor/request', icon: <Search className="h-5 w-5" /> },
  { label: 'Approved Reports', href: '/doctor/reports', icon: <CheckCircle className="h-5 w-5" /> },
  { label: 'Access History', href: '/doctor/history', icon: <History className="h-5 w-5" /> },
  { label: 'Profile', href: '/doctor/profile', icon: <User className="h-5 w-5" /> },
];

const hospitalNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/hospital/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: 'Verify Doctors', href: '/hospital/verify', icon: <CheckCircle className="h-5 w-5" /> },
  { label: 'Access Logs', href: '/hospital/logs', icon: <Activity className="h-5 w-5" /> },
  { label: 'Hospital Profile', href: '/hospital/profile', icon: <Building className="h-5 w-5" /> },
];

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = role === 'patient'
    ? patientNavItems
    : role === 'doctor'
      ? doctorNavItems
      : hospitalNavItems;

  const roleLabel = role === 'patient' ? 'Patient' : role === 'doctor' ? 'Doctor' : 'Hospital Admin';

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-card">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center gap-2 h-16 px-6 border-b border-border">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-lg">MedChain</span>
          </div>

          {/* Role Badge */}
          <div className="px-6 py-4">
            <div className="px-3 py-2 bg-accent rounded-lg">
              <p className="text-xs text-muted-foreground">Logged in as</p>
              <p className="font-medium text-accent-foreground">{roleLabel}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-foreground/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex w-64 flex-col bg-card animate-slide-in-right">
            <div className="flex items-center justify-between h-16 px-6 border-b border-border">
              <Link to="/" className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <span className="font-bold text-lg">MedChain</span>
              </Link>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="px-3 py-2 bg-accent rounded-lg">
                <p className="text-xs text-muted-foreground">Logged in as</p>
                <p className="font-medium text-accent-foreground">{roleLabel}</p>
              </div>
            </div>

            <nav className="flex-1 px-3 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-border">
              <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card/95 backdrop-blur-sm px-4 lg:px-8">
          <button
            className="lg:hidden p-2 -ml-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1" />

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full text-xs text-destructive-foreground flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="hidden md:inline">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to={`/${role}/profile`} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to={`/${role}/settings`} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
