import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { projectId } from '../utils/supabase/info';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Search, UserPlus, Eye, Phone, Calendar, AlertCircle, Users } from 'lucide-react';

interface PatientsListProps {
  onNavigate: (page: string, data?: any) => void;
}

export const PatientsList: React.FC<PatientsListProps> = ({ onNavigate }) => {
  const { accessToken } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phoneNumber?.includes(searchTerm)
  );

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'high':
        return <Badge className="bg-gradient-to-r from-red-500 to-rose-500 border-0 text-white">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 border-0 text-white">Medium Risk</Badge>;
      default:
        return <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 border-0 text-white">Low Risk</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 border-0 text-white">Active</Badge>;
      case 'completed':
        return <Badge className="bg-gradient-to-r from-slate-500 to-gray-500 border-0 text-white">Completed</Badge>;
      default:
        return <Badge className="border-border/50 text-muted-foreground">{status}</Badge>;
    }
  };

  const calculateWeeksPregnant = (lmp: string) => {
    if (!lmp) return 'N/A';
    const lmpDate = new Date(lmp);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lmpDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} weeks`;
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-6 w-6 text-purple-400" />
            <h2 className="text-gradient">Patients</h2>
          </div>
          <p className="text-muted-foreground">Manage registered expecting mothers</p>
        </div>
        <Button 
          onClick={() => onNavigate('register')}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Register New Patient
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="glass-card border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                All Patients 
                <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-300">
                  {filteredPatients.length}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2 flex-1 max-w-sm">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 glass-card border-border/50 focus:border-purple-500/50 bg-input-background text-foreground"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-4"
                >
                  <Users className="h-12 w-12 text-purple-400" />
                </motion.div>
                <p className="text-muted-foreground">Loading patients...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'No patients found matching your search' : 'No patients registered yet'}
                </p>
                {!searchTerm && (
                  <Button 
                    onClick={() => onNavigate('register')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white"
                  >
                    Register First Patient
                  </Button>
                )}
              </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Patient Name</TableHead>
                    <TableHead className="text-muted-foreground">Contact</TableHead>
                    <TableHead className="text-muted-foreground">Blood Type</TableHead>
                    <TableHead className="text-muted-foreground">Weeks Pregnant</TableHead>
                    <TableHead className="text-muted-foreground">Risk Level</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient, idx) => (
                    <motion.tr 
                      key={patient.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="border-border/50 hover:bg-purple-500/5 transition-colors"
                    >
                      <TableCell>
                        <div>
                          <p className="text-foreground">
                            {patient.firstName} {patient.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            DOB: {patient.dateOfBirth}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-foreground">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          {patient.phoneNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10">{patient.bloodType || 'N/A'}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-foreground">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {calculateWeeksPregnant(patient.currentPregnancy?.lmp)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getRiskBadge(patient.currentPregnancy?.riskLevel)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(patient.currentPregnancy?.pregnancyStatus)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onNavigate('patient-profile', { patient })}
                          className="glass-card border-border/50 hover:border-purple-500/30 hover:bg-purple-500/10"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
};
