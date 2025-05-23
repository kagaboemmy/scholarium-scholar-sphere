
import React from 'react';
import { Link } from 'react-router-dom';
import { Scholarship } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship }) => {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDeadline = (deadline: string) => {
    return new Date(deadline).toLocaleDateString();
  };

  const isDeadlineSoon = () => {
    const deadlineDate = new Date(scholarship.deadline);
    const now = new Date();
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const isExpired = () => {
    return new Date(scholarship.deadline) < new Date();
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-2">{scholarship.name}</CardTitle>
          <Badge variant={isExpired() ? "destructive" : isDeadlineSoon() ? "secondary" : "default"}>
            {formatAmount(scholarship.amount)}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{scholarship.universityName}</p>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 line-clamp-3 mb-4">
          {scholarship.description}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Deadline:</span>
            <span className={isExpired() ? "text-red-500" : isDeadlineSoon() ? "text-orange-500" : ""}>
              {formatDeadline(scholarship.deadline)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Applications:</span>
            <span>{scholarship.applicationCount}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Link to={`/scholarships/${scholarship.id}`} className="w-full">
          <Button className="w-full" disabled={isExpired()}>
            {isExpired() ? 'Expired' : 'View Details'}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ScholarshipCard;
