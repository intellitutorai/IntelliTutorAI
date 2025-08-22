import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, Users, Shield, BookOpen, Brain, Clock, Star, CheckCircle, GraduationCap, Play, Youtube, FileText, HelpCircle, PenTool, Twitter, Instagram, Music, Send, Camera } from "lucide-react";
import { useState, useEffect } from "react";

export default function Landing() {
  const [currentText, setCurrentText] = useState(0);
  const [currentPartner, setCurrentPartner] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);

  const carouselTexts = [
    {
      title: "Your Intelligent Learning Companion",
      subtitle: "Experience personalized AI tutoring that adapts to your learning style and pace."
    },
    {
      title: "Master Every Subject with AI",
      subtitle: "Get instant help with homework, study plans, and educational content across all subjects."
    },
    {
      title: "Learn Smarter, Not Harder",
      subtitle: "Personalized learning paths and 24/7 AI support to accelerate your educational journey."
    },
    {
      title: "Transform Your Study Experience",
      subtitle: "Interactive AI tutoring that makes complex concepts simple and engaging."
    }
  ];

  const partners = [
    { name: "Stanbic Bank", logo: "🏦" },
    { name: "UNEB", logo: "📋" },
    { name: "St Mary's College Rushoroza", logo: "🎓" },
    { name: "Ministry of Education", logo: "🏛️" },
    { name: "UNICEF Uganda", logo: "🌍" }
  ];

  const features = [
    {
      icon: MessageSquare,
      title: "Chat",
      subtitle: "Real-time Help",
      description: "Get instant AI assistance with homework, explanations, and academic support 24/7",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: HelpCircle,
      title: "Quiz",
      subtitle: "Instant Quizzes",
      description: "Generate personalized quizzes and practice tests to reinforce your learning",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Youtube,
      title: "Academic Tube",
      subtitle: "Educational Videos",
      description: "Access curated educational content and AI-powered video recommendations",
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: PenTool,
      title: "IntelliWrite",
      subtitle: "Document Creation",
      description: "AI-powered writing assistant for essays, reports, and academic documents",
      gradient: "from-green-500 to-teal-500"
    }
  ];

  const reviews = [
    {
      text: "IntelliTutorAI has revolutionized my study routine. The personalized explanations help me understand complex concepts easily.",
      author: "Rwego Edward",
      role: "Co-founder",
      rating: 5
    },
    {
      text: "As a teacher, I love how I can track my students' progress and provide targeted support where needed.",
      author: "Mr. Bernard",
      role: "Teacher",
      rating: 5
    },
    {
      text: "The 24/7 availability means I can get help whenever I need it. Perfect for my busy schedule!",
      author: "Namara Mark",
      role: "Student",
      rating: 5
    },
    {
      text: "The Academic Tube feature has amazing educational videos that make learning so much more engaging.",
      author: "Sarah Mukasa",
      role: "Student",
      rating: 5
    },
    {
      text: "Building this platform has been incredible. The AI technology we've implemented truly personalizes education for every learner.",
      author: "Ayebare Paul",
      role: "Engineer",
      rating: 5
    }
  ];

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % carouselTexts.length);
    }, 4000);

    const partnerInterval = setInterval(() => {
      setCurrentPartner((prev) => (prev + 1) % partners.length);
    }, 3000);

    const reviewInterval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);

    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 6000);

    return () => {
      clearInterval(textInterval);
      clearInterval(partnerInterval);
      clearInterval(reviewInterval);
      clearInterval(featureInterval);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "var(--light-bg)" }}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3 animate-fade-in">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-300" style={{ background: "var(--gradient)" }}>
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">IntelliTutorAI</h1>
          </div>
          <Button 
            onClick={() => window.location.href = '/auth'} 
            className="transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{ background: "var(--gradient)" }}
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section with Carousel */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce" style={{ background: "var(--gradient)" }}>
            <GraduationCap className="h-8 w-8 text-white" />
          </div>

          {/* Carousel Text Container */}
          <div className="relative h-40 sm:h-32 mb-12 overflow-hidden">
            {carouselTexts.map((text, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentText 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform translate-y-8'
                }`}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  {text.title}
                </h1>
                <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto px-4">
                  {text.subtitle}
                </p>
              </div>
            ))}
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center space-x-2 mb-12">
            {carouselTexts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentText(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentText 
                    ? 'bg-blue-500 scale-110 shadow-lg' 
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button 
              size="lg" 
              className="px-8 py-3 text-lg transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              style={{ background: "var(--gradient)" }}
              onClick={() => window.location.href = '/auth'}
            >
              Get Started Free
            </Button>
          </div>
        </div>

        {/* Partner Logo Slider */}
        <div className="mb-16 bg-white/50 backdrop-blur-sm rounded-2xl p-8">
          <h3 className="text-center text-slate-600 mb-6 font-medium">Trusted by Leading Educational Institutions</h3>
          <div className="relative h-16 overflow-hidden">
            {partners.map((partner, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
                  index === currentPartner
                    ? 'opacity-100 transform scale-100'
                    : 'opacity-0 transform scale-95'
                }`}
              >
                <div className="flex items-center space-x-4 text-2xl font-semibold text-slate-700">
                  <span className="text-4xl">{partner.logo}</span>
                  <span>{partner.name}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-2 mt-4">
            {partners.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentPartner ? 'bg-blue-500' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Video Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">See IntelliTutorAI in Action</h2>
            <p className="text-slate-600 text-lg">Watch how our AI transforms the learning experience</p>
          </div>

          <div className="relative max-w-4xl mx-auto transform hover:scale-[1.02] transition-transform duration-500">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-slate-900 group">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/q2pw89tEfNs?si=zRYdzZOd7wVZAj7F&rel=0&modestbranding=1&showinfo=0"
                title="IntelliTutorAI Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />

              {/* Video Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>

            {/* Video Stats */}
            <div className="flex justify-center mt-6 space-x-8 text-sm text-slate-600">
              <div className="flex items-center space-x-2 animate-pulse">
                <Play className="h-4 w-4" />
                <span>2.5K+ Views</span>
              </div>
              <div className="flex items-center space-x-2 animate-pulse">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2 animate-pulse">
                <Users className="h-4 w-4" />
                <span>1000+ Students</span>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Features with Carousel Effect */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">Powerful Features at Your Fingertips</h2>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className={`transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                  index === currentFeature ? 'ring-2 ring-blue-500 shadow-2xl scale-105' : 'hover:shadow-xl'
                } cursor-pointer group`}
                onClick={() => setCurrentFeature(index)}
              >
                <CardContent className="p-6 text-center relative overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-r ${feature.gradient} shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-blue-600 font-medium mb-3">{feature.subtitle}</p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Navigation Dots */}
          <div className="flex justify-center space-x-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeature(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentFeature 
                    ? 'bg-blue-500 scale-110 shadow-lg' 
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 mb-16 transform hover:shadow-2xl transition-all duration-500">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Why Choose IntelliTutorAI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {[
                { title: "Smart Study Plans", desc: "Create personalized study schedules based on your goals and progress." },
                { title: "Interactive Practice", desc: "Engage with practice problems and quizzes tailored to your level." },
                { title: "Progress Tracking", desc: "Monitor your learning progress and identify areas for improvement." }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 group">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">{item.title}</h4>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {[
                { title: "Multi-Subject Support", desc: "Get help with math, science, history, literature, and more." },
                { title: "Secure & Private", desc: "Your data is protected with enterprise-grade security measures." },
                { title: "Teacher Dashboard", desc: "Educators can monitor student progress and provide targeted support." }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 group">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <h4 className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors duration-300">{item.title}</h4>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Animated Reviews Slider */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">What Our Users Say</h2>
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-2xl">
              {reviews.map((review, index) => (
                <Card
                  key={index}
                  className={`transition-all duration-1000 ease-in-out ${
                    index === currentReview
                      ? 'opacity-100 transform translate-x-0'
                      : 'opacity-0 transform translate-x-full absolute inset-0'
                  } shadow-2xl`}
                >
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                    <p className="text-slate-600 mb-6 text-lg italic">"{review.text}"</p>
                    <p className="font-semibold text-slate-800">- {review.author}</p>
                    <p className="text-blue-600 text-sm">{review.role}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Review Navigation */}
            <div className="flex justify-center space-x-2 mt-6">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReview(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentReview 
                      ? 'bg-blue-500 scale-110 shadow-lg' 
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white mb-16 transform hover:scale-[1.02] transition-all duration-500 shadow-2xl">
          <h2 className="text-4xl font-bold mb-4 animate-pulse">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of students and teachers already using IntelliTutorAI to achieve their educational goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl px-8 py-3"
              onClick={() => window.location.href = '/auth'}
            >
              Sign Up
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300 px-8 py-3"
              onClick={() => window.location.href = '/auth'}
            >
              Sign In
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient)" }}>
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">IntelliTutorAI</h3>
              </div>
              <p className="text-slate-400 mb-4">Empowering students with AI-driven personalized learning experiences.</p>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="p-3 bg-slate-800 rounded-xl hover:bg-blue-500 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="p-3 bg-slate-800 rounded-xl hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl">
                  <Camera className="h-5 w-5" />
                </a>
                <a href="#" className="p-3 bg-slate-800 rounded-xl hover:bg-black transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl">
                  <Send className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Builders */}
            <div>
              <h4 className="font-semibold mb-4">Built By</h4>
              <div className="space-y-2">
                <p className="text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer">Ayebare Paul</p>
                <p className="text-slate-400 hover:text-white transition-colors duration-300 cursor-pointer">Rwego Edward</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-slate-800 pt-8 text-center">
            <p className="text-slate-400">&copy; 2025 IntelliTutorAI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}