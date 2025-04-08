import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, RegisterData>;
};

type LoginData = Pick<InsertUser, "username" | "password">;
type RegisterData = InsertUser;

// Extended schema with email validation
const registerSchema = insertUserSchema.extend({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Create a default context value 
const defaultContextValue: AuthContextType = {
  user: null,
  isLoading: false,
  error: null,
  loginMutation: {} as UseMutationResult<SelectUser, Error, LoginData>,
  logoutMutation: {} as UseMutationResult<void, Error, void>,
  registerMutation: {} as UseMutationResult<SelectUser, Error, RegisterData>,
};

export const AuthContext = createContext<AuthContextType>(defaultContextValue);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [user, setUser] = useState<SelectUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          // Not authenticated - that's okay, just set user to null
          setUser(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch user'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, []);
  
  // Setup login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (userData: SelectUser) => {
      setUser(userData);
      queryClient.setQueryData(["/api/user"], userData);
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.username}!`,
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Login failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // Setup register mutation
  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      // Validate using the extended schema
      registerSchema.parse(credentials);
      
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (userData: SelectUser) => {
      setUser(userData);
      queryClient.setQueryData(["/api/user"], userData);
      toast({
        title: "Registration successful",
        description: `Welcome to DesignAI, ${userData.username}!`,
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Registration failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // Setup logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      setUser(null);
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully.",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Logout failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  // Provide context value
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
