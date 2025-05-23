
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Scholarship, Application } from '@/types';
import { dataService } from '@/services/dataService';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, DollarSign, Users, Clock, Building } from 'lucide-react';
import ApplicationModal from '@/components/ApplicationModal';

const ScholarshipDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const scholarshipData = dataService.getScholarshipById(id);
    if (!scholarshipData) {
      navigate('/scholarships');
      return;
    }
    
    setScholarship(scholarshipData);
    
    if (user && user.role === 'student') {
      const applications = dataService.getApplicationsByStudent(user.id);
      const alreadyApplied = applications.some(app => app.scholarshipId === id);
      setHasApplied(alreadyApplied);
    }
  }, [id, user, navigate]);

  if (!scholarship) {
    return <div>Loading...</div>;
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isExpired = new Date(scholarship.deadline) < new Date();
  const canApply = isAuthenticated && user?.role === 'student' && !hasApplied && !isExpired && user.isApproved;

  const handleApplySuccess = () => {
    setHasApplied(true);
    setShowApplicationModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {scholarship.name}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <Building className="h-5 w-5 mr-2" />
                {scholarship.universityName}
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge className="text-lg px-4 py-2">
                {formatAmount(scholarship.amount)}
              </Badge>
              {isExpired && (
                <Badge variant="destructive">Expired</Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Deadline</p>
                <p className={isExpired ? "text-red-500" : ""}>{formatDate(scholarship.deadline)}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Applications</p>
                <p>{scholarship.applicationCount}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <div>
                <p className="font-medium">Posted</p>
                <p>{formatDate(scholarship.createdAt)}</p>
              </div>
            </div>
          </div>

          {canApply && (
            <Button 
              size="lg" 
              className="w-full md:w-auto"
              onClick={() => setShowApplicationModal(true)}
            >
              Apply Now
            </Button>
          )}
          
          {hasApplied && (
            <Badge variant="secondary" className="w-full md:w-auto">
              Application Submitted
            </Badge>
          )}
          
          {!isAuthenticated && (
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full md:w-auto"
              onClick={() => navigate('/login')}
            >
              Login to Apply
            </Button>
          )}
        </div>

        {/* Description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-line">{scholarship.description}</p>
          </CardContent>
        </Card>

        {/* Eligibility */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Eligibility Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-line">{scholarship.eligibilityCriteria}</p>
          </CardContent>
        </Card>

        {/* Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {scholarship.requirements.map((requirement, index) => (
                <li key={index} className="text-gray-700">{requirement}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <ApplicationModal
          scholarship={scholarship}
          onClose={() => setShowApplicationModal(false)}
          onSuccess={handleApplySuccess}
        />
      )}
    </div>
  );
};

export default ScholarshipDetail;
