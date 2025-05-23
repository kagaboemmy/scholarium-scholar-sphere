
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/services/dataService';
import { Application, StudentProfile, UploadedDocument } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const StudentDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [applications, setApplications] = useState<Application[]>([]);
  const [profileData, setProfileData] = useState<StudentProfile>(
    (user?.profile as StudentProfile) || {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gpa: 0,
      major: '',
      university: '',
      phone: '',
      address: '',
      documents: []
    }
  );
  const [newDocument, setNewDocument] = useState<{name: string, file: File | null}>({
    name: '',
    file: null
  });

  React.useEffect(() => {
    if (user) {
      const userApplications = dataService.getApplicationsByStudent(user.id);
      setApplications(userApplications);
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: name === 'gpa' ? parseFloat(value) || 0 : value
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileData);
  };

  const handleDocumentNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDocument(prev => ({ ...prev, name: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewDocument(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleDocumentUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocument.name || !newDocument.file) {
      toast({
        title: "Error",
        description: "Please provide both name and file",
        variant: "destructive",
      });
      return;
    }

    try {
      const file = newDocument.file;
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const base64Data = event.target.result.toString();
          const newDoc: UploadedDocument = {
            id: Date.now().toString(),
            name: newDocument.name,
            type: file.type,
            base64Data: base64Data,
            uploadedAt: new Date().toISOString()
          };

          const updatedDocs = [...profileData.documents, newDoc];
          const updatedProfile = { ...profileData, documents: updatedDocs };
          
          setProfileData(updatedProfile);
          updateProfile(updatedProfile);
          
          setNewDocument({ name: '', file: null });
          
          toast({
            title: "Success",
            description: "Document uploaded successfully",
          });
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    }
  };

  const handleDeleteDocument = (docId: string) => {
    const updatedDocs = profileData.documents.filter(doc => doc.id !== docId);
    const updatedProfile = { ...profileData, documents: updatedDocs };
    
    setProfileData(updatedProfile);
    updateProfile(updatedProfile);
    
    toast({
      title: "Success",
      description: "Document deleted successfully",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={profileData.dateOfBirth}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gpa">GPA</Label>
                    <Input
                      id="gpa"
                      name="gpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={profileData.gpa}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="major">Major</Label>
                    <Input
                      id="major"
                      name="major"
                      value={profileData.major}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="university">University</Label>
                    <Input
                      id="university"
                      name="university"
                      value={profileData.university}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                  />
                </div>
                
                <Button type="submit">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>My Applications</CardTitle>
              <CardDescription>View the status of your scholarship applications</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <div className="space-y-4">
                  {applications.map(application => (
                    <div key={application.id} className="border p-4 rounded-md">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{application.scholarshipName}</h3>
                          <p className="text-sm text-gray-500">Submitted: {new Date(application.submittedAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm">Essay excerpt:</p>
                        <p className="text-sm text-gray-600 italic">{application.essay.substring(0, 100)}...</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">You haven't applied to any scholarships yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>My Documents</CardTitle>
              <CardDescription>Upload and manage your documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <h3 className="font-semibold mb-4">Upload New Document</h3>
                  <form onSubmit={handleDocumentUpload} className="space-y-4">
                    <div>
                      <Label htmlFor="docName">Document Name</Label>
                      <Input
                        id="docName"
                        value={newDocument.name}
                        onChange={handleDocumentNameChange}
                        placeholder="e.g., Transcript, ID, Resume"
                      />
                    </div>
                    <div>
                      <Label htmlFor="docFile">File</Label>
                      <Input
                        id="docFile"
                        type="file"
                        onChange={handleFileChange}
                      />
                    </div>
                    <Button type="submit">Upload Document</Button>
                  </form>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Uploaded Documents</h3>
                  {profileData.documents && profileData.documents.length > 0 ? (
                    <div className="space-y-2">
                      {profileData.documents.map(doc => (
                        <div key={doc.id} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(doc.base64Data)}
                            >
                              View
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No documents uploaded yet.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
