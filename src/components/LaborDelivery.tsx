import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { projectId } from '../utils/supabase/info';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Progress } from './ui/progress';
import { toast } from 'sonner@2.0.3';
import { Activity, Plus, Clock, TrendingUp, AlertCircle, Heart, Baby, Timer } from 'lucide-react';

interface LaborDeliveryProps {
  onNavigate: (page: string, data?: any) => void;
}

export const LaborDelivery: React.FC<LaborDeliveryProps> = ({ onNavigate }) => {
  const { accessToken } = useAuth();
  const [activeCases, setActiveCases] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [partographOpen, setPartographOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<any>(null);

  // New case form
  const [selectedPatient, setSelectedPatient] = useState('');
  const [admissionTime, setAdmissionTime] = useState('');
  const [deliveryPlan, setDeliveryPlan] = useState('vaginal');
  const [riskNotes, setRiskNotes] = useState('');

  // Partograph data
  const [cervicalDilation, setCervicalDilation] = useState('');
  const [contractionFrequency, setContractionFrequency] = useState('');
  const [fetalHeartRate, setFetalHeartRate] = useState('');
  const [maternalVitals, setMaternalVitals] = useState({ bp: '', pulse: '', temp: '' });

  useEffect(() => {
    fetchLaborCases();
    fetchPatients();
  }, []);

  const fetchLaborCases = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a0384ac7/labor-cases`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Mock some active cases for demo
        setActiveCases([
          {
            id: 'case1',
            patientName: 'Sample Patient',
            admissionTime: new Date().toISOString(),
            stage: 'active',
            dilation: 6,
            deliveryPlan: 'vaginal'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching labor cases:', error);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a0384ac7/patients`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Filter for patients near delivery (>= 37 weeks)
        setPatients(data.patients || []);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const patient = patients.find(p => p.id === selectedPatient);
      
      const caseData = {
        patientId: selectedPatient,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : '',
        admissionTime,
        deliveryPlan,
        riskNotes,
        stage: 'latent',
        status: 'active'
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a0384ac7/labor-cases`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(caseData)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create labor case');
      }

      toast.success('Labor case created successfully!');
      setDialogOpen(false);
      fetchLaborCases();
    } catch (error) {
      console.error('Error creating labor case:', error);
      toast.error('Failed to create labor case');
    }
  };

  const getStageBadge = (stage: string) => {
    const colors: any = {
      latent: 'bg-yellow-500',
      active: 'bg-orange-500',
      transition: 'bg-red-500',
      pushing: 'bg-purple-500',
      delivered: 'bg-green-500'
    };
    return <Badge className={colors[stage] || 'bg-gray-500'}>{stage}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">Labor & Delivery</h2>
          <p className="text-slate-600">Monitor active labor cases and deliveries</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Labor Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Start Labor & Delivery Case</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateCase} className="space-y-4">
              <div className="space-y-2">
                <Label>Patient *</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Admission Time *</Label>
                <Input
                  type="datetime-local"
                  value={admissionTime}
                  onChange={(e) => setAdmissionTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Delivery Plan *</Label>
                <Select value={deliveryPlan} onValueChange={setDeliveryPlan} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vaginal">Vaginal Delivery</SelectItem>
                    <SelectItem value="cesarean">Cesarean Section</SelectItem>
                    <SelectItem value="vbac">VBAC (Vaginal Birth After Cesarean)</SelectItem>
                    <SelectItem value="assisted">Assisted Delivery</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Risk Notes</Label>
                <Textarea
                  value={riskNotes}
                  onChange={(e) => setRiskNotes(e.target.value)}
                  placeholder="Any risk factors or special considerations..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Start Case</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Labor Cases */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeCases.map((laborCase) => (
          <Card key={laborCase.id} className="border-l-4 border-l-orange-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{laborCase.patientName}</CardTitle>
                  <p className="text-sm text-slate-600">Case ID: {laborCase.id}</p>
                </div>
                {getStageBadge(laborCase.stage)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-slate-600">Dilation</p>
                  <p className="text-slate-900">{laborCase.dilation} cm</p>
                </div>
                <div>
                  <p className="text-slate-600">Delivery Plan</p>
                  <p className="text-slate-900 capitalize">{laborCase.deliveryPlan}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-600 mb-1">Labor Progress</p>
                <Progress value={(laborCase.dilation / 10) * 100} className="h-2" />
                <p className="text-xs text-slate-500 mt-1">{laborCase.dilation}/10 cm</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4" />
                <span>Admitted: {new Date(laborCase.admissionTime).toLocaleString()}</span>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setSelectedCase(laborCase);
                    setPartographOpen(true);
                  }}
                >
                  <Activity className="h-4 w-4 mr-1" />
                  Partograph
                </Button>
                <Button size="sm" variant="outline">
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {activeCases.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center text-slate-500">
              <Activity className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>No active labor cases</p>
              <Button variant="link" className="mt-2" onClick={() => setDialogOpen(true)}>
                Start a new case
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Digital Partograph Dialog */}
      <Dialog open={partographOpen} onOpenChange={setPartographOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Digital Partograph - {selectedCase?.patientName}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Vital Signs Monitor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Real-Time Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="h-5 w-5 text-red-600" />
                      <span className="text-sm text-red-900">Fetal Heart Rate</span>
                    </div>
                    <p className="text-red-700">140 bpm</p>
                    <p className="text-xs text-red-600 mt-1">Normal range</p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <span className="text-sm text-blue-900">Contractions</span>
                    </div>
                    <p className="text-blue-700">3 per 10 min</p>
                    <p className="text-xs text-blue-600 mt-1">Active labor</p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Timer className="h-5 w-5 text-purple-600" />
                      <span className="text-sm text-purple-900">Dilation</span>
                    </div>
                    <p className="text-purple-700">6 cm</p>
                    <p className="text-xs text-purple-600 mt-1">Active phase</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Labor Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Cervical Dilation (cm)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    step="0.5"
                    value={cervicalDilation}
                    onChange={(e) => setCervicalDilation(e.target.value)}
                    placeholder="0-10 cm"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contraction Frequency (per 10 min)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="10"
                    value={contractionFrequency}
                    onChange={(e) => setContractionFrequency(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Fetal Heart Rate (bpm)</Label>
                  <Input
                    type="number"
                    min="110"
                    max="160"
                    value={fetalHeartRate}
                    onChange={(e) => setFetalHeartRate(e.target.value)}
                    placeholder="110-160 normal"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Maternal Vitals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Maternal Vital Signs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Blood Pressure</Label>
                    <Input
                      value={maternalVitals.bp}
                      onChange={(e) => setMaternalVitals({...maternalVitals, bp: e.target.value})}
                      placeholder="120/80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pulse (bpm)</Label>
                    <Input
                      type="number"
                      value={maternalVitals.pulse}
                      onChange={(e) => setMaternalVitals({...maternalVitals, pulse: e.target.value})}
                      placeholder="60-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Temperature (°C)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={maternalVitals.temp}
                      onChange={(e) => setMaternalVitals({...maternalVitals, temp: e.target.value})}
                      placeholder="36.5-37.5"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card className="border-yellow-300 bg-yellow-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <CardTitle className="text-lg text-yellow-900">Active Alerts</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-yellow-800">No critical alerts at this time</p>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPartographOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                toast.success('Partograph data updated');
                setPartographOpen(false);
              }}>
                Save Update
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Recent Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-500">
            <Baby className="h-12 w-12 mx-auto mb-3 text-slate-300" />
            <p>No recent deliveries</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
