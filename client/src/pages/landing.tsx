import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, MessageSquare, Users, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">AI Chat</h1>
          </div>
          <Button onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-slate-800 mb-6">
            AI-Powered Conversations
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Experience the future of AI communication with our advanced chat platform. 
            Get instant, intelligent responses for any question or task.
          </p>
          <Button 
            size="lg" 
            className="px-8 py-3 text-lg"
            onClick={() => window.location.href = '/auth'}
          >
            Get Started
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Conversations</h3>
              <p className="text-slate-600">
                Engage in natural, intelligent conversations with our advanced AI assistant.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">User Management</h3>
              <p className="text-slate-600">
                Comprehensive admin tools for managing users and monitoring conversations.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-slate-600">
                Your conversations are protected with enterprise-grade security and privacy.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Ready to start chatting?
          </h2>
          <p className="text-slate-600 mb-6">
            Join thousands of users already using our AI chat platform.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/auth'}
          >
            Sign In to Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
