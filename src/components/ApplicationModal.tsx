
import React, { useState } from 'react';
import { Scholarship } from '@/types';
import { dataService } from '@/services/dataService';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

interface ApplicationModalProps {
  scholarship: Scholarship;
  onClose: () => void;
  onSuccess: () => void;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  scholarship,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [essay, setEssay] = useState('');
  const [documents, setDocuments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (essay.length < 100) {
      toast({
        title: "Essay too short",
        description: "Please write at least 100 characters for your essay.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert files to base64
      const uploadedDocs = await Promise.all(
        documents.map(async (file) => ({
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: file.type,
          base64Data: await convertFileToBase64(file),
          uploadedAt: new Date().toISOString(),
        }))
      );

      const studentProfile = user.profile as any;
      const studentName = `${studentProfile.firstName} ${studentProfile.lastName}`;

      dataService.createApplication({
        scholarshipId: scholarship.id,
        studentId: user.id,
        status: 'pending',
        essay,
        documents: uploadedDocs,
        studentName,
        scholarshipName: scholarship.name,
      });

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });

      onSuccess();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for {scholarship.name}</DialogTitle>
          <DialogDescription>
            Complete the application form below to apply for this scholarship.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="essay">Personal Essay *</Label>
            <Textarea
              id="essay"
              placeholder="Tell us about yourself, your goals, and why you deserve this scholarship..."
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              className="min-h-[200px] mt-2"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {essay.length}/100 characters minimum
            </p>
          </div>

          <div>
            <Label htmlFor="documents">Supporting Documents</Label>
            <div className="mt-2">
              <Input
                id="documents"
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label
                htmlFor="documents"
                className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
              >
                <div className="text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Click to upload documents
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
                  </p>
                </div>
              </Label>
            </div>
            {documents.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Selected files:</p>
                <ul className="text-sm text-gray-600">
                  {documents.map((file, index) => (
                    <li key={index}>• {file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;
