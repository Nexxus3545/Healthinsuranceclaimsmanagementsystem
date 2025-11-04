import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Activity,
  Baby,
  Syringe,
  Bell,
  Package,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Heart,
  Stethoscope,
  ClipboardList,
  MessageSquare,
  Sparkles,
  User,
  FileHeart
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Patient-specific navigation
  const patientNavigation = [
    { name: 'My Dashboard', icon: LayoutDashboard, page: 'dashboard', gradient: 'from-cyan-500 to-blue-500' },
    { name: 'My Appointments', icon: Calendar, page: 'appointments', gradient: 'from-green-500 to-cyan-500' },
    { name: 'My Medical Records', icon: FileHeart, page: 'records', gradient: 'from-blue-500 to-purple-500' },
    { name: 'Documents', icon: ClipboardList, page: 'documents', gradient: 'from-teal-500 to-cyan-500' },
    { name: 'Messages', icon: MessageSquare, page: 'messages', gradient: 'from-cyan-500 to-teal-500' },
    { name: 'Notifications', icon: Bell, page: 'notifications', gradient: 'from-indigo-500 to-purple-500' },
    { name: 'Settings', icon: Settings, page: 'settings', gradient: 'from-slate-500 to-gray-500' },
  ];

  // Staff navigation (admin, doctor, midwife, nurse)
  const staffNavigation = [
    { name: 'Dashboard', icon: LayoutDashboard, page: 'dashboard', gradient: 'from-cyan-500 to-blue-500' },
    { name: 'Patients', icon: Users, page: 'patients', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Appointments', icon: Calendar, page: 'appointments', gradient: 'from-green-500 to-cyan-500' },
    { name: 'Medical Records', icon: FileText, page: 'records', gradient: 'from-blue-500 to-purple-500' },
    { name: 'Labor & Delivery', icon: Activity, page: 'labor', gradient: 'from-pink-500 to-rose-500' },
    { name: 'Postnatal Care', icon: Baby, page: 'postnatal', gradient: 'from-rose-500 to-pink-500' },
    { name: 'Vaccinations', icon: Syringe, page: 'vaccinations', gradient: 'from-amber-500 to-orange-500' },
    { name: 'Documents', icon: ClipboardList, page: 'documents', gradient: 'from-teal-500 to-cyan-500' },
    { name: 'Notifications', icon: Bell, page: 'notifications', gradient: 'from-indigo-500 to-purple-500' },
    { name: 'Inventory', icon: Package, page: 'inventory', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Billing', icon: CreditCard, page: 'billing', gradient: 'from-yellow-500 to-amber-500' },
    { name: 'Messages', icon: MessageSquare, page: 'messages', gradient: 'from-cyan-500 to-teal-500' },
    { name: 'Analytics', icon: Activity, page: 'analytics', gradient: 'from-violet-500 to-purple-500' },
    { name: 'Settings', icon: Settings, page: 'settings', gradient: 'from-slate-500 to-gray-500' },
  ];

  // Choose navigation based on user role
  const navigation = user?.role === 'patient' ? patientNavigation : staffNavigation;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'from-purple-500 to-pink-500';
      case 'doctor': return 'from-cyan-500 to-blue-500';
      case 'midwife': return 'from-pink-500 to-rose-500';
      case 'nurse': return 'from-green-500 to-cyan-500';
      case 'patient': return 'from-rose-500 to-pink-500';
      default: return 'from-slate-500 to-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Sparkles;
      case 'doctor': return Stethoscope;
      case 'midwife': return Baby;
      case 'nurse': return Heart;
      case 'patient': return User;
      default: return User;
    }
  };

  const RoleIcon = getRoleIcon(user?.role || 'patient');

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/4 -right-4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="glass-card sticky top-0 z-40 border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-cyan-500/10"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur-lg opacity-75 animate-glow"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 to-purple-500 p-2 rounded-xl">
                  <Heart className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-gradient">Maternal Health System</h1>
                <div className="flex items-center gap-1 text-xs text-cyan-400">
                  <Sparkles className="h-3 w-3" />
                  <span>AI-Powered Healthcare</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onNavigate('notifications')}
              className="relative hover:bg-purple-500/10"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-pink-500 rounded-full animate-pulse"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-cyan-500/10">
                  <Avatar className="h-8 w-8 ring-2 ring-cyan-500/50">
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-purple-500 text-white">
                      {user?.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="text-sm text-foreground">{user?.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{user?.role}</div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-card border-border/50">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={() => onNavigate('settings')} className="hover:bg-cyan-500/10">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem onClick={logout} className="hover:bg-red-500/10 text-red-400">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:sticky top-[65px] left-0 bottom-0 z-30
            w-64 glass-card border-r border-border/50
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto
          `}
        >
          <div className="p-4">
            <motion.div 
              className="mb-4 p-4 glass-card rounded-2xl relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${getRoleColor(user?.role || '')} opacity-10`}></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg">
                    <RoleIcon className="h-4 w-4 text-cyan-400" />
                  </div>
                  <span className="text-sm text-foreground">{user?.name}</span>
                </div>
                <Badge className={`text-xs bg-gradient-to-r ${getRoleColor(user?.role || '')} border-0 text-white`}>
                  {user?.role}
                </Badge>
              </div>
            </motion.div>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.page;
                
                return (
                  <motion.button
                    key={item.name}
                    onClick={() => {
                      onNavigate(item.page);
                      setSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all relative overflow-hidden group
                      ${isActive 
                        ? 'text-foreground' 
                        : 'text-muted-foreground hover:text-foreground'
                      }
                    `}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-10 rounded-xl`}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <div className={`relative z-10 p-2 rounded-lg ${isActive ? `bg-gradient-to-br ${item.gradient} text-white` : 'bg-muted/30 group-hover:bg-muted/50'}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="relative z-10">{item.name}</span>
                    {isActive && (
                      <motion.div 
                        className={`absolute right-2 w-1.5 h-1.5 bg-gradient-to-br ${item.gradient} rounded-full`}
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
