import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Users, Shield, Zap, ArrowRight, Heart, Leaf, Sun } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const LandingPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  React.useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard/home');
    }
  }, [user, loading, navigate]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-gradient-pitta opacity-20 rounded-full blur-3xl animate-gentle-pulse"></div>
          <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-gradient-kapha opacity-20 rounded-full blur-3xl animate-gentle-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-healing opacity-10 rounded-full blur-3xl animate-gentle-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative container mx-auto px-6 py-20 lg:py-32">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            {/* Logo with Glowing Effect */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-healing rounded-2xl shadow-lotus flex items-center justify-center transform hover:scale-105 transition-ayur">
                  <Leaf className="w-10 h-10 text-white" />
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-healing rounded-2xl opacity-40 blur-xl animate-gentle-pulse"></div>
                </div>
              </div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-healing bg-clip-text text-transparent leading-tight">
              AyurAgent
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your Personal AI-Powered Ayurvedic Wellness Companion. 
              <span className="text-primary font-semibold"> Ancient Wisdom meets Modern AI </span>
              for personalized health recommendations tailored just for you.
            </p>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-lotus transition-ayur hover:border-primary/40">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-vata rounded-lg mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">AI Dosha Analysis</h3>
                <p className="text-muted-foreground text-sm">Advanced AI determines your unique Vata, Pitta, or Kapha constitution</p>
              </Card>

              <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-lotus transition-ayur hover:border-primary/40">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-pitta rounded-lg mx-auto mb-4">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Personalized Plans</h3>
                <p className="text-muted-foreground text-sm">Custom daily routines, diet plans, and herbal recommendations</p>
              </Card>

              <Card className="p-6 border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-lotus transition-ayur hover:border-primary/40">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-kapha rounded-lg mx-auto mb-4">
                  <Sun className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Daily Wellness</h3>
                <p className="text-muted-foreground text-sm">Track progress and build healthy Ayurvedic habits every day</p>
              </Card>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-16">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-healing hover:opacity-90 text-white font-semibold px-8 py-4 text-lg shadow-lotus transition-ayur hover:shadow-xl hover:scale-105">
                  Start Your Wellness Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              
              <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10 px-8 py-4 text-lg transition-ayur">
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mt-16 pt-8 border-t border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm">10,000+ Happy Users</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm">Privacy Protected</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm">AI-Powered Insights</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How AyurAgent Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the perfect blend of ancient Ayurvedic wisdom and cutting-edge AI technology
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <Card className="p-8 text-center hover:shadow-lotus transition-ayur">
              <div className="w-16 h-16 bg-gradient-vata rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Share Your Details</h3>
              <p className="text-muted-foreground">Tell our AI about your symptoms, lifestyle, age, and location through an intuitive chat interface.</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lotus transition-ayur">
              <div className="w-16 h-16 bg-gradient-pitta rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Analysis</h3>
              <p className="text-muted-foreground">Our advanced AI analyzes your data to determine your unique dosha constitution and current imbalances.</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lotus transition-ayur">
              <div className="w-16 h-16 bg-gradient-kapha rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Get Recommendations</h3>
              <p className="text-muted-foreground">Receive personalized daily routines, diet plans, and herbal remedies tailored to your needs.</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lotus transition-ayur">
              <div className="w-16 h-16 bg-gradient-healing rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
              <p className="text-muted-foreground">Monitor your wellness journey with daily tracking, reminders, and adaptive recommendations.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Why Choose AyurAgent?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gradient-pitta rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Personalized AI Insights</h3>
                    <p className="text-muted-foreground">Every recommendation is tailored to your unique constitution, lifestyle, and current health needs.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gradient-kapha rounded-lg flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Ancient Wisdom, Modern Science</h3>
                    <p className="text-muted-foreground">We combine 5000-year-old Ayurvedic principles with cutting-edge AI technology for optimal results.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gradient-vata rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Holistic Wellness Approach</h3>
                    <p className="text-muted-foreground">Address mind, body, and spirit through comprehensive lifestyle recommendations and daily practices.</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-gradient-to-br from-card to-muted/30 border-primary/20">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-healing rounded-full flex items-center justify-center mx-auto">
                  <Sun className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Start Your Free Journey</h3>
                <p className="text-muted-foreground">Join thousands of users who have transformed their health with personalized Ayurvedic guidance.</p>
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-healing hover:opacity-90 text-white font-semibold w-full">
                    Get Started Now - It's Free
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;