
import { User, Scholarship } from '@/types';

export const initializeSampleData = () => {
  // Check if data already exists
  if (localStorage.getItem('dataInitialized')) {
    return;
  }

  // Sample users
  const users: User[] = [
    {
      id: '1',
      email: 'admin@demo.com',
      password: 'password',
      role: 'admin',
      isApproved: true,
      createdAt: new Date().toISOString(),
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        department: 'Administration',
      },
    },
    {
      id: '2',
      email: 'student@demo.com',
      password: 'password',
      role: 'student',
      isApproved: true,
      createdAt: new Date().toISOString(),
      profile: {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2000-01-15',
        gpa: 3.8,
        major: 'Computer Science',
        university: 'Demo University',
        phone: '+1 234 567 8900',
        address: '123 Student St, College Town, ST 12345',
        documents: [],
      },
    },
    {
      id: '3',
      email: 'school@demo.com',
      password: 'password',
      role: 'school',
      isApproved: true,
      createdAt: new Date().toISOString(),
      profile: {
        name: 'Demo University',
        description: 'A leading institution in higher education, committed to excellence in teaching, research, and community service.',
        website: 'https://demo-university.edu',
        address: '456 University Ave, College Town, ST 12345',
        phone: '+1 234 567 8901',
        email: 'contact@demo-university.edu',
      },
    },
  ];

  // Sample scholarships
  const scholarships: Scholarship[] = [
    {
      id: '1',
      name: 'Excellence in STEM Scholarship',
      description: 'This scholarship recognizes outstanding students pursuing degrees in Science, Technology, Engineering, and Mathematics. Recipients demonstrate academic excellence, leadership potential, and a commitment to using their skills to make a positive impact on society.',
      amount: 5000,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      eligibilityCriteria: 'Must be enrolled in a STEM program with a minimum GPA of 3.5. Demonstrated financial need and leadership experience preferred.',
      requirements: [
        'Completed application form',
        'Official transcripts',
        'Two letters of recommendation',
        'Personal essay (500-750 words)',
        'Proof of enrollment in STEM program',
      ],
      universityId: '3',
      universityName: 'Demo University',
      isActive: true,
      createdAt: new Date().toISOString(),
      applicationCount: 0,
    },
    {
      id: '2',
      name: 'First-Generation College Student Award',
      description: 'Supporting students who are the first in their family to pursue higher education. This scholarship aims to remove financial barriers and provide mentorship opportunities for academic success.',
      amount: 3000,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
      eligibilityCriteria: 'First-generation college student with demonstrated financial need. Minimum 3.0 GPA required.',
      requirements: [
        'Application form',
        'Financial aid documentation',
        'Essay about family educational background',
        'High school transcripts',
        'One letter of recommendation',
      ],
      universityId: '3',
      universityName: 'Demo University',
      isActive: true,
      createdAt: new Date().toISOString(),
      applicationCount: 0,
    },
    {
      id: '3',
      name: 'Community Service Leadership Scholarship',
      description: 'Recognizing students who have demonstrated exceptional commitment to community service and leadership. This scholarship supports students who plan to continue their service work while pursuing their education.',
      amount: 2500,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
      eligibilityCriteria: 'Minimum 100 hours of documented community service. Leadership roles in community organizations preferred.',
      requirements: [
        'Application form',
        'Community service documentation',
        'Leadership portfolio',
        'Two letters of recommendation from community leaders',
        'Personal statement on service impact',
      ],
      universityId: '3',
      universityName: 'Demo University',
      isActive: true,
      createdAt: new Date().toISOString(),
      applicationCount: 0,
    },
    {
      id: '4',
      name: 'International Student Excellence Award',
      description: 'Supporting outstanding international students who bring diverse perspectives and academic excellence to our campus community.',
      amount: 7500,
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
      eligibilityCriteria: 'International student status with F-1 visa. Minimum 3.7 GPA and English proficiency requirements.',
      requirements: [
        'Application form',
        'Academic transcripts',
        'English proficiency scores',
        'Cultural diversity essay',
        'Two academic references',
      ],
      universityId: '3',
      universityName: 'Demo University',
      isActive: true,
      createdAt: new Date().toISOString(),
      applicationCount: 0,
    },
    {
      id: '5',
      name: 'Arts and Creativity Scholarship',
      description: 'Celebrating students who demonstrate exceptional talent and innovation in the arts, including visual arts, music, theater, creative writing, and digital media.',
      amount: 4000,
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 days from now
      eligibilityCriteria: 'Enrolled in arts program or demonstrated artistic achievement. Portfolio submission required.',
      requirements: [
        'Application form',
        'Artistic portfolio (digital submission)',
        'Artist statement',
        'Academic transcripts',
        'One recommendation from arts faculty',
      ],
      universityId: '3',
      universityName: 'Demo University',
      isActive: true,
      createdAt: new Date().toISOString(),
      applicationCount: 0,
    },
    {
      id: '6',
      name: 'Business Innovation Scholarship',
      description: 'Supporting future entrepreneurs and business leaders who demonstrate innovative thinking and potential for making a positive impact in the business world.',
      amount: 6000,
      deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days from now
      eligibilityCriteria: 'Business major or demonstrated business acumen. Entrepreneurial experience or business plan preferred.',
      requirements: [
        'Application form',
        'Business plan or project proposal',
        'Academic transcripts',
        'Two professional references',
        'Innovation essay',
      ],
      universityId: '3',
      universityName: 'Demo University',
      isActive: true,
      createdAt: new Date().toISOString(),
      applicationCount: 0,
    },
  ];

  // Store in localStorage
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('scholarships', JSON.stringify(scholarships));
  localStorage.setItem('applications', JSON.stringify([]));
  localStorage.setItem('dataInitialized', 'true');
};
