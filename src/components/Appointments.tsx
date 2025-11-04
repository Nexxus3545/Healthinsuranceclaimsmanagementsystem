import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { projectId } from '../utils/supabase/info';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Calendar as CalendarIcon, Clock, Plus, Filter } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';

interface AppointmentsProps {
  onNavigate: (page: string, data?: any) => void;
  initialPatient?: any;
}

export const Appointments: React.FC<AppointmentsProps> = ({ onNavigate, initialPatient }) => {
  const { accessToken } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [selectedPatient, setSelectedPatient] = useState(initialPatient?.id || '');
  const [appointmentType, setAppointmentType] = useState('prenatal');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a0384ac7/appointments`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
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
        setPatients(data.patients || []);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const patient = patients.find(p => p.id === selectedPatient);
      
      const appointmentData = {
        patientId: selectedPatient,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : '',
        type: appointmentType,
        date: appointmentDate,
        time: appointmentTime,
        notes,
        status: 'scheduled'
      };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a0384ac7/appointments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(appointmentData)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create appointment');
      }

      toast.success('Appointment scheduled successfully!');
      setDialogOpen(false);
      fetchAppointments();
      
      // Reset form
      setSelectedPatient('');
      setAppointmentType('prenatal');
      setAppointmentDate('');
      setAppointmentTime('');
      setNotes('');
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to schedule appointment');
    } finally {
      setLoading(false);
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  const todayAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  const getTypeBadge = (type: string) => {
    const colors: any = {
      prenatal: 'bg-blue-500',
      postnatal: 'bg-pink-500',
      ultrasound: 'bg-purple-500',
      lab: 'bg-green-500',
      consultation: 'bg-yellow-500'
    };
    return <Badge className={colors[type] || 'bg-gray-500'}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-900">Appointments</h2>
          <p className="text-slate-600">Schedule and manage prenatal and postnatal checkups</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateAppointment} className="space-y-4">
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
                <Label>Appointment Type *</Label>
                <Select value={appointmentType} onValueChange={setAppointmentType} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prenatal">Prenatal Checkup</SelectItem>
                    <SelectItem value="postnatal">Postnatal Checkup</SelectItem>
                    <SelectItem value="ultrasound">Ultrasound</SelectItem>
                    <SelectItem value="lab">Lab Tests</SelectItem>
                    <SelectItem value="consultation">Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time *</Label>
                  <Input
                    type="time"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Scheduling...' : 'Schedule'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                {todayAppointments.length} appointment(s) on {selectedDate?.toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              Appointments for {selectedDate?.toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No appointments scheduled for this date</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-slate-900">{apt.patientName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-slate-500" />
                          <span className="text-sm text-slate-600">{apt.time}</span>
                        </div>
                      </div>
                      {getTypeBadge(apt.type)}
                    </div>
                    {apt.notes && (
                      <p className="text-sm text-slate-600 mt-2">{apt.notes}</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">Mark Complete</Button>
                      <Button size="sm" variant="outline">Reschedule</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>All Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p>No appointments scheduled</p>
            </div>
          ) : (
            <div className="space-y-2">
              {appointments.slice(0, 10).map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <CalendarIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-900">{apt.patientName}</p>
                      <p className="text-xs text-slate-500">
                        {apt.date} at {apt.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeBadge(apt.type)}
                    <Badge variant="outline">{apt.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
