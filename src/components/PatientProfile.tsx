import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import {
  ArrowLeft,
  User,
  FileText,
  Calendar,
  Baby,
  Activity,
  Upload,
  Syringe,
  Heart,
  Phone,
  Mail,
  MapPin,
  AlertCircle
} from 'lucide-react';

interface PatientProfileProps {
  patient: any;
  onNavigate: (page: string, data?: any) => void;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({ patient, onNavigate }) => {
  const calculateProgress = () => {
    if (!patient.currentPregnancy?.lmp) return 0;
    const lmpDate = new Date(patient.currentPregnancy.lmp);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lmpDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = diffDays / 7;
    return Math.min((weeks / 40) * 100, 100);
  };

  const calculateWeeks = () => {
    if (!patient.currentPregnancy?.lmp) return 0;
    const lmpDate = new Date(patient.currentPregnancy.lmp);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lmpDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.floor(diffDays / 7);
  };

  const milestones = [
    { week: 12, title: 'First Trimester Complete', completed: calculateWeeks() >= 12 },
    { week: 20, title: 'Anatomy Scan', completed: calculateWeeks() >= 20 },
    { week: 28, title: 'Third Trimester', completed: calculateWeeks() >= 28 },
    { week: 36, title: 'Weekly Checkups Begin', completed: calculateWeeks() >= 36 },
    { week: 40, title: 'Expected Delivery', completed: calculateWeeks() >= 40 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" onClick={() => onNavigate('patients')} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Patients
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-slate-900 mb-1">
              {patient.firstName} {patient.lastName}
            </h2>
            <p className="text-slate-600">Patient ID: {patient.id.split(':')[1].slice(0, 8)}</p>
          </div>
          <div className="flex gap-2">
            <Badge className={
              patient.currentPregnancy?.riskLevel === 'high' ? 'bg-red-500' :
              patient.currentPregnancy?.riskLevel === 'medium' ? 'bg-yellow-500' :
              'bg-green-500'
            }>
              {patient.currentPregnancy?.riskLevel} Risk
            </Badge>
            <Badge className="bg-blue-500">
              {patient.currentPregnancy?.pregnancyStatus}
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Weeks Pregnant</p>
                <p className="text-slate-900">{calculateWeeks()} weeks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-pink-100 p-2 rounded-lg">
                <Heart className="h-5 w-5 text-pink-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Blood Type</p>
                <p className="text-slate-900">{patient.bloodType || 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Baby className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">Previous Deliveries</p>
                <p className="text-slate-900">{patient.medicalHistory?.previousDeliveries || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-600">EDD</p>
                <p className="text-slate-900 text-sm">{patient.currentPregnancy?.edd}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pregnancy Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Pregnancy Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-700">Week {calculateWeeks()} of 40</span>
                <span className="text-sm text-slate-700">{Math.round(calculateProgress())}%</span>
              </div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>

            <div className="space-y-2 mt-6">
              <p className="text-sm text-slate-700 mb-3">Pregnancy Milestones</p>
              {milestones.map((milestone) => (
                <div key={milestone.week} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    milestone.completed ? 'bg-green-100' : 'bg-slate-100'
                  }`}>
                    {milestone.completed ? (
                      <Activity className="h-4 w-4 text-green-600" />
                    ) : (
                      <span className="text-xs text-slate-500">{milestone.week}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${milestone.completed ? 'text-slate-900' : 'text-slate-500'}`}>
                      {milestone.title}
                    </p>
                    <p className="text-xs text-slate-500">Week {milestone.week}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="visits">Visits</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="baby">Baby</TabsTrigger>
        </TabsList>

        {/* Personal Information */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal & Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600">Phone:</span>
                    <span className="text-slate-900">{patient.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600">Email:</span>
                    <span className="text-slate-900">{patient.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                    <span className="text-slate-600">Address:</span>
                    <span className="text-slate-900">{patient.address || 'N/A'}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Emergency Contact</p>
                    <p className="text-slate-900">{patient.emergencyContact}</p>
                    <p className="text-sm text-slate-600">{patient.emergencyPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Date of Birth</p>
                    <p className="text-slate-900">{patient.dateOfBirth}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medical History */}
        <TabsContent value="medical">
          <Card>
            <CardHeader>
              <CardTitle>Medical History & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Previous Pregnancies</p>
                  <p className="text-slate-900">{patient.medicalHistory?.previousPregnancies || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Previous Deliveries</p>
                  <p className="text-slate-900">{patient.medicalHistory?.previousDeliveries || 0}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">Complications</p>
                <p className="text-slate-900">{patient.medicalHistory?.complications || 'None reported'}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">Allergies</p>
                <p className="text-slate-900">{patient.medicalHistory?.allergies || 'None reported'}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">Current Medications</p>
                <p className="text-slate-900">{patient.medicalHistory?.medications || 'None'}</p>
              </div>

              <div>
                <p className="text-sm text-slate-600 mb-1">Medical Conditions</p>
                <p className="text-slate-900">{patient.medicalHistory?.medicalConditions || 'None reported'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visit History */}
        <TabsContent value="visits">
          <Card>
            <CardHeader>
              <CardTitle>Visit History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No visits recorded yet</p>
                <Button variant="link" className="mt-2" onClick={() => onNavigate('appointments')}>
                  Schedule Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Medical Documents</CardTitle>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-500">
                <FileText className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No documents uploaded yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Baby Information */}
        <TabsContent value="baby">
          <Card>
            <CardHeader>
              <CardTitle>Baby Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900 mb-2">Expected Delivery Date</p>
                  <p className="text-blue-700">{patient.currentPregnancy?.edd}</p>
                </div>

                <div className="text-center py-8 text-slate-500">
                  <Baby className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p>Baby records will be available after delivery</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={() => onNavigate('appointments', { patient })}>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Button>
        <Button variant="outline" onClick={() => onNavigate('records', { patient })}>
          <FileText className="h-4 w-4 mr-2" />
          Add Medical Record
        </Button>
        <Button variant="outline" onClick={() => onNavigate('documents', { patient })}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>
    </div>
  );
};
