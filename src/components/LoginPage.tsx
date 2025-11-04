import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { motion } from 'motion/react';
import { Baby, Heart, AlertCircle, Sparkles, Shield, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupRole, setSignupRole] = useState('patient');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(loginEmail, loginPassword);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signup(signupEmail, signupPassword, signupName, signupRole);
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleInfo = {
    patient: {
      label: 'Patient',
      description: 'Expecting mother accessing personal health records',
      icon: User,
      gradient: 'from-pink-500 to-rose-500'
    },
    nurse: {
      label: 'Nurse',
      description: 'Healthcare provider managing patient care',
      icon: Heart,
      gradient: 'from-green-500 to-emerald-500'
    },
    midwife: {
      label: 'Midwife',
      description: 'Specialist in pregnancy and childbirth',
      icon: Baby,
      gradient: 'from-purple-500 to-pink-500'
    },
    doctor: {
      label: 'Doctor',
      description: 'Medical physician with full access',
      icon: Shield,
      gradient: 'from-cyan-500 to-blue-500'
    },
    admin: {
      label: 'Administrator',
      description: 'System administrator with complete control',
      icon: Shield,
      gradient: 'from-orange-500 to-red-500'
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      ></div>

      <div className="w-full max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div 
            className="flex items-center justify-center gap-2 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", delay: 0.2 }}
          >
            <div className="relative">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl blur-xl opacity-75"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
              <div className="relative bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 p-4 rounded-2xl">
                <Baby className="h-10 w-10 text-white" />
              </div>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-gradient mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Maternal Health Tracking System
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 text-muted-foreground"
          >
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <p>Comprehensive care for mothers and babies</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="glass-card border-border/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-cyan-400" />
                <CardTitle>Welcome</CardTitle>
              </div>
              <CardDescription>
                Sign in to access the maternal health management system
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Alert variant="destructive" className="mb-4 glass-card border-red-500/50">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 glass-card border border-border/50">
                  <TabsTrigger value="login" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/20 data-[state=active]:to-blue-500/20 data-[state=active]:text-cyan-400">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:text-purple-400">
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-foreground">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your.email@hospital.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="glass-card border-border/50 focus:border-cyan-500/50 bg-input-background text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-foreground">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="glass-card border-border/50 focus:border-cyan-500/50 bg-input-background text-foreground"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 relative overflow-hidden group" 
                      disabled={isLoading}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                      ></motion.div>
                      <span className="relative z-10">
                        {isLoading ? 'Signing in...' : 'Sign In'}
                      </span>
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-foreground">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Jane Smith"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        required
                        className="glass-card border-border/50 focus:border-purple-500/50 bg-input-background text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your.email@hospital.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                        className="glass-card border-border/50 focus:border-purple-500/50 bg-input-background text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        minLength={6}
                        className="glass-card border-border/50 focus:border-purple-500/50 bg-input-background text-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-role" className="text-foreground">I am a...</Label>
                      <Select value={signupRole} onValueChange={setSignupRole}>
                        <SelectTrigger className="glass-card border-border/50 bg-input-background text-foreground">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="glass-card border-border/50">
                          {Object.entries(roleInfo).map(([key, info]) => {
                            const Icon = info.icon;
                            return (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-3 py-1">
                                  <div className={`p-1.5 rounded-lg bg-gradient-to-br ${info.gradient}`}>
                                    <Icon className="h-4 w-4 text-white" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{info.label}</div>
                                    <div className="text-xs text-muted-foreground">{info.description}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 relative overflow-hidden group" 
                      disabled={isLoading}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                      ></motion.div>
                      <span className="relative z-10">
                        {isLoading ? 'Creating account...' : 'Create Account'}
                      </span>
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <motion.div 
                className="mt-6 text-center text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="flex items-center justify-center gap-1 text-muted-foreground">
                  <Heart className="h-3 w-3 text-pink-500 animate-pulse" />
                  Caring for mothers and babies with technology
                </p>
              </motion.div>
            </CardContent>
          </Card>

          <motion.p 
            className="text-center text-xs text-muted-foreground mt-4 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Shield className="h-3 w-3" />
            Demo System - Not for collecting real PHI
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};
