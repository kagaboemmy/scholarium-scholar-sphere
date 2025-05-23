
import { Scholarship, Application, User } from '@/types';

export const dataService = {
  // Scholarships
  getScholarships: (): Scholarship[] => {
    return JSON.parse(localStorage.getItem('scholarships') || '[]');
  },

  getScholarshipById: (id: string): Scholarship | null => {
    const scholarships = dataService.getScholarships();
    return scholarships.find(s => s.id === id) || null;
  },

  createScholarship: (scholarship: Omit<Scholarship, 'id' | 'createdAt' | 'applicationCount'>): Scholarship => {
    const scholarships = dataService.getScholarships();
    const newScholarship: Scholarship = {
      ...scholarship,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      applicationCount: 0,
    };
    scholarships.push(newScholarship);
    localStorage.setItem('scholarships', JSON.stringify(scholarships));
    return newScholarship;
  },

  updateScholarship: (id: string, updates: Partial<Scholarship>): void => {
    const scholarships = dataService.getScholarships();
    const index = scholarships.findIndex(s => s.id === id);
    if (index !== -1) {
      scholarships[index] = { ...scholarships[index], ...updates };
      localStorage.setItem('scholarships', JSON.stringify(scholarships));
    }
  },

  deleteScholarship: (id: string): void => {
    const scholarships = dataService.getScholarships();
    const filtered = scholarships.filter(s => s.id !== id);
    localStorage.setItem('scholarships', JSON.stringify(filtered));
  },

  // Applications
  getApplications: (): Application[] => {
    return JSON.parse(localStorage.getItem('applications') || '[]');
  },

  getApplicationsByStudent: (studentId: string): Application[] => {
    return dataService.getApplications().filter(app => app.studentId === studentId);
  },

  getApplicationsByScholarship: (scholarshipId: string): Application[] => {
    return dataService.getApplications().filter(app => app.scholarshipId === scholarshipId);
  },

  createApplication: (application: Omit<Application, 'id' | 'submittedAt'>): Application => {
    const applications = dataService.getApplications();
    const newApplication: Application = {
      ...application,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
    };
    applications.push(newApplication);
    localStorage.setItem('applications', JSON.stringify(applications));
    
    // Update scholarship application count
    const scholarships = dataService.getScholarships();
    const scholarshipIndex = scholarships.findIndex(s => s.id === application.scholarshipId);
    if (scholarshipIndex !== -1) {
      scholarships[scholarshipIndex].applicationCount += 1;
      localStorage.setItem('scholarships', JSON.stringify(scholarships));
    }
    
    return newApplication;
  },

  updateApplicationStatus: (id: string, status: Application['status']): void => {
    const applications = dataService.getApplications();
    const index = applications.findIndex(app => app.id === id);
    if (index !== -1) {
      applications[index].status = status;
      localStorage.setItem('applications', JSON.stringify(applications));
    }
  },

  // Users
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem('users') || '[]');
  },

  approveUser: (userId: string): void => {
    const users = dataService.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index].isApproved = true;
      localStorage.setItem('users', JSON.stringify(users));
    }
  },

  blockUser: (userId: string): void => {
    const users = dataService.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index !== -1) {
      users[index].isApproved = false;
      localStorage.setItem('users', JSON.stringify(users));
    }
  },
};
