
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scholarship } from '@/types';
import { dataService } from '@/services/dataService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ScholarshipCard from '@/components/ScholarshipCard';
import { Search, GraduationCap, DollarSign, Users } from 'lucide-react';

const Home: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [stats, setStats] = useState({
    totalScholarships: 0,
    totalAmount: 0,
    totalApplications: 0,
  });

  useEffect(() => {
    const allScholarships = dataService.getScholarships();
    const activeScholarships = allScholarships
      .filter(s => s.isActive && new Date(s.deadline) > new Date())
      .slice(0, 6); // Show only first 6 scholarships
    
    setScholarships(activeScholarships);
    
    const totalAmount = allScholarships.reduce((sum, s) => sum + s.amount, 0);
    const totalApplications = dataService.getApplications().length;
    
    setStats({
      totalScholarships: allScholarships.length,
      totalAmount,
      totalApplications,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Scholarship
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Connect with opportunities that match your goals and unlock your educational potential
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/scholarships">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Scholarships
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold text-blue-600">
                  {stats.totalScholarships}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Active Scholarships</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold text-green-600">
                  ${(stats.totalAmount / 1000).toFixed(0)}K+
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Total Value</p>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle className="text-3xl font-bold text-purple-600">
                  {stats.totalApplications}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Applications Submitted</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Scholarships */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Scholarships
            </h2>
            <p className="text-lg text-gray-600">
              Discover the latest opportunities from top universities
            </p>
          </div>
          
          {scholarships.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {scholarships.map((scholarship) => (
                  <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                ))}
              </div>
              
              <div className="text-center">
                <Link to="/scholarships">
                  <Button size="lg">
                    View All Scholarships
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No scholarships available at the moment.</p>
              <p className="text-gray-400">Check back soon for new opportunities!</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">
            Join thousands of students who have found their perfect scholarship match
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
