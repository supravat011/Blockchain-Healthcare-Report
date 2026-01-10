import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Shield,
  Lock,
  Users,
  FileCheck,
  ArrowRight,
  CheckCircle,
  Zap,
  Globe,
  Key,
  Database,
  Smartphone,
} from 'lucide-react';

export default function Landing() {
  const features = [
    {
      icon: Shield,
      title: 'Tamper-Proof Records',
      description: 'Medical records are encrypted and stored on the blockchain, making them immutable and secure from unauthorized modifications.',
    },
    {
      icon: Lock,
      title: 'Patient-Controlled Access',
      description: 'You decide who can view your medical records. Grant or revoke access to doctors and hospitals at any time.',
    },
    {
      icon: Users,
      title: 'Secure Doctor Sharing',
      description: 'Doctors can request access to your records, and you can set time-based permissions for added security.',
    },
    {
      icon: FileCheck,
      title: 'Verified Documents',
      description: 'Every document is verified on the blockchain with a unique hash, ensuring authenticity and integrity.',
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'No more waiting for records to be transferred. Authorized healthcare providers get instant access.',
    },
    {
      icon: Globe,
      title: 'Access Anywhere',
      description: 'Your medical records are accessible from anywhere in the world, securely stored in the cloud.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Your Account',
      description: 'Sign up as a patient, doctor, or hospital administrator with your wallet.',
    },
    {
      number: '02',
      title: 'Upload Medical Records',
      description: 'Securely upload your medical documents which are encrypted and stored on IPFS.',
    },
    {
      number: '03',
      title: 'Control Access',
      description: 'Grant or revoke access to healthcare providers with blockchain-verified permissions.',
    },
    {
      number: '04',
      title: 'Stay in Control',
      description: 'Monitor all access to your records with a complete audit trail on the blockchain.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col hero-gradient overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <Header />

        <div className="container mx-auto px-4 pt-20 pb-32 relative z-10 flex-1 flex flex-col justify-center">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 rounded-full text-primary-foreground/90 text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in">
              <Shield className="h-4 w-4" />
              Blockchain-Powered Security
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in-up">
              Secure. Private.{' '}
              <span className="relative">
                Patient-Controlled
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 2 150 2 298 10" stroke="hsl(160, 84%, 39%)" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>{' '}
              Medical Records
            </h1>

            <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-fade-in-up stagger-1">
              Take control of your health data with blockchain technology. Store, share, and manage your medical records with complete privacy and security.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-2">
              <Button variant="hero" size="xl" asChild>
                <Link to="/register">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/login">
                  Login to Dashboard
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-6 mt-16 animate-fade-in-up stagger-3">
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <CheckCircle className="h-5 w-5 text-secondary" />
                <span className="text-sm">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <CheckCircle className="h-5 w-5 text-secondary" />
                <span className="text-sm">End-to-End Encryption</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <CheckCircle className="h-5 w-5 text-secondary" />
                <span className="text-sm">Decentralized Storage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 w-full leading-none translate-y-[1px]">
          <svg className="w-full h-auto block" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="gradient-text">MedChain</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our blockchain-based platform ensures your medical records are secure, private, and always under your control.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="security" className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes and take control of your medical records.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="text-6xl font-bold text-primary/10 mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 translate-x-1/2">
                    <ArrowRight className="h-6 w-6 text-border" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Enterprise-Grade <span className="gradient-text">Security</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Your medical data deserves the highest level of protection. Our platform uses cutting-edge blockchain technology combined with industry-standard encryption.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">End-to-End Encryption</h4>
                    <p className="text-muted-foreground text-sm">AES-256 encryption ensures your data is unreadable without proper authorization.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Database className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Decentralized Storage</h4>
                    <p className="text-muted-foreground text-sm">IPFS storage means no single point of failure and improved data availability.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-success/10">
                    <Smartphone className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Wallet Authentication</h4>
                    <p className="text-muted-foreground text-sm">MetaMask integration provides secure, decentralized identity verification.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl p-8 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse-soft" />
                  <Shield className="h-48 w-48 text-primary relative z-10 animate-float" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="about" className="py-24 hero-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Take Control of Your Medical Records?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join thousands of patients and healthcare providers who trust MedChain for secure medical record management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Create Free Account
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/#features">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
