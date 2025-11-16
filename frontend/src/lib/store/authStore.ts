import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/lib/types/api";

/**
 * Authentication state interface
 */
interface AuthState {
  user: User | null;
  roles: UserRole[];
  sessionId: string | null;
  pkUser: number | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Authentication actions interface
 */
interface AuthActions {
  setUser: (user: User | null, roles: UserRole[], sessionId: string | null, pkUser: number | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

/**
 * Combined auth store type
 */
type AuthStore = AuthState & AuthActions;

/**
 * Initial state
 */
const initialState: AuthState = {
  user: null,
  roles: [],
  sessionId: null,
  pkUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Authentication store using Zustand with persistence
 * 
 * The store persists to localStorage to maintain authentication state
 * across page refreshes. However, the actual session is maintained
 * by the PHPSESSID cookie from the Symfony backend.
 * 
 * Note: The persist middleware is safe to use in Next.js as it only
 * accesses localStorage on the client side.
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      /**
       * Set user authentication data
       */
      setUser: (user, roles, sessionId, pkUser) => {
        set({
          user,
          roles,
          sessionId,
          pkUser,
          isAuthenticated: !!user,
          error: null,
        });
      },

      /**
       * Set loading state
       */
      setLoading: (isLoading) => {
        set({ isLoading });
      },

      /**
       * Set error message
       */
      setError: (error) => {
        set({ error });
      },

      /**
       * Clear authentication data (logout)
       */
      clearAuth: () => {
        set({
          ...initialState,
        });
      },

      /**
       * Check if user has a specific role
       */
      hasRole: (role) => {
        const { roles } = get();
        return roles.includes(role);
      },

      /**
       * Check if user has any of the specified roles
       */
      hasAnyRole: (rolesToCheck) => {
        const { roles } = get();
        return rolesToCheck.some((role) => roles.includes(role));
      },
    }),
    {
      name: "auth-storage", // localStorage key
      // Only persist user data, not loading/error states
      partialize: (state) => ({
        user: state.user,
        roles: state.roles,
        sessionId: state.sessionId,
        pkUser: state.pkUser,
        isAuthenticated: state.isAuthenticated,
      }),
      // Skip hydration errors in Next.js SSR
      skipHydration: false,
    }
  )
);

