
import React, { useState, useEffect } from 'react';
import { dataService } from '@/services/dataService';
import { User, Scholarship } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  
  useEffect(() => {
    // Load users and scholarships
    const allUsers = dataService.getUsers();
    const allScholarships = dataService.getScholarships();
    setUsers(allUsers);
    setScholarships(allScholarships);
  }, []);
  
  const approveUser = (userId: string) => {
    dataService.approveUser(userId);
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isApproved: true } : user
    ));
    toast({
      title: "User Approved",
      description: "User has been approved successfully",
    });
  };
  
  const blockUser = (userId: string) => {
    dataService.blockUser(userId);
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isApproved: false } : user
    ));
    toast({
      title: "User Blocked",
      description: "User has been blocked successfully",
      variant: "destructive",
    });
  };
  
  const deleteScholarship = (scholarshipId: string) => {
    dataService.deleteScholarship(scholarshipId);
    setScholarships(scholarships.filter(s => s.id !== scholarshipId));
    toast({
      title: "Scholarship Deleted",
      description: "Scholarship has been deleted successfully",
      variant: "destructive",
    });
  };
  
  const toggleScholarshipStatus = (scholarshipId: string, isActive: boolean) => {
    dataService.updateScholarship(scholarshipId, { isActive: !isActive });
    setScholarships(scholarships.map(s => 
      s.id === scholarshipId ? { ...s, isActive: !isActive } : s
    ));
    toast({
      title: isActive ? "Scholarship Deactivated" : "Scholarship Activated",
      description: `Scholarship has been ${isActive ? 'deactivated' : 'activated'} successfully`,
    });
  };

  // Filter users by role
  const students = users.filter(user => user.role === 'student');
  const schools = users.filter(user => user.role === 'school');
  const admins = users.filter(user => user.role === 'admin');

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Approve or block users</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="students">
                <TabsList className="mb-4">
                  <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
                  <TabsTrigger value="schools">Schools ({schools.length})</TabsTrigger>
                  <TabsTrigger value="admins">Admins ({admins.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="students">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>University</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.length > 0 ? (
                          students.map(student => (
                            <TableRow key={student.id}>
                              <TableCell>
                                {(student.profile as any).firstName} {(student.profile as any).lastName}
                              </TableCell>
                              <TableCell>{student.email}</TableCell>
                              <TableCell>{(student.profile as any).university || 'N/A'}</TableCell>
                              <TableCell>
                                <Badge variant={student.isApproved ? "default" : "destructive"}>
                                  {student.isApproved ? 'Approved' : 'Blocked'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {student.isApproved ? (
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => blockUser(student.id)}
                                  >
                                    Block
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => approveUser(student.id)}
                                  >
                                    Approve
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                              No students found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="schools">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Website</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schools.length > 0 ? (
                          schools.map(school => (
                            <TableRow key={school.id}>
                              <TableCell>{(school.profile as any).name}</TableCell>
                              <TableCell>{school.email}</TableCell>
                              <TableCell>
                                {(school.profile as any).website ? (
                                  <a href={(school.profile as any).website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {(school.profile as any).website}
                                  </a>
                                ) : (
                                  'N/A'
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge variant={school.isApproved ? "default" : "destructive"}>
                                  {school.isApproved ? 'Approved' : 'Blocked'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {school.isApproved ? (
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => blockUser(school.id)}
                                  >
                                    Block
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => approveUser(school.id)}
                                  >
                                    Approve
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                              No schools found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
                
                <TabsContent value="admins">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {admins.length > 0 ? (
                          admins.map(admin => (
                            <TableRow key={admin.id}>
                              <TableCell>
                                {(admin.profile as any).firstName} {(admin.profile as any).lastName}
                              </TableCell>
                              <TableCell>{admin.email}</TableCell>
                              <TableCell>{(admin.profile as any).department}</TableCell>
                              <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-4">
                              No admin users found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scholarships">
          <Card>
            <CardHeader>
              <CardTitle>Scholarship Management</CardTitle>
              <CardDescription>Review and manage all scholarships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scholarships.length > 0 ? (
                      scholarships.map(scholarship => (
                        <TableRow key={scholarship.id}>
                          <TableCell className="font-medium">{scholarship.name}</TableCell>
                          <TableCell>{scholarship.universityName}</TableCell>
                          <TableCell>
                            ${scholarship.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {new Date(scholarship.deadline).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={scholarship.isActive ? "default" : "destructive"}>
                              {scholarship.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button 
                                variant={scholarship.isActive ? "destructive" : "outline"} 
                                size="sm"
                                onClick={() => toggleScholarshipStatus(scholarship.id, scholarship.isActive)}
                              >
                                {scholarship.isActive ? 'Deactivate' : 'Activate'}
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => deleteScholarship(scholarship.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No scholarships found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="statistics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Students:</span>
                    <span className="font-bold">{students.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Schools:</span>
                    <span className="font-bold">{schools.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Admins:</span>
                    <span className="font-bold">{admins.length}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span>Total:</span>
                    <span className="font-bold">{users.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Scholarships</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Active:</span>
                    <span className="font-bold">{scholarships.filter(s => s.isActive).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Inactive:</span>
                    <span className="font-bold">{scholarships.filter(s => !s.isActive).length}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span>Total:</span>
                    <span className="font-bold">{scholarships.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Avg. Scholarship Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center">
                  ${scholarships.length > 0 
                    ? Math.round(scholarships.reduce((acc, s) => acc + s.amount, 0) / scholarships.length).toLocaleString() 
                    : 0}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
