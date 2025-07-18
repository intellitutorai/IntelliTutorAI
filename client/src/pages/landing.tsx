import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, Users, Shield, BookOpen, Brain, Clock, Star, CheckCircle, GraduationCap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: "var(--light-bg)" }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient)" }}>
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">IntelliTutorAI</h1>
          </div>
          <Button onClick={() => window.location.href = '/auth'} style={{ background: "var(--gradient)" }}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "var(--gradient)" }}>
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-6">
            Your Intelligent Learning Companion
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Experience personalized AI tutoring that adapts to your learning style and pace. 
            Get instant help with homework, study plans, and educational content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8 py-3 text-lg"
              style={{ background: "var(--gradient)" }}
              onClick={() => window.location.href = '/auth'}
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="px-8 py-3 text-lg"
              onClick={() => window.location.href = '/auth'}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Personalized Learning</h3>
              <p className="text-slate-600">
                AI adapts to your learning style and provides customized explanations and practice problems.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Instant Help</h3>
              <p className="text-slate-600">
                Get immediate answers to your questions with detailed explanations and step-by-step solutions.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">24/7 Availability</h3>
              <p className="text-slate-600">
                Study whenever you want with round-the-clock access to your AI tutor.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Why Choose IntelliTutorAI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-800">Smart Study Plans</h4>
                  <p className="text-slate-600">Create personalized study schedules based on your goals and progress.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-800">Interactive Practice</h4>
                  <p className="text-slate-600">Engage with practice problems and quizzes tailored to your level.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-800">Progress Tracking</h4>
                  <p className="text-slate-600">Monitor your learning progress and identify areas for improvement.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-800">Multi-Subject Support</h4>
                  <p className="text-slate-600">Get help with math, science, history, literature, and more.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-800">Secure & Private</h4>
                  <p className="text-slate-600">Your data is protected with enterprise-grade security measures.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-slate-800">Teacher Dashboard</h4>
                  <p className="text-slate-600">Educators can monitor student progress and provide targeted support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
                <p className="text-slate-600 mb-4">"IntelliTutorAI has revolutionized my study routine. The personalized explanations help me understand complex concepts easily."</p>
                <p className="font-semibold text-slate-800">- Sarah M., Student</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
                <p className="text-slate-600 mb-4">"As a teacher, I love how I can track my students' progress and provide targeted support where needed."</p>
                <p className="font-semibold text-slate-800">- Mr. Johnson, Teacher</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                </div>
                <p className="text-slate-600 mb-4">"The 24/7 availability means I can get help whenever I need it. Perfect for my busy schedule!"</p>
                <p className="font-semibold text-slate-800">- Alex K., Student</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-slate-600 mb-6">
            Join thousands of students and teachers already using IntelliTutorAI to achieve their educational goals.
          </p>
          <Button 
            size="lg" 
            style={{ background: "var(--gradient)" }}
            onClick={() => window.location.href = '/auth'}
          >
            Start Learning Today
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-slate-600">&copy; 2024 IntelliTutorAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
