import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Users, BookOpen, Shield } from "lucide-react";
import { useLocation } from "wouter";

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30),
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  role: z.enum(["teacher", "student"]),
  institution: z.string().min(1, "Institution is required")
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

type RegisterForm = z.infer<typeof registerSchema>;
type LoginForm = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      role: "student",
      institution: ""
    }
  });

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterForm) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast({
        title: "Registration successful",
        description: "Welcome to IntelliTutorAI!",
      });
      navigate("/");
    },
    onError: (error: any) => {
      toast({
        title: "Registration failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    }
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate("/");
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
    }
  });

  const onRegister = (data: RegisterForm) => {
    setIsLoading(true);
    registerMutation.mutate(data);
    setIsLoading(false);
  };

  const onLogin = (data: LoginForm) => {
    setIsLoading(true);
    loginMutation.mutate(data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--light-bg)" }}>
      <div className="container mx-auto flex min-h-screen">
        {/* Left side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: "var(--gradient)" }}>
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">IntelliTutorAI</h1>
              <p className="text-gray-600">Your intelligent learning companion</p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Sign in to your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          {...loginForm.register("email")}
                          className="rounded-lg"
                        />
                        {loginForm.formState.errors.email && (
                          <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          {...loginForm.register("password")}
                          className="rounded-lg"
                        />
                        {loginForm.formState.errors.password && (
                          <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full rounded-lg"
                        style={{ background: "var(--gradient)" }}
                        disabled={isLoading || loginMutation.isPending}
                      >
                        {isLoading || loginMutation.isPending ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Account</CardTitle>
                    <CardDescription>Join IntelliTutorAI today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          placeholder="Choose a username"
                          {...registerForm.register("username")}
                          className="rounded-lg"
                        />
                        {registerForm.formState.errors.username && (
                          <p className="text-sm text-red-500">{registerForm.formState.errors.username.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          {...registerForm.register("email")}
                          className="rounded-lg"
                        />
                        {registerForm.formState.errors.email && (
                          <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select 
                          value={registerForm.watch("role")} 
                          onValueChange={(value) => registerForm.setValue("role", value as "teacher" | "student")}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="teacher">Teacher</SelectItem>
                          </SelectContent>
                        </Select>
                        {registerForm.formState.errors.role && (
                          <p className="text-sm text-red-500">{registerForm.formState.errors.role.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="institution">Institution</Label>
                        <Input
                          id="institution"
                          placeholder="Enter your institution"
                          {...registerForm.register("institution")}
                          className="rounded-lg"
                        />
                        {registerForm.formState.errors.institution && (
                          <p className="text-sm text-red-500">{registerForm.formState.errors.institution.message}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create a password (min 4 characters)"
                          {...registerForm.register("password")}
                          className="rounded-lg"
                        />
                        {registerForm.formState.errors.password && (
                          <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full rounded-lg"
                        style={{ background: "var(--gradient)" }}
                        disabled={isLoading || registerMutation.isPending}
                      >
                        {isLoading || registerMutation.isPending ? "Creating account..." : "Create Account"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right side - Hero */}
        <div className="flex-1 flex items-center justify-center p-8" style={{ background: "var(--gradient)" }}>
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Welcome to the Future of Learning</h2>
            <p className="text-xl mb-8 opacity-90">
              Experience personalized AI tutoring that adapts to your learning style and pace
            </p>
            
            <div className="grid grid-cols-1 gap-6 max-w-md mx-auto">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Personalized Learning</h3>
                  <p className="text-sm opacity-80">AI adapts to your learning style</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Collaborative Platform</h3>
                  <p className="text-sm opacity-80">Connect with teachers and students</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Secure & Private</h3>
                  <p className="text-sm opacity-80">Your data is protected and secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}