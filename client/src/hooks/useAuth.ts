import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  institution: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export function useAuth() {
  const [, navigate] = useLocation();

  const { data: user, isLoading, error, refetch } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) return null;

      try {
        const response = await apiRequest("GET", "/api/auth/user");
        const userData = await response.json();
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return null;
      }
    },
    retry: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
  });

  // Auto-retry authentication on mount if we have a token but no user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user && !isLoading) {
      refetch();
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    logout,
    refetch,
  };
}