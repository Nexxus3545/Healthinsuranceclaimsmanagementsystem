import React from 'react';
import { Card, CardContent } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface PlaceholderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const Placeholder: React.FC<PlaceholderProps> = ({ icon: Icon, title, description }) => {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <Icon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
        <p className="text-slate-700 mb-1">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </CardContent>
    </Card>
  );
};
