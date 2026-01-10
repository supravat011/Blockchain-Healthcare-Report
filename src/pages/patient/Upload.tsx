import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  Image,
  X,
  CheckCircle,
  Shield,
  Lock,
  ArrowLeft,
} from 'lucide-react';
import { mockPatient } from '@/data/mockData';

export default function PatientUpload() {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    file: null as File | null,
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFormData(prev => ({ ...prev, file: e.dataTransfer.files[0] }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    // Simulate upload process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsUploading(false);
    setUploadComplete(true);
    
    // Redirect after showing success
    setTimeout(() => {
      navigate('/patient/reports');
    }, 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (uploadComplete) {
    return (
      <DashboardLayout role="patient" userName={mockPatient.name}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Upload Successful!</h2>
            <p className="text-muted-foreground mb-4">
              Your medical report has been securely stored on the blockchain.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-primary" />
                Encrypted
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-success" />
                Verified
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="patient" userName={mockPatient.name}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Upload Medical Report</h1>
            <p className="text-muted-foreground">Securely store your medical documents on the blockchain</p>
          </div>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive
                ? 'border-primary bg-primary/5'
                : formData.file
                ? 'border-success bg-success/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {formData.file ? (
              <div className="flex items-center justify-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  {formData.file.type.includes('image') ? (
                    <Image className="h-8 w-8 text-success" />
                  ) : (
                    <FileText className="h-8 w-8 text-success" />
                  )}
                </div>
                <div className="text-left">
                  <p className="font-medium">{formData.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(formData.file.size)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setFormData(prev => ({ ...prev, file: null }))}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <p className="text-lg font-medium mb-2">
                  Drag and drop your file here
                </p>
                <p className="text-muted-foreground mb-4">
                  or click to browse from your computer
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                  <Button type="button" variant="outline" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-4">
                  Supported formats: PDF, JPG, PNG (Max 10MB)
                </p>
              </>
            )}
          </div>

          {/* Report Details */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold">Report Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Report Title</Label>
              <Input
                id="title"
                placeholder="e.g., Annual Health Checkup 2024"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Report Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the medical report..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-primary/5 rounded-xl p-4 flex items-start gap-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-primary">Blockchain Security</h4>
              <p className="text-sm text-muted-foreground">
                Your document will be encrypted and stored on IPFS. A unique hash will be recorded on the blockchain for verification.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            size="lg" 
            className="w-full" 
            disabled={!formData.file || !formData.title || !formData.date || isUploading}
          >
            {isUploading ? (
              <>
                <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Uploading & Encrypting...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                Upload Report
              </>
            )}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
