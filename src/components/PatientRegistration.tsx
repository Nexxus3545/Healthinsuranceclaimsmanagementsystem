import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { projectId } from '../utils/supabase/info';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';

interface PatientRegistrationProps {
  onNavigate: (page: string, data?: any) => void;
}

export const PatientRegistration: React.FC<PatientRegistrationProps> = ({ onNavigate }) => {
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Personal Information
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  
  // Medical History
  const [previousPregnancies, setPreviousPregnancies] = useState('');
  const [previousDeliveries, setPreviousDeliveries] = useState('');
  const [complications, setComplications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medications, setMedications] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  
  // Current Pregnancy
  const [lmp, setLmp] = useState(''); // Last Menstrual Period
  const [edd, setEdd] = useState(''); // Expected Delivery Date
  const [pregnancyStatus, setPregnancyStatus] = useState('active');
  const [riskLevel, setRiskLevel] = useState('low');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const patientData = {
        firstName,
        lastName,
        dateOfBirth,
        bloodType,
        phoneNumber,
        email,
        address,
        emergencyContact,
        emergencyPhone,
        medicalHistory: {
          previousPregnancies: parseInt(previousPregnancies) || 0,
          previousDeliveries: parseInt(previousDeliveries) || 0,
          complications,
          allergies,
          medications,
          medicalConditions
        },
        currentPregnancy: {
          lmp,
          edd,
          pregnancyStatus,
          riskLevel
        }
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a0384ac7/patients`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(patientData)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to register patient');
      }

      const result = await response.json();
      
      toast.success('Patient registered successfully!');
      onNavigate('patients');
    } catch (error) {
      console.error('Error registering patient:', error);
      toast.error('Failed to register patient. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => onNavigate('patients')} className="mb-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
          <h2 className="text-slate-900">Register New Patient</h2>
          <p className="text-slate-600">Complete the form to register an expecting mother</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg">
          <UserPlus className="h-6 w-6 text-blue-600" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic patient details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bloodType">Blood Type</Label>
                <Select value={bloodType} onValueChange={setBloodType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                <Input
                  id="emergencyContact"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical History */}
        <Card>
          <CardHeader>
            <CardTitle>Medical History (OB-Gyne Focused)</CardTitle>
            <CardDescription>Previous pregnancies and medical conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="previousPregnancies">Previous Pregnancies</Label>
                <Input
                  id="previousPregnancies"
                  type="number"
                  min="0"
                  value={previousPregnancies}
                  onChange={(e) => setPreviousPregnancies(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="previousDeliveries">Previous Deliveries</Label>
                <Input
                  id="previousDeliveries"
                  type="number"
                  min="0"
                  value={previousDeliveries}
                  onChange={(e) => setPreviousDeliveries(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="complications">Previous Pregnancy Complications</Label>
              <Textarea
                id="complications"
                value={complications}
                onChange={(e) => setComplications(e.target.value)}
                placeholder="List any previous complications..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="List any known allergies..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medications">Current Medications</Label>
              <Textarea
                id="medications"
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                placeholder="List current medications..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalConditions">Medical Conditions</Label>
              <Textarea
                id="medicalConditions"
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                placeholder="Diabetes, hypertension, etc..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Current Pregnancy */}
        <Card>
          <CardHeader>
            <CardTitle>Current Pregnancy Information</CardTitle>
            <CardDescription>Details about the current pregnancy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lmp">Last Menstrual Period (LMP) *</Label>
                <Input
                  id="lmp"
                  type="date"
                  value={lmp}
                  onChange={(e) => setLmp(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edd">Expected Delivery Date (EDD) *</Label>
                <Input
                  id="edd"
                  type="date"
                  value={edd}
                  onChange={(e) => setEdd(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pregnancyStatus">Pregnancy Status</Label>
                <Select value={pregnancyStatus} onValueChange={setPregnancyStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="riskLevel">Risk Level</Label>
                <Select value={riskLevel} onValueChange={setRiskLevel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onNavigate('patients')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Registering...' : 'Register Patient'}
          </Button>
        </div>
      </form>
    </div>
  );
};
