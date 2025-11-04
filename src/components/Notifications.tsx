import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Bell, Calendar, AlertCircle, Syringe, Heart, CheckCircle2, Clock } from 'lucide-react';
import { PageHeader } from './PageHeader';

interface NotificationsProps {
  onNavigate?: (page: string) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ onNavigate }) => {
  const notifications = [
    {
      id: 1,
      type: 'appointment',
      icon: Calendar,
      color: 'blue',
      title: 'Upcoming Appointment Reminder',
      message: 'Sarah Johnson has an appointment tomorrow at 10:00 AM',
      time: '2 hours ago',
      priority: 'normal'
    },
    {
      id: 2,
      type: 'alert',
      icon: AlertCircle,
      color: 'red',
      title: 'High-Risk Patient Alert',
      message: 'Emma Davis (High Risk) - BP elevated at last checkup',
      time: '3 hours ago',
      priority: 'high'
    },
    {
      id: 3,
      type: 'vaccination',
      icon: Syringe,
      color: 'green',
      title: 'Vaccination Due',
      message: 'Baby Smith is due for 6-week immunizations',
      time: '5 hours ago',
      priority: 'normal'
    },
    {
      id: 4,
      type: 'lab',
      icon: Heart,
      color: 'purple',
      title: 'Lab Results Available',
      message: 'Glucose test results for Maria Garcia are ready for review',
      time: '1 day ago',
      priority: 'normal'
    },
    {
      id: 5,
      type: 'appointment',
      icon: Clock,
      color: 'yellow',
      title: 'Missed Appointment',
      message: 'Jennifer Lee missed her prenatal checkup yesterday',
      time: '1 day ago',
      priority: 'medium'
    }
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getColorClasses = (color: string) => {
    const colors: any = {
      blue: 'bg-blue-100 text-blue-600',
      red: 'bg-red-100 text-red-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      yellow: 'bg-yellow-100 text-yellow-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & Reminders"
        description="Important alerts and upcoming events"
        icon={Bell}
        onBack={onNavigate ? () => onNavigate('dashboard') : undefined}
        actions={
          <Button variant="outline" className="glass-card border-border/50">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark All as Read
          </Button>
        }
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Notifications</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${getColorClasses(notification.color)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-slate-900">{notification.title}</p>
                          {getPriorityBadge(notification.priority)}
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-slate-500">{notification.time}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Dismiss
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-500">
                <Calendar className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                <p>No appointment reminders</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Critical Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.filter(n => n.priority === 'high').map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-200"
                    >
                      <div className={`p-2 rounded-lg ${getColorClasses(notification.color)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 mb-1">{notification.title}</p>
                        <p className="text-sm text-slate-600">{notification.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reminders">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900 mb-2">SMS Reminders Sent Today</p>
                  <p className="text-blue-700">24 appointment reminders sent</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-900 mb-2">Email Notifications</p>
                  <p className="text-green-700">18 vaccination reminders queued</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-900">Email Notifications</p>
                <p className="text-sm text-slate-600">Receive notifications via email</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-900">SMS Reminders</p>
                <p className="text-sm text-slate-600">Send appointment reminders via SMS</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-900">Push Notifications</p>
                <p className="text-sm text-slate-600">Browser notifications for alerts</p>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
