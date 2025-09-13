import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, type UserCategory } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Loader2, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Leaf,
  Users,
  GraduationCap,
  BookOpen,
  Baby
} from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    surname: '',
    nickname: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    category: '' as UserCategory | ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = [
    {
      value: 'preschool' as UserCategory,
      label: 'Preschool (3-5 years)',
      icon: Baby,
      description: 'Fun and simple environmental games for young children'
    },
    {
      value: 'middle-school' as UserCategory,
      label: 'Middle School (6-10 years)',
      icon: BookOpen,
      description: 'Interactive learning about nature and conservation'
    },
    {
      value: 'high-school' as UserCategory,
      label: 'High School (11-17 years)',
      icon: Users,
      description: 'Advanced environmental topics and climate challenges'
    },
    {
      value: 'college' as UserCategory,
      label: 'College (18+ years)',
      icon: GraduationCap,
      description: 'Complex environmental science and sustainability concepts'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!formData.category) {
      toast({
        title: "Please select a category",
        description: "Choose your age group to get personalized content.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const success = await register({
        username: formData.nickname || formData.fullName,
        email: formData.email,
        category: formData.category as UserCategory,
        password: formData.password
      });
      
      if (success.success) {
        toast({
          title: "Welcome to Game2Grow!",
          description: "Your account has been created successfully. Please check your email to verify your account.",
        });
        navigate('/');
      } else {
        toast({
          title: "Registration failed",
          description: success.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-background px-4 py-12">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-bounce-gentle">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-gradient-primary">
                Join Game2Grow
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Start your environmental learning adventure today
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surname" className="text-sm font-medium">
                    Surname *
                  </Label>
                  <Input
                    id="surname"
                    name="surname"
                    type="text"
                    placeholder="Enter your surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-sm font-medium">
                  Nickname *
                </Label>
                <Input
                  id="nickname"
                  name="nickname"
                  type="text"
                  placeholder="Choose a fun nickname for games"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  This will be displayed on leaderboards and in games
                </p>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium">
                    Phone Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Age Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: UserCategory) => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your age group" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center space-x-3">
                          <category.icon className="w-4 h-4" />
                          <div>
                            <p className="font-medium">{category.label}</p>
                            <p className="text-xs text-muted-foreground">{category.description}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Password */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="font-medium text-primary hover:text-primary-hover transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
                <Link 
                  to="/" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Back to Home
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Benefits Preview */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            What you'll get with your free account:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
            <div className="flex flex-col items-center space-y-1">
              <Leaf className="w-6 h-6 text-primary" />
              <span>Unlimited Games</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <span className="text-xl">🏆</span>
              <span>Achievement System</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <span className="text-xl">🤖</span>
              <span>AI Recommendations</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <span className="text-xl">📊</span>
              <span>Progress Tracking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;