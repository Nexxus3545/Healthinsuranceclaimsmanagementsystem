import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { projectId } from '../utils/supabase/info';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import { Users, Calendar, Baby, Activity, TrendingUp, Clock, AlertCircle, CheckCircle2, Sparkles, Zap, Heart, FileHeart, User } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string, data?: any) => void;
}

interface Analytics {
  totalPatients: number;
  activePregnancies: number;
  todayAppointments: number;
  totalDeliveries: number;
  recentAppointments: any[];
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { accessToken, user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics>({
    totalPatients: 0,
    activePregnancies: 0,
    todayAppointments: 0,
    totalDeliveries: 0,
    recentAppointments: []
  });
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'patient') {
      fetchPatientProfile();
    } else {
      fetchAnalytics();
    }
  }, [user]);

  const fetchPatientProfile = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a0384ac7/my-profile`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPatientProfile(data.patient);
      }
    } catch (error) {
      console.error('Error fetching patient profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a0384ac7/analytics/dashboard`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateWeeksPregnant = (lmp: string) => {
    if (!lmp) return 'N/A';
    const lmpDate = new Date(lmp);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lmpDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    return weeks;
  };

  // Patient Dashboard
  if (user?.role === 'patient') {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Heart className="h-6 w-6 text-pink-400" />
            <h2 className="text-gradient">My Pregnancy Journey</h2>
          </div>
          <p className="text-muted-foreground">Welcome back, {user.name}! Here's your health overview</p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Baby className="h-12 w-12 text-pink-400" />
            </motion.div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        ) : patientProfile ? (
          <>
            {/* Pregnancy Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass-card border-border/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-rose-500/10"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Weeks Pregnant</p>
                        <p className="text-gradient text-3xl font-bold">
                          {patientProfile.currentPregnancy?.lmp ? 
                            calculateWeeksPregnant(patientProfile.currentPregnancy.lmp) : '-'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">weeks</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500">
                        <Baby className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass-card border-border/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Due Date</p>
                        <p className="text-foreground">
                          {patientProfile.currentPregnancy?.edd || 'Not set'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Estimated</p>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5 }}
              >
                <Card className="glass-card border-border/50 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10"></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Risk Level</p>
                        <Badge className={`${
                          patientProfile.currentPregnancy?.riskLevel === 'high' ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                          patientProfile.currentPregnancy?.riskLevel === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-amber-500' :
                          'bg-gradient-to-r from-green-500 to-emerald-500'
                        } border-0 text-white`}>
                          {patientProfile.currentPregnancy?.riskLevel || 'Low'} Risk
                        </Badge>
                      </div>
                      <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <CardTitle>Quick Actions</CardTitle>
                  </div>
                  <CardDescription>Manage your pregnancy care</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: 'My Appointments', action: () => onNavigate('appointments'), icon: Calendar, gradient: 'from-green-500 to-emerald-500' },
                      { label: 'Medical Records', action: () => onNavigate('records'), icon: FileHeart, gradient: 'from-blue-500 to-purple-500' },
                      { label: 'Documents', action: () => onNavigate('documents'), icon: Activity, gradient: 'from-teal-500 to-cyan-500' },
                      { label: 'Messages', action: () => onNavigate('messages'), icon: User, gradient: 'from-pink-500 to-rose-500' }
                    ].map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <motion.div
                          key={action.label}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outline"
                            className="h-auto py-6 flex-col gap-3 w-full glass-card border-border/50 hover:border-border relative overflow-hidden group"
                            onClick={action.action}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${action.gradient} relative z-10`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-sm text-foreground relative z-10">{action.label}</span>
                          </Button>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Health Tips & Reminders */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="glass-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                    Health Tips & Reminders
                  </CardTitle>
                  <CardDescription>Important information for your care</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-start gap-3 p-4 glass-card rounded-xl border border-green-500/30"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground">Stay Hydrated</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Drink at least 8 glasses of water daily</p>
                      </div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="flex items-start gap-3 p-4 glass-card rounded-xl border border-blue-500/30"
                    >
                      <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-foreground">Next Checkup Due</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Schedule your next prenatal visit</p>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : (
          <Card className="glass-card border-border/50">
            <CardContent className="p-12 text-center">
              <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-foreground mb-2">Complete Your Profile</p>
              <p className="text-sm text-muted-foreground mb-4">
                Your health information is not yet complete
              </p>
              <Button onClick={() => onNavigate('settings')} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 text-white">
                Update Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Staff Dashboard (existing code)
  const stats = [
    {
      title: 'Total Patients',
      value: analytics.totalPatients,
      icon: Users,
      gradient: 'from-cyan-500 to-blue-500',
      description: 'Registered mothers'
    },
    {
      title: 'Active Pregnancies',
      value: analytics.activePregnancies,
      icon: Baby,
      gradient: 'from-pink-500 to-rose-500',
      description: 'Currently pregnant'
    },
    {
      title: 'Today\'s Appointments',
      value: analytics.todayAppointments,
      icon: Calendar,
      gradient: 'from-green-500 to-emerald-500',
      description: 'Scheduled for today'
    },
    {
      title: 'Total Deliveries',
      value: analytics.totalDeliveries,
      icon: Activity,
      gradient: 'from-purple-500 to-violet-500',
      description: 'Successful births'
    }
  ];

  const quickActions = [
    { label: 'Register New Patient', action: () => onNavigate('register'), icon: Users, gradient: 'from-cyan-500 to-blue-500' },
    { label: 'Schedule Appointment', action: () => onNavigate('appointments'), icon: Calendar, gradient: 'from-green-500 to-emerald-500' },
    { label: 'Labor & Delivery', action: () => onNavigate('labor'), icon: Activity, gradient: 'from-purple-500 to-violet-500' },
    { label: 'View All Patients', action: () => onNavigate('patients'), icon: Users, gradient: 'from-pink-500 to-rose-500' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-cyan-400" />
          <h2 className="text-gradient">Dashboard</h2>
        </div>
        <p className="text-muted-foreground">Welcome to the Maternal Health Tracking System</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Card className="glass-card border-border/50 relative overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
                      <motion.p 
                        className="text-foreground mb-2 text-3xl font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring" }}
                      >
                        {loading ? (
                          <span className="inline-block w-16 h-8 bg-muted/30 rounded animate-pulse"></span>
                        ) : (
                          <span className="text-gradient">{stat.value}</span>
                        )}
                      </motion.p>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                    <motion.div 
                      className={`relative p-3 rounded-xl bg-gradient-to-br ${stat.gradient}`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} blur-xl opacity-50 animate-pulse`}></div>
                      <Icon className="h-6 w-6 text-white relative z-10" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="glass-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <CardTitle>Quick Actions</CardTitle>
            </div>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      className="h-auto py-6 flex-col gap-3 w-full glass-card border-border/50 hover:border-border relative overflow-hidden group"
                      onClick={action.action}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${action.gradient} relative z-10`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm text-foreground relative z-10">{action.label}</span>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-cyan-400" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Next scheduled visits</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center text-muted-foreground py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    <Sparkles className="h-8 w-8 text-cyan-400" />
                  </motion.div>
                  <p className="mt-3">Loading...</p>
                </div>
              ) : analytics.recentAppointments.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p>No upcoming appointments</p>
                  <Button
                    variant="link"
                    onClick={() => onNavigate('appointments')}
                    className="mt-2 text-cyan-400"
                  >
                    Schedule an appointment
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics.recentAppointments.slice(0, 5).map((apt: any, idx: number) => (
                    <motion.div
                      key={apt.id || idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.1 }}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between p-4 glass-card rounded-xl border border-border/30 hover:border-cyan-500/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-2 rounded-lg">
                          <Clock className="h-4 w-4 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-sm text-foreground">{apt.patientName}</p>
                          <p className="text-xs text-muted-foreground">{apt.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-foreground">{apt.time}</p>
                        <Badge variant="outline" className="text-xs border-cyan-500/30 text-cyan-400">
                          {apt.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts & Notifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-400" />
                Alerts & Reminders
              </CardTitle>
              <CardDescription>Important notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { icon: AlertCircle, title: 'High-Risk Case Alert', desc: '2 patients require immediate attention', gradient: 'from-red-500 to-rose-500' },
                  { icon: Clock, title: 'Pending Lab Results', desc: '5 results awaiting review', gradient: 'from-yellow-500 to-amber-500' },
                  { icon: CheckCircle2, title: 'Vaccinations Due', desc: '3 newborns due for immunizations', gradient: 'from-green-500 to-emerald-500' },
                  { icon: Baby, title: 'Postnatal Checkups', desc: '4 mothers scheduled this week', gradient: 'from-blue-500 to-cyan-500' }
                ].map((alert, idx) => {
                  const Icon = alert.icon;
                  return (
                    <motion.div
                      key={alert.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.7 + idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-start gap-3 p-4 glass-card rounded-xl border border-border/30 hover:border-border/50 transition-all relative overflow-hidden group"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${alert.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${alert.gradient} relative z-10`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 relative z-10">
                        <p className="text-sm text-foreground">{alert.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{alert.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 glass-card border-border/50 hover:border-purple-500/30 hover:bg-purple-500/10"
                onClick={() => onNavigate('notifications')}
              >
                View All Notifications
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="glass-card border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              System Overview
            </CardTitle>
            <CardDescription>Monthly statistics and trends</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: TrendingUp, label: 'Prenatal Visits', value: '124 this month', gradient: 'from-blue-500 to-cyan-500' },
                { icon: Baby, label: 'New Registrations', value: '18 this month', gradient: 'from-pink-500 to-rose-500' },
                { icon: Activity, label: 'Successful Deliveries', value: '12 this month', gradient: 'from-green-500 to-emerald-500' }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.9 + idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-4 p-4 glass-card rounded-xl border border-border/30 hover:border-border/50 transition-all relative overflow-hidden group"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} relative z-10`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="relative z-10">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-foreground mt-0.5">{stat.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
