
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Scholarship, Application, StudentProfile } from '@/types';
import { dataService } from '@/services/dataService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScholarshipCard from '@/components/ScholarshipCard';
import { GraduationCap, FileText, User, DollarSign } from 'lucide-react';

const StudentDashboard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<StudentProfile>(
    user?.profile as StudentProfile || {}
  );

  useEffect(() => {
    if (user) {
      const userApplications = dataService.getApplicationsByStudent(user.id);
      setApplications(userApplications);

      const allScholarships = dataService.getScholarships();
      const availableScholarships = allScholarships
        .filter(s => s.isActive && new Date(s.deadline) > new Date())
        .filter(s => !userApplications.some(app => app.scholarshipId === s.id))
        .slice(0, 6);
      setScholarships(availableScholarships);
    }
  }, [user]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileForm);
    setIsEditingProfile(false);
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const acceptedApplications = applications.filter(app => app.status === 'accepted');
  const totalScholarshipValue = acceptedApplications.reduce((sum, app) => {
    const scholarship = dataService.getScholarshipById(app.scholarshipId);
    return sum + (scholarship?.amount || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {(user?.profile as StudentProfile)?.firstName}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{applications.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <GraduationCap className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {acceptedApplications.length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <FileText className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter(app => app.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${totalScholarshipValue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="scholarships">Available Scholarships</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
              </CardHeader>
              <CardContent>
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{application.scholarshipName}</h3>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Submitted: {new Date(application.submittedAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm line-clamp-2">{application.essay}</p>
                        {application.documents.length > 0 && (
                          <p className="text-sm text-gray-500 mt-2">
                            {application.documents.length} document(s) attached
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No applications submitted yet. Start applying to scholarships!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scholarships">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Available Scholarships</h2>
                <Button asChild>
                  <a href="/scholarships">View All</a>
                </Button>
              </div>
              
              {scholarships.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {scholarships.map((scholarship) => (
                    <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">
                      No new scholarships available. You've applied to all current opportunities!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Profile Information</CardTitle>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isEditingProfile ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileForm.firstName || ''}
                          onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileForm.lastName || ''}
                          onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="gpa">GPA</Label>
                        <Input
                          id="gpa"
                          type="number"
                          step="0.01"
                          value={profileForm.gpa || ''}
                          onChange={(e) => setProfileForm({...profileForm, gpa: parseFloat(e.target.value) || 0})}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="major">Major</Label>
                        <Input
                          id="major"
                          value={profileForm.major || ''}
                          onChange={(e) => setProfileForm({...profileForm, major: e.target.value})}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="university">University</Label>
                      <Input
                        id="university"
                        value={profileForm.university || ''}
                        onChange={(e) => setProfileForm({...profileForm, university: e.target.value})}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileForm.phone || ''}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={profileForm.address || ''}
                        onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                        className="mt-1"
                      />
                    </div>

                    <Button type="submit">Save Changes</Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>First Name</Label>
                        <p className="mt-1">{profileForm.firstName || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label>Last Name</Label>
                        <p className="mt-1">{profileForm.lastName || 'Not provided'}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>GPA</Label>
                        <p className="mt-1">{profileForm.gpa || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label>Major</Label>
                        <p className="mt-1">{profileForm.major || 'Not provided'}</p>
                      </div>
                    </div>

                    <div>
                      <Label>University</Label>
                      <p className="mt-1">{profileForm.university || 'Not provided'}</p>
                    </div>

                    <div>
                      <Label>Phone</Label>
                      <p className="mt-1">{profileForm.phone || 'Not provided'}</p>
                    </div>

                    <div>
                      <Label>Address</Label>
                      <p className="mt-1">{profileForm.address || 'Not provided'}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;
