import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { api, extractApiData, handleApiError } from "@/lib/api/client";
import type { LoginResponse, User, UserRole } from "@/lib/types/api";

/**
 * Login credentials interface
 */
export interface LoginCredentials {
  username: string;
  password: string;
}

/**
 * Custom hook for authentication
 * 
 * Provides authentication state and methods for login, logout, and session management
 */
export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    user,
    roles,
    sessionId,
    isAuthenticated,
    isLoading: storeLoading,
    error: storeError,
    setUser,
    setLoading,
    setError,
    clearAuth,
    hasRole,
    hasAnyRole,
  } = useAuthStore();

  /**
   * Query to check current authentication status
   */
  const { data: authCheck, isLoading: isCheckingAuth } = useQuery({
    queryKey: ["auth", "check"],
    queryFn: async () => {
      try {
        const response = await api.get("/security/check");
        return extractApiData<{ authenticated: boolean; user?: User; roles?: UserRole[] }>(response);
      } catch (error) {
        // If check fails, user is not authenticated
        return { authenticated: false };
      }
    },
    enabled: isAuthenticated, // Only check if we think we're authenticated
    retry: false,
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
  });

  /**
   * Login mutation
   */
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.post<LoginResponse>("/security/login", {
          username: credentials.username,
          password: credentials.password,
        });

        const data = extractApiData<LoginResponse>(response);
        return data;
      } catch (error) {
        const errorMessage = handleApiError(error);
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (data) => {
      // Update store with user data
      setUser(data.user, data.roles, data.session_id);

      // Invalidate and refetch auth check
      queryClient.invalidateQueries({ queryKey: ["auth", "check"] });

      // Redirect based on role
      if (data.roles.includes("ROLE_OCCUPANT")) {
        router.push("/occupant");
      } else if (data.roles.includes("ROLE_GESTIONNAIRE")) {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    },
    onError: () => {
      // Error is already set in mutationFn
    },
  });

  /**
   * Logout mutation
   */
  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        await api.post("/security/logout");
      } catch (error) {
        // Even if logout fails on server, clear local state
        console.error("Logout error:", error);
      }
    },
    onSuccess: () => {
      // Clear auth state
      clearAuth();

      // Clear all queries
      queryClient.clear();

      // Redirect to login
      router.push("/signin");
    },
  });

  /**
   * Login function
   */
  const login = async (credentials: LoginCredentials) => {
    return loginMutation.mutateAsync(credentials);
  };

  /**
   * Logout function
   */
  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

  /**
   * Check if user is authenticated
   * Combines store state with server check
   */
  const isAuthenticatedState = isAuthenticated && authCheck?.authenticated !== false;

  /**
   * Combined loading state
   */
  const isLoading = storeLoading || loginMutation.isPending || logoutMutation.isPending || isCheckingAuth;

  /**
   * Combined error state
   */
  const error = storeError || loginMutation.error;

  return {
    // State
    user,
    roles,
    sessionId,
    isAuthenticated: isAuthenticatedState,
    isLoading,
    error: error ? handleApiError(error) : null,

    // Actions
    login,
    logout,

    // Role checks
    hasRole,
    hasAnyRole,

    // Mutation states
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}

