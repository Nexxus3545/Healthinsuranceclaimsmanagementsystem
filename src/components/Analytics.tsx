import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Baby, Activity, Calendar } from 'lucide-react';
import { PageHeader } from './PageHeader';

interface AnalyticsProps {
  onNavigate?: (page: string) => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ onNavigate }) => {
  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', deliveries: 12, prenatal: 45, postnatal: 15 },
    { month: 'Feb', deliveries: 15, prenatal: 52, postnatal: 18 },
    { month: 'Mar', deliveries: 10, prenatal: 48, postnatal: 12 },
    { month: 'Apr', deliveries: 18, prenatal: 55, postnatal: 20 },
    { month: 'May', deliveries: 14, prenatal: 50, postnatal: 16 },
    { month: 'Jun', deliveries: 16, prenatal: 58, postnatal: 19 }
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: 65, color: '#10b981' },
    { name: 'Medium Risk', value: 25, color: '#f59e0b' },
    { name: 'High Risk', value: 10, color: '#ef4444' }
  ];

  const deliveryTypes = [
    { name: 'Vaginal', value: 70, color: '#3b82f6' },
    { name: 'Cesarean', value: 25, color: '#8b5cf6' },
    { name: 'Assisted', value: 5, color: '#ec4899' }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics & Reports"
        description="Maternal health statistics and trends"
        icon={TrendingUp}
        onBack={onNavigate ? () => onNavigate('dashboard') : undefined}
      />
      <div>
        <h2 className="text-slate-900">Analytics & Reports</h2>
        <p className="text-slate-600">Maternity trends and statistics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">Total Patients</p>
                <p className="text-slate-900 mb-1">245</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12% vs last month</span>
                </div>
              </div>
              <div className="bg-blue-500 p-3 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">Active Pregnancies</p>
                <p className="text-slate-900 mb-1">156</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+8% vs last month</span>
                </div>
              </div>
              <div className="bg-pink-500 p-3 rounded-lg">
                <Baby className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">This Month Deliveries</p>
                <p className="text-slate-900 mb-1">16</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+14% vs last month</span>
                </div>
              </div>
              <div className="bg-purple-500 p-3 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">Appointments</p>
                <p className="text-slate-900 mb-1">428</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+18% vs last month</span>
                </div>
              </div>
              <div className="bg-green-500 p-3 rounded-lg">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Deliveries and visits over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="deliveries" stroke="#8b5cf6" name="Deliveries" />
                <Line type="monotone" dataKey="prenatal" stroke="#3b82f6" name="Prenatal Visits" />
                <Line type="monotone" dataKey="postnatal" stroke="#ec4899" name="Postnatal Visits" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Visit Types */}
        <Card>
          <CardHeader>
            <CardTitle>Visit Distribution</CardTitle>
            <CardDescription>Breakdown by appointment type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="prenatal" fill="#3b82f6" name="Prenatal" />
                <Bar dataKey="postnatal" fill="#ec4899" name="Postnatal" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
            <CardDescription>Current pregnancy risk levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Delivery Types */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Methods</CardTitle>
            <CardDescription>Distribution of delivery types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deliveryTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deliveryTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Summary Statistics</CardTitle>
          <CardDescription>Overall system performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <p className="text-sm text-blue-700 mb-1">Average Prenatal Visits</p>
              <p className="text-blue-900">8.5 visits per pregnancy</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-pink-50 to-pink-100 rounded-lg">
              <p className="text-sm text-pink-700 mb-1">Success Rate</p>
              <p className="text-pink-900">98.5% healthy deliveries</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <p className="text-sm text-green-700 mb-1">Patient Satisfaction</p>
              <p className="text-green-900">4.8/5.0 average rating</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
