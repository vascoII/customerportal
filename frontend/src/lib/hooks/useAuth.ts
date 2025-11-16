import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { useSecurity } from "@/lib/hooks/useSecurity";
import { handleApiError } from "@/lib/api/client";
import type { LoginCredentials } from "@/lib/hooks/useSecurity";
import type { AuthCheckResponse } from "@/lib/types/api";

/**
 * Custom hook for authentication
 * 
 * High-level hook that provides authentication state and methods for login, logout, and session management.
 * This hook wraps `useSecurity` and adds:
 * - Zustand store integration for persistent state
 * - Automatic redirection after login/logout
 * - Combined state management (store + server check)
 * 
 * For advanced use cases (reset password, update password, etc.), use `useSecurity` directly.
 * 
 * @example
 * ```tsx
 * const { login, logout, isAuthenticated, isLoading, error } = useAuth();
 * 
 * // Login with automatic redirection
 * await login({ username: "user@example.com", password: "password123" });
 * // → Automatically redirects to /dashboard or /occupant based on role
 * 
 * // Logout with automatic cleanup and redirection
 * await logout();
 * // → Clears store, queries, and redirects to /login
 * ```
 */
export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Use useSecurity for all API calls
  const security = useSecurity();
  
  // Zustand store for persistent state
  const {
    user,
    roles,
    sessionId,
    pkUser,
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

  // Use a conditional query for auth check that shares the same query key as useSecurity
  // This allows us to control when it runs while sharing the cache
  const { data: authCheck, isLoading: isCheckingAuth } = useQuery<AuthCheckResponse>({
    queryKey: ["auth", "check"],
    queryFn: async () => {
      // Use the checkAuth function from useSecurity
      return security.checkAuth();
    },
    enabled: isAuthenticated, // Only check if we think we're authenticated
    retry: false,
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
  });

  /**
   * Login function with Zustand integration and automatic redirection
   */
  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      // Use security.login for the API call
      const data = await security.login(credentials);

      // Update store with user data (including pk_user for stateless API)
      setUser(data.user, data.roles, data.session_id, data.pk_user);

      // Redirect based on role
      if (data.roles.includes("ROLE_OCCUPANT")) {
        router.push("/occupant");
      } else if (data.roles.includes("ROLE_GESTIONNAIRE")) {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }

      return data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout function with Zustand cleanup and automatic redirection
   */
  const logout = async () => {
    try {
      // Use security.logout for the API call
      await security.logout();
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error("Logout error:", error);
    } finally {
      // Clear auth state in store
      clearAuth();

      // Clear all queries (security.logout already does this, but we ensure it)
      queryClient.clear();

      // Redirect to login
      router.push("/login");
    }
  };

  /**
   * Check session and sync store if authenticated
   * This function checks the server session and updates the store if a valid session exists
   * Useful for checking authentication on page load (e.g., login page)
   */
  const checkAndSyncSession = async (): Promise<boolean> => {
    try {
      const authCheck = await security.checkAuth();
      
      if (authCheck.authenticated && authCheck.user && authCheck.roles) {
        // Session exists on server, sync store
        // Note: For stateless API, we need sessionId and pkUser from login response
        // This method is kept for backward compatibility but may not work with stateless API
        setUser(authCheck.user, authCheck.roles, null, null);
        return true;
      } else {
        // No valid session, clear store
        clearAuth();
        return false;
      }
    } catch (error) {
      // If check fails, assume not authenticated
      clearAuth();
      return false;
    }
  };

  /**
   * Check if user is authenticated
   * Combines store state with server check
   */
  const isAuthenticatedState = isAuthenticated && authCheck?.authenticated !== false;

  /**
   * Combined loading state
   */
  const isLoading = storeLoading || security.isLoggingIn || security.isLoggingOut || isCheckingAuth;

  /**
   * Combined error state
   */
  const error = storeError || security.loginError;

  return {
    // State
    user,
    roles,
    sessionId,
    pkUser,
    isAuthenticated: isAuthenticatedState,
    isLoading,
    error: error ? handleApiError(error) : null,

    // Actions
    login,
    logout,
    checkAndSyncSession,

    // Role checks
    hasRole,
    hasAnyRole,

    // Mutation states
    isLoggingIn: security.isLoggingIn || storeLoading,
    isLoggingOut: security.isLoggingOut,
  };
}

