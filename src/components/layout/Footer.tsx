import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">MedChain</span>
            </Link>
            <p className="text-sm text-background/70">
              Securing medical records with blockchain technology. Your health data, your control.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/60 hover:text-background transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/#features" className="text-sm text-background/70 hover:text-background transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/#security" className="text-sm text-background/70 hover:text-background transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link to="/#pricing" className="text-sm text-background/70 hover:text-background transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-background/70 hover:text-background transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/#about" className="text-sm text-background/70 hover:text-background transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                  HIPAA Compliance
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} MedChain. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-background/60">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-secondary/20 rounded text-xs font-medium text-secondary">
              <Shield className="h-3 w-3" />
              HIPAA Compliant
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-primary/20 rounded text-xs font-medium text-primary">
              Blockchain Secured
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
