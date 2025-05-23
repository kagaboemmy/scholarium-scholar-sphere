
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { dataService } from '@/services/dataService';
import { Scholarship, Application, SchoolProfile } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit } from 'lucide-react';

const SchoolDashboard = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('scholarships');
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [profileData, setProfileData] = useState<SchoolProfile>(
    (user?.profile as SchoolProfile) || {
      name: '',
      description: '',
      website: '',
      address: '',
      phone: '',
      email: '',
    }
  );

  // New scholarship form state
  const [newScholarship, setNewScholarship] = useState({
    name: '',
    description: '',
    amount: 0,
    deadline: '',
    eligibilityCriteria: '',
    requirements: [''] as string[],
  });

  // Get school's scholarships and applications
  useEffect(() => {
    if (user) {
      const allScholarships = dataService.getScholarships();
      const schoolScholarships = allScholarships.filter(s => s.universityId === user.id);
      setScholarships(schoolScholarships);

      const allApplications = dataService.getApplications();
      const scholarshipIds = schoolScholarships.map(s => s.id);
      const schoolApplications = allApplications.filter(a => scholarshipIds.includes(a.scholarshipId));
      setApplications(schoolApplications);
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileData);
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  const handleScholarshipChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewScholarship(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const addRequirementField = () => {
    setNewScholarship(prev => ({
      ...prev,
      requirements: [...prev.requirements, '']
    }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...newScholarship.requirements];
    updatedRequirements[index] = value;
    setNewScholarship(prev => ({
      ...prev,
      requirements: updatedRequirements
    }));
  };

  const removeRequirement = (index: number) => {
    const updatedRequirements = newScholarship.requirements.filter((_, i) => i !== index);
    setNewScholarship(prev => ({
      ...prev,
      requirements: updatedRequirements
    }));
  };

  const handleCreateScholarship = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Filter out empty requirements
    const filteredRequirements = newScholarship.requirements.filter(req => req.trim() !== '');
    
    const scholarship = dataService.createScholarship({
      name: newScholarship.name,
      description: newScholarship.description,
      amount: newScholarship.amount,
      deadline: newScholarship.deadline,
      eligibilityCriteria: newScholarship.eligibilityCriteria,
      requirements: filteredRequirements,
      universityId: user.id,
      universityName: (user.profile as SchoolProfile).name || "University",
      isActive: true,
    });
    
    setScholarships(prev => [...prev, scholarship]);
    
    // Reset form
    setNewScholarship({
      name: '',
      description: '',
      amount: 0,
      deadline: '',
      eligibilityCriteria: '',
      requirements: [''],
    });
    
    toast({
      title: "Success",
      description: "Scholarship created successfully",
    });
  };

  const updateApplicationStatus = (applicationId: string, status: 'pending' | 'accepted' | 'rejected') => {
    dataService.updateApplicationStatus(applicationId, status);
    setApplications(prev => 
      prev.map(app => app.id === applicationId ? { ...app, status } : app)
    );
    
    toast({
      title: "Status Updated",
      description: `Application status set to ${status}`,
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">School Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="profile">School Profile</TabsTrigger>
        </TabsList>
        
        <TabsContent value="scholarships">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Your Scholarships</h2>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Scholarship
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Scholarship</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new scholarship opportunity.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleCreateScholarship} className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="name">Scholarship Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newScholarship.name}
                      onChange={handleScholarshipChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newScholarship.description}
                      onChange={handleScholarshipChange}
                      required
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount ($)</Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        min="0"
                        value={newScholarship.amount}
                        onChange={handleScholarshipChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        name="deadline"
                        type="date"
                        value={newScholarship.deadline}
                        onChange={handleScholarshipChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="eligibilityCriteria">Eligibility Criteria</Label>
                    <Textarea
                      id="eligibilityCriteria"
                      name="eligibilityCriteria"
                      value={newScholarship.eligibilityCriteria}
                      onChange={handleScholarshipChange}
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Requirements</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={addRequirementField}
                      >
                        Add Requirement
                      </Button>
                    </div>
                    
                    {newScholarship.requirements.map((requirement, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <Input
                          value={requirement}
                          onChange={(e) => handleRequirementChange(index, e.target.value)}
                          placeholder={`Requirement ${index + 1}`}
                        />
                        {newScholarship.requirements.length > 1 && (
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeRequirement(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Create Scholarship</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.length > 0 ? (
              scholarships.map((scholarship) => (
                <Card key={scholarship.id} className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{scholarship.name}</CardTitle>
                      <Badge variant={scholarship.isActive ? "default" : "destructive"}>
                        ${scholarship.amount.toLocaleString()}
                      </Badge>
                    </div>
                    <CardDescription>
                      Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-gray-700 line-clamp-3 mb-4">
                      {scholarship.description}
                    </p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Applications: </span> 
                        {scholarship.applicationCount}
                      </div>
                      <div>
                        <span className="font-semibold">Status: </span> 
                        {scholarship.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-10">
                <p className="text-gray-500">You haven't created any scholarships yet.</p>
                <p className="text-sm text-gray-400 mt-1">Click the 'New Scholarship' button to get started.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Scholarship Applications</CardTitle>
              <CardDescription>Review and manage student applications</CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <div className="space-y-6">
                  {applications.map(application => (
                    <div key={application.id} className="border rounded-lg p-5">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <h3 className="font-bold">{application.studentName}</h3>
                          <p className="text-sm text-gray-500">Applied to: {application.scholarshipName}</p>
                          <p className="text-sm text-gray-500">Submitted: {new Date(application.submittedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="mt-2 md:mt-0 flex flex-col md:items-end">
                          <span className={`px-2 py-1 rounded text-xs inline-block ${
                            application.status === 'accepted' ? 'bg-green-100 text-green-800' :
                            application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                          <div className="mt-2 space-x-2">
                            <Button 
                              size="sm" 
                              variant={application.status === 'accepted' ? 'default' : 'outline'} 
                              onClick={() => updateApplicationStatus(application.id, 'accepted')}
                              disabled={application.status === 'accepted'}
                            >
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant={application.status === 'rejected' ? 'destructive' : 'outline'} 
                              onClick={() => updateApplicationStatus(application.id, 'rejected')}
                              disabled={application.status === 'rejected'}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="border-t pt-4 mt-4">
                        <h4 className="font-medium mb-2">Essay</h4>
                        <p className="text-sm text-gray-700">{application.essay}</p>
                      </div>
                      {application.documents.length > 0 && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-medium mb-2">Documents</h4>
                          <div className="space-y-2">
                            {application.documents.map(doc => (
                              <div key={doc.id} className="flex justify-between items-center p-2 border rounded bg-gray-50">
                                <span>{doc.name}</span>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => window.open(doc.base64Data)}
                                >
                                  View
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-10">No applications received yet.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>School Profile</CardTitle>
              <CardDescription>Update your school information</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">School Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={profileData.description}
                    onChange={handleProfileChange}
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      value={profileData.website}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Contact Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
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
      </Tabs>
    </div>
  );
};

export default SchoolDashboard;
